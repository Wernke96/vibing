import { NextRequest, NextResponse } from 'next/server';

// Free tone analysis using Hugging Face's free inference API
export async function POST(request: NextRequest) {
  try {
    const { message, desiredTone } = await request.json();

    if (!message || !desiredTone) {
      return NextResponse.json(
        { error: 'Message and desired tone are required' },
        { status: 400 }
      );
    }

    // Use Hugging Face's free inference API for sentiment analysis
    const sentimentResponse = await fetch(
      'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: message,
        }),
      }
    );

    let sentimentData = [];
    if (sentimentResponse.ok) {
      sentimentData = await sentimentResponse.json();
    }

    // Use a second free API for emotion detection
    const emotionResponse = await fetch(
      'https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: message,
        }),
      }
    );

    let emotionData = [];
    if (emotionResponse.ok) {
      emotionData = await emotionResponse.json();
    }

    // Analyze the results and provide feedback
    const analysis = generateAnalysis(message, sentimentData, emotionData, desiredTone);
    const suggestions = generateSuggestions(message, sentimentData, emotionData, desiredTone);

    return NextResponse.json({
      analysis,
      suggestions,
    });

  } catch (error) {
    console.error('Error in free tone analysis:', error);
    
    // Fallback to simple rule-based analysis if APIs fail
    const fallbackAnalysis = generateFallbackAnalysis(request);
    return fallbackAnalysis;
  }
}

function generateAnalysis(message: string, sentiment: any[], emotion: any[], desiredTone: string): string {
  // Process sentiment results
  let sentimentText = "neutral";
  if (sentiment && sentiment.length > 0 && Array.isArray(sentiment[0])) {
    const topSentiment = sentiment[0].reduce((prev: any, current: any) => 
      (prev.score > current.score) ? prev : current
    );
    sentimentText = topSentiment.label.toLowerCase().replace('label_', '');
  }

  // Process emotion results
  let emotionText = "neutral";
  if (emotion && emotion.length > 0 && Array.isArray(emotion[0])) {
    const topEmotion = emotion[0].reduce((prev: any, current: any) => 
      (prev.score > current.score) ? prev : current
    );
    emotionText = topEmotion.label.toLowerCase();
  }

  // Analyze message characteristics
  const hasExclamation = message.includes('!');
  const hasQuestion = message.includes('?');
  const isAllCaps = message === message.toUpperCase() && message !== message.toLowerCase();
  const wordCount = message.split(' ').length;

  let analysis = `Your message has a ${sentimentText} sentiment with ${emotionText} emotional undertones. `;

  if (isAllCaps) {
    analysis += "The use of all capital letters may come across as shouting or aggressive. ";
  }

  if (hasExclamation) {
    analysis += "The exclamation marks add enthusiasm but might be perceived as overly excited in professional contexts. ";
  }

  if (wordCount > 50) {
    analysis += "The message is quite lengthy, which might lose the reader's attention. ";
  } else if (wordCount < 5) {
    analysis += "The message is very brief, which might come across as curt or dismissive. ";
  }

  // Compare with desired tone
  const toneMatches = assessToneMatch(sentimentText, emotionText, desiredTone, message);
  if (!toneMatches) {
    analysis += `However, this doesn't quite align with your desired ${desiredTone} tone. `;
  } else {
    analysis += `This aligns well with your desired ${desiredTone} tone. `;
  }

  return analysis;
}

function generateSuggestions(message: string, sentiment: any[], emotion: any[], desiredTone: string): string {
  let suggestions = "";

  switch (desiredTone) {
    case 'empathetic':
      suggestions = generateEmpatheticSuggestions(message);
      break;
    case 'professional':
      suggestions = generateProfessionalSuggestions(message);
      break;
    case 'supportive':
      suggestions = generateSupportiveSuggestions(message);
      break;
    default:
      suggestions = "Consider using warmer language and acknowledging the recipient's perspective.";
  }

  // Add general improvements
  if (message === message.toUpperCase() && message !== message.toLowerCase()) {
    suggestions += "\n• Use normal capitalization instead of all caps to avoid appearing aggressive.";
  }

  if (message.split(' ').length > 50) {
    suggestions += "\n• Consider breaking your message into shorter paragraphs for better readability.";
  }

  if (!message.includes('please') && !message.includes('thank')) {
    suggestions += "\n• Add polite expressions like 'please' or 'thank you' to soften the tone.";
  }

  return suggestions;
}

function generateEmpatheticSuggestions(message: string): string {
  return `To make your message more empathetic:
• Start with acknowledgment: "I understand..." or "I can see that..."
• Use inclusive language: "we" instead of "you"
• Add emotional validation: "That must be frustrating" or "I appreciate your concern"
• Soften direct statements with phrases like "It seems like..." or "Perhaps we could..."`;
}

function generateProfessionalSuggestions(message: string): string {
  return `To make your message more professional:
• Use formal greetings and closings
• Replace emotional language with neutral, objective terms
• Structure your message with clear points and action items
• Use complete sentences and avoid contractions
• End with a clear call to action or next steps`;
}

function generateSupportiveSuggestions(message: string): string {
  return `To make your message more supportive:
• Offer specific help: "I can assist you with..." or "Would it help if I..."
• Use encouraging language: "You're on the right track" or "This is a great start"
• Acknowledge efforts: "I appreciate the work you've put into this"
• Provide reassurance: "Don't worry, we'll figure this out together"`;
}

function assessToneMatch(sentiment: string, emotion: string, desiredTone: string, message: string): boolean {
  switch (desiredTone) {
    case 'empathetic':
      return emotion === 'joy' || emotion === 'sadness' || message.includes('understand') || message.includes('feel');
    case 'professional':
      return sentiment === 'neutral' && !message.includes('!') && !message.includes('awesome');
    case 'supportive':
      return sentiment === 'positive' || emotion === 'joy' || message.includes('help') || message.includes('support');
    default:
      return true;
  }
}

async function generateFallbackAnalysis(request: NextRequest) {
  try {
    const { message, desiredTone } = await request.json();
    
    // Simple rule-based analysis as fallback
    const analysis = `Your message appears to have a moderate tone. ${
      message.includes('!') ? 'The exclamation marks add emphasis. ' : ''
    }${
      message === message.toUpperCase() ? 'Using all caps might seem aggressive. ' : ''
    }Consider adjusting the language to better match your desired ${desiredTone} tone.`;

    const suggestions = `To make your message more ${desiredTone}:
• Use appropriate greeting and closing
• Choose words that reflect ${desiredTone} communication
• Consider the recipient's perspective
• Review the message length and structure`;

    return NextResponse.json({
      analysis,
      suggestions,
      note: "Using basic analysis (advanced AI features temporarily unavailable)"
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to analyze message. Please try again.' },
      { status: 500 }
    );
  }
}
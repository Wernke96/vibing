import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, desiredTone } = await request.json();

    if (!message || !desiredTone) {
      return NextResponse.json(
        { error: 'Message and desired tone are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `You are a tone coach helping people improve their communication. 

Analyze the following message and provide feedback on its tone, then suggest improvements to make it more ${desiredTone}.

Message: "${message}"

Please provide:
1. A brief analysis of the current tone and how it might be perceived
2. Specific suggestions to make it more ${desiredTone}

Keep your response helpful and constructive.`;

    // Retry function with exponential backoff
    const makeRequestWithRetry = async (retries = 3, delay = 1000) => {
      for (let attempt = 0; attempt <= retries; attempt++) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful tone coach that provides constructive feedback on communication style.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          return response;
        }

        if (response.status === 429) {
          // Rate limited - check if we should retry
          if (attempt < retries) {
            console.log(`Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${retries + 1})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
            continue;
          } else {
            // Final attempt failed due to rate limiting
            return NextResponse.json(
              { error: 'OpenAI API is currently experiencing high demand. Please try again in a few minutes.' },
              { status: 429 }
            );
          }
        }

        // Other errors (not rate limiting)
        if (attempt === retries) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
      }
    };

    const response = await makeRequestWithRetry();

    const data = await response.json();
    const result = data.choices[0]?.message?.content || 'No analysis available';

    // Split the response into analysis and suggestions
    const parts = result.split(/\d+\.\s*/);
    const analysis = parts[1] || result;
    const suggestions = parts[2] || 'No specific suggestions available';

    return NextResponse.json({
      analysis: analysis.trim(),
      suggestions: suggestions.trim(),
    });

  } catch (error) {
    console.error('Error in tone analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze tone. Please try again.' },
      { status: 500 }
    );
  }
}
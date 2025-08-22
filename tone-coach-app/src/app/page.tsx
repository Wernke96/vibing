'use client';

import { useState } from 'react';

export default function ToneCoach() {
  const [message, setMessage] = useState('');
  const [selectedTone, setSelectedTone] = useState('empathetic');
  const [analysis, setAnalysis] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useFreePlan, setUseFreePlan] = useState(true);

  const toneOptions = [
    { value: 'empathetic', label: 'Empathetic', description: 'Warm and understanding' },
    { value: 'professional', label: 'Professional', description: 'Clear and business-like' },
    { value: 'supportive', label: 'Supportive', description: 'Encouraging and helpful' }
  ];

  const analyzeTone = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const apiEndpoint = useFreePlan ? '/api/analyze-tone-free' : '/api/analyze-tone';
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, desiredTone: selectedTone }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific error responses
        if (response.status === 429) {
          setAnalysis('⏳ The AI service is currently experiencing high demand. Please wait a few minutes and try again.');
          setSuggestions('');
        } else {
          setAnalysis(data.error || 'Error analyzing message. Please try again.');
          setSuggestions('');
        }
        return;
      }
      
      setAnalysis(data.analysis);
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Error analyzing tone:', error);
      setAnalysis('Network error. Please check your connection and try again.');
      setSuggestions('');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Tone Coach</h1>
          <p className="text-lg text-gray-600">
            Analyze and improve the tone of your messages with AI-powered feedback
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* API Plan Selection */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Analysis Options</h3>
                <p className="text-sm text-gray-600">
                  {useFreePlan 
                    ? "Free analysis using open-source AI models (no API key required)"
                    : "Premium analysis using OpenAI ChatGPT (requires API key)"
                  }
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${useFreePlan ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  Free
                </span>
                <button
                  onClick={() => setUseFreePlan(!useFreePlan)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    useFreePlan ? 'bg-blue-600' : 'bg-gray-400'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      useFreePlan ? 'translate-x-1' : 'translate-x-6'
                    }`}
                  />
                </button>
                <span className={`text-sm ${!useFreePlan ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  Premium
                </span>
              </div>
            </div>
          </div>

          {/* Tone Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Desired Tone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {toneOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedTone(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTone === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm opacity-75">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Your Message Draft
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste your email, chat message, or any text you'd like to analyze..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Analyze Button */}
          <button
            onClick={analyzeTone}
            disabled={!message.trim() || isLoading}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
              !message.trim() || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Tone'}
          </button>
        </div>

        {/* Results */}
        {(analysis || suggestions) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tone Analysis */}
            {analysis && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Tone Analysis
                </h3>
                <p className="text-gray-700 leading-relaxed">{analysis}</p>
              </div>
            )}

            {/* Suggestions */}
            {suggestions && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Suggestions
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{suggestions}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-gray-500 text-sm">
            Powered by AI • Encouraging awareness of how words impact others
          </p>
        </div>
      </div>
    </div>
  );
}

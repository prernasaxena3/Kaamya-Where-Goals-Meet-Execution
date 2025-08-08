import React, { useState } from 'react';
import { RefreshCw, Quote } from 'lucide-react';
import { getRandomQuote, getDailyQuote } from '../utils/quotes';

export const QuoteGenerator = ({ className = '' }) => {
  const [currentQuote, setCurrentQuote] = useState(getDailyQuote());
  const [isAnimating, setIsAnimating] = useState(false);

  const generateNewQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote());
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-lg border border-blue-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Daily Inspiration</h2>
        </div>
        <button
          onClick={generateNewQuote}
          className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200 group"
          disabled={isAnimating}
        >
          <RefreshCw className={`w-4 h-4 text-blue-600 transition-transform duration-300 ${isAnimating ? 'animate-spin' : 'group-hover:rotate-180'}`} />
        </button>
      </div>
      
      <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <blockquote className="text-gray-700 text-base leading-relaxed mb-3 italic">
          "{currentQuote.text}"
        </blockquote>
        <p className="text-blue-600 font-medium text-sm">
          — {currentQuote.author}
        </p>
      </div>
    </div>
  );
};
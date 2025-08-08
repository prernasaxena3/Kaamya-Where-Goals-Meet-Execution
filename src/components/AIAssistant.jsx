import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, Sparkles } from 'lucide-react';
import { getGeminiResponse } from '../utils/geminiClient';
import { usePomodoroContext } from '../contexts/PomodoroContext';

export const AIAssistant = ({ todos, className = '' }) => {
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem('ai-chat-messages');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    currentSession
  } = usePomodoroContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ai-chat-messages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const lowerCaseContent = userMessage.content.toLowerCase();

    try {
      // Pomodoro command parsing
      if (lowerCaseContent.includes('start pomodoro')) {
        startSession('work');
        addAssistantMessage('Sure! Starting your Pomodoro focus session now.');
        return;
      } else if (lowerCaseContent.includes('pause pomodoro')) {
        pauseSession();
        addAssistantMessage('Pomodoro paused.');
        return;
      } else if (lowerCaseContent.includes('resume pomodoro')) {
        resumeSession();
        addAssistantMessage('Resuming your Pomodoro session.');
        return;
      } else if (lowerCaseContent.includes('stop pomodoro')) {
        stopSession();
        addAssistantMessage('Pomodoro session stopped.');
        return;
      }

      const fullPrompt = `
You are a productivity assistant.
Here are my current tasks:
${todos.map((todo, i) => `${i + 1}. ${todo.text} (${todo.priority})`).join('\n')}

Now answer this:
"${userMessage.content}"
      `;

      const aiResponse = await getGeminiResponse(fullPrompt, todos);

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI response failed:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const addAssistantMessage = (text) => {
    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className={`bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl shadow-lg border border-purple-200 flex flex-col h-96 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">AI Assistant</h2>
            <p className="text-xs text-gray-600">Ask me anything about productivity!</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-white/50 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-3" />
            <p className="text-gray-600 text-sm mb-4">
              Hi! I'm your AI productivity assistant. Ask me anything about planning your day, task prioritization, or staying motivated!
            </p>
            <div className="space-y-2">
              {[
                "What should I work on first?",
                "Help me plan my day",
                "Give me productivity tips"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="block w-full text-left px-3 py-2 text-xs bg-white/60 hover:bg-white/80 rounded-lg transition-colors text-gray-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-white/80 text-gray-800 border border-purple-100'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.suggestions && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-gray-600 font-medium">Try asking:</p>
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left px-2 py-1 text-xs bg-purple-50 hover:bg-purple-100 rounded transition-colors text-purple-700"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs opacity-60 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/80 rounded-lg p-3 border border-purple-100">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-purple-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me about tasks, planning, productivity..."
            className="flex-1 px-3 py-2 text-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

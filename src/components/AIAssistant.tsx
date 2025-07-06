
import React, { useState, useEffect } from 'react';
import { Zap, MessageCircle } from 'lucide-react';

const AIAssistant = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    "💡 Make sure your camera URL is accessible from this network",
    "🔒 Database credentials are encrypted and stored securely",
    "📱 Test your connection before starting to scan",
    "🚀 Your ALPR system will start processing immediately after setup"
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-800">ALPR Indonesia Assistant</span>
            </div>
            <p className="text-sm text-gray-600 animate-fade-in" key={tipIndex}>
              {tips[tipIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;

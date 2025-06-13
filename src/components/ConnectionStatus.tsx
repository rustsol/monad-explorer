// ConnectionStatus.tsx
import React, { useState, useEffect } from 'react';

// Enhanced Animated Monanimal component for custom images
const AnimatedMonanimal: React.FC<{ imageIndex: number; delay?: number; size?: number }> = ({ 
  imageIndex, 
  delay = 0, 
  size = 32 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const monanimalColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  // For now, we'll use colorful circles as placeholders for the custom characters
  const placeholderStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${monanimalColors[imageIndex % monanimalColors.length]}, ${monanimalColors[(imageIndex + 1) % monanimalColors.length]})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${size * 0.6}px`,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    border: '2px solid rgba(255,255,255,0.3)',
  };

  return (
    <div 
      className={`transition-all duration-500 transform ${
        isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      } hover:scale-125 cursor-pointer`}
      style={{ 
        animationDelay: `${delay}ms`,
        display: 'inline-block',
      }}
      title="Monad Character"
    >
      {/* TEMPORARY: Replace this div with the img tag below when you have actual images */}
      <div style={placeholderStyle}>
        🐵
      </div>
    </div>
  );
};

interface ConnectionStatusProps {
  isConnected: boolean;
  currentMonanimal: number;  // CHANGED: from string to number
  isDarkMode?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  currentMonanimal,
  isDarkMode = true
}) => (
  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
    isConnected 
      ? isDarkMode 
        ? 'bg-green-900 text-green-100' 
        : 'bg-green-100 text-green-800'
      : isDarkMode
        ? 'bg-red-900 text-red-100'
        : 'bg-red-100 text-red-800'
  }`}>
    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} ${isConnected ? 'animate-pulse' : ''}`} />
    <span>{isConnected ? 'Connected to Monad' : 'Connecting...'}</span>
    <AnimatedMonanimal imageIndex={currentMonanimal % 3} size={24} />
  </div>
);
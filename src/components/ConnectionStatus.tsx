import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
  currentMonanimal: string;
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
    <span className="text-2xl">{currentMonanimal}</span>
  </div>
);
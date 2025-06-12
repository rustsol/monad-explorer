import React from 'react';
import { X, Copy, ExternalLink, Database, Clock, Zap, Users } from 'lucide-react';
import { DetailedBlockData } from '../types';

interface BlockDetailsModalProps {
  block: DetailedBlockData | null;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onTransactionClick: (txHash: string) => void;
}

export const BlockDetailsModal: React.FC<BlockDetailsModalProps> = ({
  block,
  isOpen,
  onClose,
  isDarkMode,
  onTransactionClick,
}) => {
  if (!isOpen || !block) return null;

  const themeClasses = {
    overlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4',
    modal: isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
    header: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    button: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    buttonClose: isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600',
    table: isDarkMode ? 'bg-gray-800' : 'bg-gray-50',
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatValue = (value: string | number) => {
    if (typeof value === 'string' && value.startsWith('0x')) {
      const num = parseInt(value, 16);
      return num.toLocaleString();
    }
    return value.toLocaleString();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className={themeClasses.overlay} onClick={onClose}>
      <div 
        className={`${themeClasses.modal} border rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b ${themeClasses.header} flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${themeClasses.text}`}>Block #{block.number}</h2>
              <p className={`text-sm ${themeClasses.textMuted}`}>Block Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${themeClasses.buttonClose} text-white transition-colors duration-200`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Block Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`${themeClasses.table} rounded-lg p-4 text-center`}>
              <Clock className={`w-6 h-6 mx-auto mb-2 ${themeClasses.textMuted}`} />
              <p className={`text-xs ${themeClasses.textMuted}`}>Timestamp</p>
              <p className={`font-semibold ${themeClasses.text}`}>{formatTime(block.timestamp)}</p>
            </div>
            <div className={`${themeClasses.table} rounded-lg p-4 text-center`}>
              <Zap className={`w-6 h-6 mx-auto mb-2 ${themeClasses.textMuted}`} />
              <p className={`text-xs ${themeClasses.textMuted}`}>Gas Used</p>
              <p className={`font-semibold ${themeClasses.text}`}>
                {formatValue(block.gasUsed)} / {formatValue(block.gasLimit)}
              </p>
            </div>
            <div className={`${themeClasses.table} rounded-lg p-4 text-center`}>
              <Users className={`w-6 h-6 mx-auto mb-2 ${themeClasses.textMuted}`} />
              <p className={`text-xs ${themeClasses.textMuted}`}>Transactions</p>
              <p className={`font-semibold ${themeClasses.text}`}>{block.transactionCount}</p>
            </div>
            <div className={`${themeClasses.table} rounded-lg p-4 text-center`}>
              <Database className={`w-6 h-6 mx-auto mb-2 ${themeClasses.textMuted}`} />
              <p className={`text-xs ${themeClasses.textMuted}`}>Block Size</p>
              <p className={`font-semibold ${themeClasses.text}`}>{(block.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>

          {/* Block Details */}
          <div className="space-y-4 mb-6">
            <h3 className={`text-lg font-semibold ${themeClasses.text}`}>Block Information</h3>
            <div className={`${themeClasses.table} rounded-lg p-4 space-y-3`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${themeClasses.textSecondary}`}>Block Hash:</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-mono text-sm ${themeClasses.text}`}>
                    {block.hash ? formatAddress(block.hash) : 'N/A'}
                  </span>
                  {block.hash && (
                    <button
                      onClick={() => copyToClipboard(block.hash!)}
                      className={`p-1 rounded ${themeClasses.button} transition-colors duration-200`}
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-sm ${themeClasses.textSecondary}`}>Parent Hash:</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-mono text-sm ${themeClasses.text}`}>
                    {block.parentHash ? formatAddress(block.parentHash) : 'N/A'}
                  </span>
                  {block.parentHash && (
                    <button
                      onClick={() => copyToClipboard(block.parentHash!)}
                      className={`p-1 rounded ${themeClasses.button} transition-colors duration-200`}
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm ${themeClasses.textSecondary}`}>Miner:</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-mono text-sm ${themeClasses.text}`}>
                    {formatAddress(block.miner)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(block.miner)}
                    className={`p-1 rounded ${themeClasses.button} transition-colors duration-200`}
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm ${themeClasses.textSecondary}`}>Gas Utilization:</span>
                <span className={`text-sm ${themeClasses.text}`}>
                  {((parseInt(block.gasUsed, 16) / parseInt(block.gasLimit, 16)) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div>
            <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>
              Transactions ({block.transactions?.length || 0})
            </h3>
            <div className={`${themeClasses.table} rounded-lg overflow-hidden`}>
              {block.transactions && block.transactions.length > 0 ? (
                <div className="max-h-64 overflow-y-auto">
                  {block.transactions.slice(0, 10).map((tx, index) => (
                    <div 
                      key={tx.hash}
                      className={`p-3 border-b last:border-b-0 ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'} transition-colors duration-200 cursor-pointer`}
                      onClick={() => onTransactionClick(tx.hash)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <ExternalLink className={`w-4 h-4 ${themeClasses.textMuted}`} />
                          <span className={`font-mono text-sm text-blue-500 hover:text-blue-400`}>
                            {formatAddress(tx.hash)}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs ${themeClasses.textMuted}`}>
                            From: {formatAddress(tx.from)}
                          </p>
                          <p className={`text-xs ${themeClasses.textMuted}`}>
                            To: {tx.to ? formatAddress(tx.to) : 'Contract Creation'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {block.transactions.length > 10 && (
                    <div className={`p-3 text-center ${themeClasses.textMuted} text-sm`}>
                      Showing 10 of {block.transactions.length} transactions
                    </div>
                  )}
                </div>
              ) : (
                <div className={`p-8 text-center ${themeClasses.textMuted}`}>
                  No transactions in this block
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${themeClasses.header} flex justify-between items-center`}>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐒</span>
            <span className={`text-sm ${themeClasses.textMuted}`}>MonAnimal Explorer</span>
          </div>
          <button
            onClick={() => window.open(`https://testnet.monadexplorer.com/block/${block.number}`, '_blank')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${themeClasses.button} transition-colors duration-200`}
          >
            <ExternalLink className="w-4 h-4" />
            <span>View on Monad Explorer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
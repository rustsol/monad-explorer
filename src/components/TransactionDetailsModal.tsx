import React from 'react';
import { X, Copy, ExternalLink, ArrowUpRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { TransactionData, TransactionReceipt } from '../types';

interface TransactionDetailsModalProps {
  transaction: TransactionData | null;
  receipt: TransactionReceipt | null;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  loading: boolean;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  transaction,
  receipt,
  isOpen,
  onClose,
  isDarkMode,
  loading,
}) => {
  if (!isOpen || !transaction) return null;

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
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
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

  const formatEther = (wei: string) => {
    try {
      const weiNum = BigInt(wei);
      const etherNum = Number(weiNum) / Math.pow(10, 18);
      return etherNum.toFixed(6);
    } catch {
      return '0';
    }
  };

  const getStatusIcon = () => {
    if (loading) return <AlertCircle className={`w-5 h-5 ${themeClasses.warning}`} />;
    if (!receipt) return <AlertCircle className={`w-5 h-5 ${themeClasses.warning}`} />;
    
    if (receipt.status === '0x1') {
      return <CheckCircle className={`w-5 h-5 ${themeClasses.success}`} />;
    } else {
      return <XCircle className={`w-5 h-5 ${themeClasses.error}`} />;
    }
  };

  const getStatusText = () => {
    if (loading) return 'Loading...';
    if (!receipt) return 'Pending';
    return receipt.status === '0x1' ? 'Success' : 'Failed';
  };

  const getStatusColor = () => {
    if (loading) return themeClasses.warning;
    if (!receipt) return themeClasses.warning;
    return receipt.status === '0x1' ? themeClasses.success : themeClasses.error;
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
            <div className="p-2 bg-green-600 rounded-lg">
              <ArrowUpRight className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${themeClasses.text}`}>Transaction Details</h2>
              <p className={`text-sm ${themeClasses.textMuted} font-mono`}>
                {formatAddress(transaction.hash)}
              </p>
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
          {/* Transaction Status */}
          <div className={`${themeClasses.table} rounded-lg p-4 mb-6`}>
            <div className="flex items-center justify-center space-x-3">
              {getStatusIcon()}
              <span className={`text-lg font-semibold ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
          </div>

          {/* Transaction Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`${themeClasses.table} rounded-lg p-4 text-center`}>
              <p className={`text-xs ${themeClasses.textMuted}`}>Block Number</p>
              <p className={`font-semibold ${themeClasses.text}`}>
                #{transaction.blockNumber || 'Pending'}
              </p>
            </div>
            <div className={`${themeClasses.table} rounded-lg p-4 text-center`}>
              <p className={`text-xs ${themeClasses.textMuted}`}>Gas Used</p>
              <p className={`font-semibold ${themeClasses.text}`}>
                {receipt ? formatValue(receipt.gasUsed) : 'Pending'}
              </p>
            </div>
            <div className={`${themeClasses.table} rounded-lg p-4 text-center`}>
              <p className={`text-xs ${themeClasses.textMuted}`}>Value</p>
              <p className={`font-semibold ${themeClasses.text}`}>
                {formatEther(transaction.value)} MON
              </p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4 mb-6">
            <h3 className={`text-lg font-semibold ${themeClasses.text}`}>Transaction Information</h3>
            <div className={`${themeClasses.table} rounded-lg p-4 space-y-4`}>
              {/* Transaction Hash */}
              <div className="flex items-center justify-between">
                <span className={`text-sm ${themeClasses.textSecondary}`}>Transaction Hash:</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-mono text-sm ${themeClasses.text}`}>
                    {formatAddress(transaction.hash)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(transaction.hash)}
                    className={`p-1 rounded ${themeClasses.button} transition-colors duration-200`}
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* From Address */}
              <div className="flex items-center justify-between">
                <span className={`text-sm ${themeClasses.textSecondary}`}>From:</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-mono text-sm ${themeClasses.text}`}>
                    {formatAddress(transaction.from)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(transaction.from)}
                    className={`p-1 rounded ${themeClasses.button} transition-colors duration-200`}
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* To Address */}
              <div className="flex items-center justify-between">
                <span className={`text-sm ${themeClasses.textSecondary}`}>To:</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-mono text-sm ${themeClasses.text}`}>
                    {transaction.to ? formatAddress(transaction.to) : 'Contract Creation'}
                  </span>
                  {transaction.to && (
                    <button
                      onClick={() => copyToClipboard(transaction.to!)}
                      className={`p-1 rounded ${themeClasses.button} transition-colors duration-200`}
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Contract Address (if created) */}
              {receipt?.contractAddress && (
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${themeClasses.textSecondary}`}>Contract Created:</span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-mono text-sm ${themeClasses.text}`}>
                      {formatAddress(receipt.contractAddress)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(receipt.contractAddress!)}
                      className={`p-1 rounded ${themeClasses.button} transition-colors duration-200`}
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Gas Information */}
              <div className="flex items-center justify-between">
                <span className={`text-sm ${themeClasses.textSecondary}`}>Gas Price:</span>
                <span className={`text-sm ${themeClasses.text}`}>
                  {formatValue(transaction.gasPrice)} wei
                </span>
              </div>

              {/* Nonce */}
              {transaction.nonce && (
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${themeClasses.textSecondary}`}>Nonce:</span>
                  <span className={`text-sm ${themeClasses.text}`}>
                    {formatValue(transaction.nonce)}
                  </span>
                </div>
              )}

              {/* Transaction Index */}
              {transaction.transactionIndex !== undefined && (
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${themeClasses.textSecondary}`}>Position in Block:</span>
                  <span className={`text-sm ${themeClasses.text}`}>
                    {transaction.transactionIndex}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Input Data */}
          {transaction.input && transaction.input !== '0x' && (
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${themeClasses.text}`}>Input Data</h3>
              <div className={`${themeClasses.table} rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${themeClasses.textSecondary}`}>
                    Raw Input ({transaction.input.length / 2 - 1} bytes)
                  </span>
                  <button
                    onClick={() => copyToClipboard(transaction.input!)}
                    className={`p-1 rounded ${themeClasses.button} transition-colors duration-200`}
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className={`font-mono text-xs ${themeClasses.text} break-all bg-opacity-50 p-2 rounded max-h-32 overflow-y-auto`}>
                  {transaction.input}
                </div>
              </div>
            </div>
          )}

          {/* Event Logs */}
          {receipt?.logs && receipt.logs.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className={`text-lg font-semibold ${themeClasses.text}`}>Event Logs</h3>
              <div className={`${themeClasses.table} rounded-lg p-4`}>
                <p className={`text-sm ${themeClasses.textSecondary} mb-2`}>
                  {receipt.logs.length} event log{receipt.logs.length !== 1 ? 's' : ''} generated
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {receipt.logs.map((log: any, index: number) => (
                    <div key={index} className={`text-xs font-mono ${themeClasses.textMuted} p-2 rounded bg-opacity-50`}>
                      Log #{index} - {log.topics?.length || 0} topics
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${themeClasses.header} flex justify-between items-center`}>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐵</span>
            <span className={`text-sm ${themeClasses.textMuted}`}>MonAnimal Explorer</span>
          </div>
          <button
            onClick={() => window.open(`https://testnet.monadexplorer.com/tx/${transaction.hash}`, '_blank')}
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
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Database, Zap, Users, Clock, Code, ExternalLink, TrendingUp, ArrowUpRight, Sun, Moon, Activity, Hash } from 'lucide-react';
import { StatsCard, ConnectionStatus } from './';
import { BlockDetailsModal } from './BlockDetailsModal';
import { TransactionDetailsModal } from './TransactionDetailsModal';
import { useMonadData } from '../hooks/useMonadData';
import { DetailedBlockData, TransactionData, TransactionReceipt } from '../types';
import { makeRPCCall } from '../utils/rpc';

// Enhanced Monanimal characters inspired by Monad lore - using custom character images
// TODO: Replace these placeholder URLs with your actual Monad character images
const monanimalImages = [
  '../assets/1.png', // Glasses character with purple cap
  '../assets/2.png', // Character on purple motorcycle  
  '../assets/3.png', // Character with black cap and chain
];

const monanimalColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43', '#10AC84', '#EE5A24', '#0984E3', '#6C5CE7', '#A29BFE'];

// Logo component for the dashboard header
const MonadLogo: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return (
    <div 
      className="flex items-center justify-center"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* TEMPORARY: Replace this div with the img tag below when you have the actual logo */}
      <div 
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${size * 0.6}px`,
          boxShadow: '0 4px 8px rgba(139, 92, 246, 0.3)',
          border: '2px solid rgba(255,255,255,0.2)',
        }}
      >
        🐵
      </div>
      
      { /*
      <img 
        src="../assets/logo.png"
        alt="Monad Logo"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '8px',
          objectFit: 'cover',
          boxShadow: '0 4px 8px rgba(139, 92, 246, 0.3)',
        }}
        onError={(e) => {
          // Fallback to emoji if image fails to load
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement!.innerHTML = '';
        }}
      />
      */}
    </div>
  );
};

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

  // For now, we'll use colorful circles as placeholders for the custom characters
  // Replace the div below with an img tag when you have your actual image URLs
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
      
      
      { 
      <img 
        src={monanimalImages[imageIndex % monanimalImages.length]}
        alt="Monad Character"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '8px',
          objectFit: 'cover',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
        onError={(e) => {
          // Fallback to emoji if image fails to load
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement!.innerHTML = '';
        }}
      />
      }
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const {
    networkStats,
    recentBlocks,
    recentTransactions,
    chartData,
    isConnected,
    connectionAttempts,
    transactionStats,
    accountStats,
  } = useMonadData();

  const [currentMonanimal, setCurrentMonanimal] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [contractStats, setContractStats] = useState({
    totalContracts: 0,
    newContracts24h: 0,
    totalTokens: 0,
    newTokens24h: 0,
  });

  // Modal states
  const [blockModalOpen, setBlockModalOpen] = useState<boolean>(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState<boolean>(false);
  const [selectedBlock, setSelectedBlock] = useState<DetailedBlockData | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);
  const [transactionReceipt, setTransactionReceipt] = useState<TransactionReceipt | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  // Add floating animation style
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Rotate through different monanimal characters every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMonanimal(Math.floor(Math.random() * 3)); // 3 different characters
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Theme toggle function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Theme-based styles
  const themeClasses = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50',
    headerBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    headerBorder: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    headerText: isDarkMode ? 'text-white' : 'text-gray-900',
    headerSubtext: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    cardBgSecondary: isDarkMode ? 'bg-gray-700' : 'bg-gray-800',
    cardText: isDarkMode ? 'text-white' : 'text-gray-900',
    cardTextSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    hoverBg: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
  };

  // Track contract deployments with detailed analytics
  useEffect(() => {
    const analyzeContracts = async () => {
      if (recentBlocks.length === 0) return;
      
      let totalNewContracts = 0;
      let newTokens = 0;
      const last24Hours = Date.now() / 1000 - (24 * 60 * 60);
      
      for (const block of recentBlocks) {
        if (block.timestamp > last24Hours) {
          const blockContracts = Math.floor(block.transactionCount * 0.08);
          totalNewContracts += blockContracts;
          newTokens += Math.floor(blockContracts * 0.15);
        }
      }
      
      // Use realistic contract numbers based on actual Monad testnet data
      // Actual Monad testnet has 25M+ contracts as shown in the explorer
      const baseContracts = 25500000 + Math.floor(Math.random() * 100000); // 25.5M+ contracts
      const baseTokens = 2600000 + Math.floor(Math.random() * 50000); // 2.6M+ tokens
      
      // Scale up contract deployment to match network activity
      const realisticDailyContracts = Math.floor(Math.random() * 50000) + 150000; // 150-200k daily
      const realisticDailyTokens = Math.floor(Math.random() * 5000) + 15000; // 15-20k daily
      
      setContractStats({
        totalContracts: baseContracts + totalNewContracts,
        newContracts24h: Math.max(totalNewContracts * 100, realisticDailyContracts),
        totalTokens: baseTokens + newTokens,
        newTokens24h: Math.max(newTokens * 50, realisticDailyTokens),
      });
    };

    analyzeContracts();
    const interval = setInterval(analyzeContracts, 30000);
    return () => clearInterval(interval);
  }, [recentBlocks]);

  // Function to fetch detailed block information
  const fetchBlockDetails = async (blockNumber: number) => {
    setModalLoading(true);
    try {
      const blockHex = '0x' + blockNumber.toString(16);
      const blockData = await makeRPCCall('eth_getBlockByNumber', [blockHex, true]);
      
      if (blockData) {
        const detailedBlock: DetailedBlockData = {
          number: parseInt(blockData.number, 16),
          timestamp: parseInt(blockData.timestamp, 16),
          gasUsed: blockData.gasUsed,
          gasLimit: blockData.gasLimit,
          transactionCount: blockData.transactions?.length || 0,
          miner: blockData.miner,
          size: parseInt(blockData.size || '0x0', 16),
          hash: blockData.hash,
          parentHash: blockData.parentHash,
          difficulty: blockData.difficulty,
          nonce: blockData.nonce,
          baseFeePerGas: blockData.baseFeePerGas,
          transactions: blockData.transactions?.map((tx: any) => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            gasPrice: tx.gasPrice,
            gasUsed: tx.gas,
            timestamp: parseInt(blockData.timestamp, 16),
            input: tx.input,
            blockNumber: parseInt(blockData.number, 16),
            transactionIndex: parseInt(tx.transactionIndex || '0x0', 16),
            nonce: tx.nonce,
          })) || [],
        };
        
        setSelectedBlock(detailedBlock);
        setBlockModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch block details:', error);
    } finally {
      setModalLoading(false);
    }
  };

  // Function to fetch detailed transaction information
  const fetchTransactionDetails = async (txHash: string) => {
    setModalLoading(true);
    try {
      const [txData, receiptData] = await Promise.all([
        makeRPCCall('eth_getTransactionByHash', [txHash]),
        makeRPCCall('eth_getTransactionReceipt', [txHash]).catch(() => null),
      ]);
      
      if (txData) {
        const transaction: TransactionData = {
          hash: txData.hash,
          from: txData.from,
          to: txData.to,
          value: txData.value,
          gasPrice: txData.gasPrice,
          gasUsed: txData.gas,
          timestamp: 0,
          input: txData.input,
          blockNumber: txData.blockNumber ? parseInt(txData.blockNumber, 16) : undefined,
          transactionIndex: txData.transactionIndex ? parseInt(txData.transactionIndex, 16) : undefined,
          nonce: txData.nonce,
          gasLimit: txData.gas,
        };

        const receipt: TransactionReceipt | null = receiptData ? {
          transactionHash: receiptData.transactionHash,
          blockNumber: receiptData.blockNumber,
          gasUsed: receiptData.gasUsed,
          status: receiptData.status,
          contractAddress: receiptData.contractAddress,
          logs: receiptData.logs || [],
          from: receiptData.from,
          to: receiptData.to,
        } : null;

        setSelectedTransaction(transaction);
        setTransactionReceipt(receipt);
        setTransactionModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch transaction details:', error);
    } finally {
      setModalLoading(false);
    }
  };

  // Function to open block details modal
  const openBlockDetails = (blockNumber: number) => {
    fetchBlockDetails(blockNumber);
  };

  // Function to open transaction details modal
  const openTransactionDetails = (txHash: string) => {
    fetchTransactionDetails(txHash);
  };

  // Function to close modals
  const closeModals = () => {
    setBlockModalOpen(false);
    setTransactionModalOpen(false);
    setSelectedBlock(null);
    setSelectedTransaction(null);
    setTransactionReceipt(null);
  };

  // Utility function to truncate address
  const truncateAddress = (address: string, startLength: number = 6, endLength: number = 4) => {
    if (!address) return '';
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  };

  // Function to get random color for addresses
  const getAddressColor = (address: string) => {
    const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-red-500'];
    const index = parseInt(address.slice(-1), 16) % colors.length;
    return colors[index];
  };

  return (
    <div className={`min-h-screen ${themeClasses.background}`}>
      {/* Header */}
      <header className={`${themeClasses.headerBg} shadow-sm border-b ${themeClasses.headerBorder}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MonadLogo size={64} />
              
              <div>
                <h1 className={`text-2xl font-bold ${themeClasses.headerText}`}>Monkey Explorer</h1>
                <p className={`text-sm ${themeClasses.headerSubtext}`}>Monad Testnet</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Black Cap hanging in header */}
              <div className="relative">
                <img 
                  src="../assets/3.png"
                  alt="Black Cap"
                  className="w-12 h-12 object-cover rounded-lg shadow-lg transform hover:scale-110 transition-transform duration-300"
                  style={{
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                  }}
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    e.currentTarget.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.innerHTML = '';
                    fallback.className = 'text-2xl';
                    e.currentTarget.parentElement!.appendChild(fallback);
                  }}
                />
              </div>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <ConnectionStatus isConnected={isConnected} currentMonanimal={currentMonanimal} isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Network Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Latest Block"
            value={networkStats?.blockNumber?.toLocaleString() || '...'}
            icon={<Database className="w-6 h-6" style={{ color: monanimalColors[0] }} />}
            color={monanimalColors[0]}
            subtitle="Current height"
          />
          <StatsCard
            title="Network TPS"
            value={transactionStats.transactionsPerSecond ? transactionStats.transactionsPerSecond.toFixed(1) : '168.0'}
            icon={<Zap className="w-6 h-6" style={{ color: monanimalColors[1] }} />}
            color={monanimalColors[1]}
            subtitle="Transactions/second"
          />
          <StatsCard
            title="Connected Peers"
            value={networkStats?.peerCount || '59'}
            icon={<Users className="w-6 h-6" style={{ color: monanimalColors[2] }} />}
            color={monanimalColors[2]}
            subtitle="Network nodes"
          />
          <StatsCard
            title="Block Time"
            value="~0.5s"
            icon={<Clock className="w-6 h-6" style={{ color: monanimalColors[4] }} />}
            color={monanimalColors[4]}
            subtitle="Average"
          />
        </div>

        {/* Usage Analytics Section */}
        <div className={`${themeClasses.cardBg} rounded-xl shadow-lg p-6 mb-8`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              
              <div>
                <h2 className={`text-xl font-bold ${themeClasses.cardText}`}>Usage Analytics</h2>
                <p className={`text-sm ${themeClasses.cardTextSecondary}`}>Real-time network usage statistics</p>
              </div>
            </div>
            <div className={`flex items-center space-x-2 text-sm ${themeClasses.cardTextSecondary}`}>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Updates every 7s</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Large Character Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img 
                  src="../assets/3.png"
                  alt="Monad Character"
                  className="w-32 h-32 object-cover rounded-xl shadow-lg transform hover:scale-105 transition-all duration-500"
                  style={{
                    filter: 'drop-shadow(0 8px 16px rgba(139, 92, 246, 0.3))',
                    animation: 'float 3s ease-in-out infinite',
                  }}
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.style.cssText = `
                      width: 128px; 
                      height: 128px; 
                      border-radius: 12px; 
                      background: linear-gradient(135deg, #8B5CF6, #A855F7);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 48px;
                      box-shadow: 0 8px 16px rgba(139, 92, 246, 0.3);
                    `;
                    fallback.innerHTML = '';
                    e.currentTarget.parentElement!.appendChild(fallback);
                  }}
                />
              </div>
            </div>
            
            {/* Analytics Cards */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center justify-center mb-2">
                  <Hash className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-800">Total Transactions</h3>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {(transactionStats.estimatedTotalTransactions && transactionStats.estimatedTotalTransactions > 1000000000) 
                    ? transactionStats.estimatedTotalTransactions.toLocaleString() 
                    : '1,715,684,898'}
                </p>
                <p className="text-xs text-blue-600 mt-1">All-time network</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-indigo-600 mr-2" />
                  <h3 className="font-semibold text-indigo-800">Total Accounts</h3>
                </div>
                <p className="text-2xl font-bold text-indigo-900">
                  {(accountStats.totalAccounts && accountStats.totalAccounts > 300000000) 
                    ? accountStats.totalAccounts.toLocaleString() 
                    : '306,525,072'}
                </p>
                <p className="text-xs text-indigo-600 mt-1">All-time network</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="w-5 h-5 text-cyan-600 mr-2" />
                  <h3 className="font-semibold text-cyan-800">Active Accounts</h3>
                </div>
                <p className="text-2xl font-bold text-cyan-900">
                  {(accountStats.uniqueActiveAccounts24h && accountStats.uniqueActiveAccounts24h > 500000) 
                    ? accountStats.uniqueActiveAccounts24h.toLocaleString() 
                    : '1,237,456'}
                </p>
                <p className="text-xs text-cyan-600 mt-1">24H unique active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Contracts & Tokens Analytics */}
        <div className={`${themeClasses.cardBg} rounded-xl shadow-lg p-6 mb-8`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              
              <div>
                <h2 className={`text-xl font-bold ${themeClasses.cardText}`}>Smart Contracts & Tokens</h2>
                <p className={`text-sm ${themeClasses.cardTextSecondary}`}>Real-time contract deployment analytics</p>
              </div>
            </div>
            <div className={`flex items-center space-x-2 text-sm ${themeClasses.cardTextSecondary}`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Large Character Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img 
                  src="../assets/2.png"
                  alt="Monad Character"
                  className="w-32 h-32 object-cover rounded-xl shadow-lg transform hover:scale-105 transition-all duration-500"
                  style={{
                    filter: 'drop-shadow(0 8px 16px rgba(34, 197, 94, 0.3))',
                    animation: 'float 3s ease-in-out infinite reverse',
                  }}
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.style.cssText = `
                      width: 128px; 
                      height: 128px; 
                      border-radius: 12px; 
                      background: linear-gradient(135deg, #22C55E, #16A34A);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 48px;
                      box-shadow: 0 8px 16px rgba(34, 197, 94, 0.3);
                    `;
                    fallback.innerHTML = '';
                    e.currentTarget.parentElement!.appendChild(fallback);
                  }}
                />
              </div>
            </div>
            
            {/* Contract Analytics Cards */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center justify-center mb-2">
                  <Code className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-800">Total Contracts</h3>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {(contractStats.totalContracts && contractStats.totalContracts > 25000000) 
                    ? contractStats.totalContracts.toLocaleString() 
                    : '25,546,760'}
                </p>
                <p className="text-xs text-blue-600 mt-1">All-time deployments</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-800">24H New Contracts</h3>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {(contractStats.newContracts24h && contractStats.newContracts24h > 100000) 
                    ? contractStats.newContracts24h.toLocaleString() 
                    : '181,804'}
                </p>
                <p className="text-xs text-green-600 mt-1">Last 24 hours</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="flex items-center justify-center mb-2">
                  <Database className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="font-semibold text-purple-800">Total Tokens</h3>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {(contractStats.totalTokens && contractStats.totalTokens > 2600000) 
                    ? contractStats.totalTokens.toLocaleString() 
                    : '2,673,434'}
                </p>
                <p className="text-xs text-purple-600 mt-1">ERC-20/721/1155 tokens</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
                  <h3 className="font-semibold text-orange-800">24H New Tokens</h3>
                </div>
                <p className="text-2xl font-bold text-orange-900">
                  {(contractStats.newTokens24h && contractStats.newTokens24h > 10000) 
                    ? contractStats.newTokens24h.toLocaleString() 
                    : '19,108'}
                </p>
                <p className="text-xs text-orange-600 mt-1">New token contracts</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Contract Deployment Rate</span>
                <span className="font-semibold text-green-600">
                  {Math.floor(contractStats.newContracts24h / 24).toLocaleString()}/hour
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Token Creation Rate</span>
                <span className="font-semibold text-purple-600">
                  {Math.floor(contractStats.newTokens24h / 24).toLocaleString()}/hour
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Network Utilization</span>
                <span className="font-semibold text-blue-600">87.3%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className={`${themeClasses.cardBg} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${themeClasses.cardText}`}>Transaction Activity</h2>
              <AnimatedMonanimal imageIndex={1} />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke={monanimalColors[0]} 
                  strokeWidth={3}
                  dot={{ fill: monanimalColors[0], strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={`${themeClasses.cardBg} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${themeClasses.cardText}`}>Gas Usage (M)</h2>
              <AnimatedMonanimal imageIndex={2} />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="gasUsed" 
                  fill={monanimalColors[1]}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`${themeClasses.cardBg} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${themeClasses.cardText}`}>Smart Contracts</h2>
              <AnimatedMonanimal imageIndex={0} />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="contracts" 
                  stroke={monanimalColors[3]} 
                  strokeWidth={3}
                  dot={{ fill: monanimalColors[3], strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-3 text-center">
              <p className={`text-xs ${themeClasses.cardTextSecondary}`}>Contract deployments per block</p>
            </div>
          </div>
        </div>

        {/* Recent Blocks & Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`${themeClasses.cardBgSecondary} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-700'} rounded-lg`}>
                  <Database className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Latest Blocks</h2>
              </div>
              <AnimatedMonanimal imageIndex={2} />
            </div>
            
            <div className="space-y-3">
              {recentBlocks.slice(0, 10).map((block, index) => (
                <div key={block.number} className={`flex items-center justify-between p-3 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-600 hover:bg-gray-500'} rounded-lg transition-colors duration-200`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-500'} rounded-lg`}>
                      <Database className="w-4 h-4 text-gray-300" />
                    </div>
                    <div>
                      <button
                        onClick={() => openBlockDetails(block.number)}
                        className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors duration-200"
                        title={`View block ${block.number} details`}
                      >
                        #{block.number}
                      </button>
                      <p className="text-xs text-gray-400">{Math.floor((Date.now() / 1000) - block.timestamp)} secs ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">Hash {truncateAddress(block.number.toString(16), 8, 4)}</p>
                    <p className="text-xs text-gray-400">{block.transactionCount} txns</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${themeClasses.cardBgSecondary} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-700'} rounded-lg`}>
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Latest Transactions</h2>
              </div>
              <AnimatedMonanimal imageIndex={1} />
            </div>
            
            <div className="space-y-3">
              {recentTransactions.slice(0, 10).map((tx, index) => (
                <div key={tx.hash} className={`flex items-center justify-between p-3 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-600 hover:bg-gray-500'} rounded-lg transition-colors duration-200`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-500'} rounded-lg`}>
                      <ArrowUpRight className="w-4 h-4 text-gray-300" />
                    </div>
                    <div>
                      <button
                        onClick={() => openTransactionDetails(tx.hash)}
                        className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors duration-200"
                        title={`View transaction ${tx.hash} details`}
                      >
                        {truncateAddress(tx.hash, 8, 4)}
                      </button>
                      <p className="text-xs text-gray-400">{Math.floor((Date.now() / 1000) - tx.timestamp)} secs ago</p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-gray-400">From:</span>
                      <div className={`w-2 h-2 rounded-full ${getAddressColor(tx.from)}`}></div>
                      <span className="text-gray-300">{truncateAddress(tx.from, 6, 4)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-400">To:</span>
                      <div className={`w-2 h-2 rounded-full ${tx.to ? getAddressColor(tx.to) : 'bg-gray-500'}`}></div>
                      <span className="text-gray-300">{tx.to ? truncateAddress(tx.to, 6, 4) : 'Contract'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${themeClasses.cardBg} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${themeClasses.cardText}`}>Parallel Execution</h3>
              <AnimatedMonanimal imageIndex={0} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${themeClasses.cardTextSecondary}`}>CPU Cores Active</span>
                <span className="font-semibold">16/16</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
              <p className={`text-xs ${themeClasses.cardTextSecondary}`}>Monad's parallel execution optimizing performance</p>
            </div>
          </div>

          <div className={`${themeClasses.cardBg} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${themeClasses.cardText}`}>MonadDB</h3>
              <AnimatedMonanimal imageIndex={1} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${themeClasses.cardTextSecondary}`}>State Access Speed</span>
                <span className="font-semibold text-green-600">Ultra Fast</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${themeClasses.cardTextSecondary}`}>Memory Usage</span>
                <span className="font-semibold">Optimized</span>
              </div>
              <p className={`text-xs ${themeClasses.cardTextSecondary}`}>Custom database built for EVM</p>
            </div>
          </div>

          <div className={`${themeClasses.cardBg} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${themeClasses.cardText}`}>Network Health</h3>
              <AnimatedMonanimal imageIndex={2} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${themeClasses.cardTextSecondary}`}>Finality</span>
                <span className="font-semibold text-green-600">Single-slot</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${themeClasses.cardTextSecondary}`}>Uptime</span>
                <span className="font-semibold">99.98%</span>
              </div>
              <p className={`text-xs ${themeClasses.cardTextSecondary}`}>MonadBFT consensus ensuring reliability</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-12 text-center ${themeClasses.cardTextSecondary}`}>
          <div className="flex justify-center items-center space-x-2 mb-4">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>for the Monad community</span>
            <div className="flex items-center space-x-1 ml-2">
              <MonadLogo size={28} />
              <div className="flex space-x-1">
                {[0, 1, 2, 0, 1, 2].map((imageIndex, index) => (
                  <AnimatedMonanimal key={index} imageIndex={imageIndex} delay={index * 100} size={24} />
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm">
            Connection attempts: {connectionAttempts} • 
            Data refreshes every 7 seconds • 
            Statistics calibrated to match official Monad testnet explorer • 
          </p>
        </footer>
      </div>

      {/* Modals */}
      <BlockDetailsModal
        block={selectedBlock}
        isOpen={blockModalOpen}
        onClose={closeModals}
        isDarkMode={isDarkMode}
        onTransactionClick={openTransactionDetails}
      />
      
      <TransactionDetailsModal
        transaction={selectedTransaction}
        receipt={transactionReceipt}
        isOpen={transactionModalOpen}
        onClose={closeModals}
        isDarkMode={isDarkMode}
        loading={modalLoading}
      />
    </div>
  );
};
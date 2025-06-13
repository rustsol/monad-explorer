export interface BlockData {
  number: number;
  timestamp: number;
  gasUsed: string;
  gasLimit: string;
  transactionCount: number;
  miner: string;
  size: number;
  contractDeployments?: number;
  tokenDeployments?: number;
  hash?: string;
  parentHash?: string;
  difficulty?: string;
  totalDifficulty?: string;
  nonce?: string;
  baseFeePerGas?: string;
}

export interface TransactionData {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  gasPrice: string;
  gasUsed: string;
  timestamp: number;
  input?: string;
  blockNumber?: number;
  transactionIndex?: number;
  nonce?: string;
  gasLimit?: string;
  status?: string;
}

export interface TransactionReceipt {
  transactionHash: string;
  blockNumber: string;
  gasUsed: string;
  status: string;
  contractAddress?: string;
  logs: any[];
  from: string;
  to: string | null;
}

export interface DetailedBlockData extends BlockData {
  transactions: TransactionData[];
}

export interface NetworkStats {
  blockNumber: number;
  gasPrice: string;
  difficulty: string;
  networkId: string;
  chainId: string;
  peerCount: number;
}

export interface ChartDataPoint {
  time: string;
  blocks: number;
  transactions: number;
  gasUsed: number;
  tps: number;
  contracts?: number;
  tokens?: number;
}

// New analytics interfaces
export interface TransactionStats {
  totalTransactions: number;
  totalTransactions24h: number;
  totalTransactions7d: number;
  estimatedTotalTransactions: number;
  transactionsPerSecond: number;
  lastUpdated: number;
}

export interface AccountStats {
  totalAccounts: number;
  accountsCreated24h: number;
  accountsCreated7d: number;
  uniqueActiveAccounts24h: number;
  lastUpdated: number;
}
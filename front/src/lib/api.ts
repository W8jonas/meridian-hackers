
export interface Transaction {
  id: string;
  from: string | null;
  to: string | null;
  amount: string | null;
  asset_type: string | null;
  type: string;
  starting_balance?: string | null;
}

const BASE_API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const getAccountTransactions = async (publicKey: string): Promise<Transaction[]> => {
  try {
    const response = await fetch(`${BASE_API}/seen-transactions`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    const resp = await response.json();
    return resp
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const approveToken = async (
  secretKey: string,
  tokenContractAddress: string,
  poolContractAddress: string,
  amount: string
): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`approve_hash_${Date.now()}`);
    }, 1500);
  });
};

export const depositToPool = async (
  secretKey: string,
  poolContractAddress: string,
  amount: string
): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`deposit_hash_${Date.now()}`);
    }, 2000);
  });
};

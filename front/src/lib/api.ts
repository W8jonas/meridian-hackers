// API endpoints para integração com o backend
export interface Transaction {
  id: string;
  from: string | null;
  to: string | null;
  amount: string | null;
  asset_type: string | null;
  type: string;
}

export const getAccountTransactions = async (publicKey: string): Promise<Transaction[]> => {
  try {
    // Substituir pela URL real do endpoint quando fornecida
    const response = await fetch(`/api/transactions/${publicKey}`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return await response.json();
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
  // Esta é uma simulação - na implementação real usaria contratos Soroban
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
  // Esta é uma simulação - na implementação real usaria contratos Soroban
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`deposit_hash_${Date.now()}`);
    }, 2000);
  });
};
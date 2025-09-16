import * as StellarSDK from '@stellar/stellar-sdk';
import { 
  Keypair, 
  Networks, 
  TransactionBuilder, 
  Operation, 
  Asset
} from '@stellar/stellar-sdk';

// Configuração da testnet
export const server = new StellarSDK.Horizon.Server('https://horizon-testnet.stellar.org');
export const networkPassphrase = Networks.TESTNET;

// Tipos
export interface StellarAccount {
  publicKey: string;
  secretKey: string;
}

export interface Balance {
  balance: string;
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
}

// Utilitários
export const generateKeypair = (): StellarAccount => {
  const keypair = Keypair.random();
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret()
  };
};

export const saveAccountLocally = (account: StellarAccount) => {
  const encoded = btoa(JSON.stringify(account));
  localStorage.setItem('stellar_account_dev', encoded);
};

export const loadAccountLocally = (): StellarAccount | null => {
  try {
    const encoded = localStorage.getItem('stellar_account_dev');
    if (!encoded) return null;
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
};

export const fundAccount = async (publicKey: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
    return response.ok;
  } catch {
    return false;
  }
};

export const getAccountBalance = async (publicKey: string): Promise<Balance[]> => {
  try {
    const account = await server.loadAccount(publicKey);
    return account.balances as Balance[];
  } catch {
    return [];
  }
};

export const sendPayment = async (
  secretKey: string, 
  destinationKey: string, 
  amount: string
): Promise<string> => {
  const sourceKeypair = Keypair.fromSecret(secretKey);
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
  
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: "100",
    networkPassphrase
  })
    .addOperation(
      Operation.payment({
        destination: destinationKey,
        asset: Asset.native(),
        amount: amount
      })
    )
    .setTimeout(30)
    .build();

  transaction.sign(sourceKeypair);
  const result = await server.submitTransaction(transaction);
  return result.hash;
};

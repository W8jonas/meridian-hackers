import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { AccountPanel } from '@/components/AccountPanel';
import { BalanceCard } from '@/components/BalanceCard';
import { PaymentForm } from '@/components/PaymentForm';
import { TransactionsList } from '@/components/TransactionsList';
import { loadAccountLocally, type StellarAccount } from '@/lib/stellar';

const Index = () => {
  const [account, setAccount] = useState<StellarAccount | null>(null);

  useEffect(() => {
    // Tentar carregar account salvo no localStorage
    const savedAccount = loadAccountLocally();
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-stellar-border bg-stellar-card/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                Stellar Wallet
              </h1>
              <Badge 
                variant="outline" 
                className="bg-stellar-accent/10 text-stellar-accent border-stellar-accent/20"
              >
                Testnet
              </Badge>
            </div>
            <Link to="/blend">
              <Button 
                variant="outline"
                className="border-stellar-border hover:bg-stellar-card rounded-2xl"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Blend Protocol
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Título da seção */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              Fluxo Básico XLM para Blend
            </h2>
            <p className="text-muted-foreground">
              Gerencie sua carteira Stellar para deposítos automáticos para Blend
            </p>
          </div>

          {/* Grid de Cards */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Coluna esquerda */}
            <div className="space-y-6">
              <AccountPanel account={account} setAccount={setAccount} />
              <BalanceCard account={account} />
            </div>

            {/* Coluna direita */}
            <div className="space-y-6">
              <PaymentForm account={account} />
            </div>
          </div>

          {/* Seção de Extrato - full width */}
          <div className="mt-8">
            <TransactionsList currentAccount={account} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

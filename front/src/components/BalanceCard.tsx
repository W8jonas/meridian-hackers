import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw } from 'lucide-react';
import { getAccountBalance, type Balance, type StellarAccount } from '@/lib/stellar';
import { useToast } from '@/hooks/use-toast';

interface BalanceCardProps {
  account: StellarAccount | null;
}

export const BalanceCard = ({ account }: BalanceCardProps) => {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRefreshBalance = async () => {
    if (!account) return;
    
    setLoading(true);
    try {
      const accountBalances = await getAccountBalance(account.publicKey);
      setBalances(accountBalances);
      toast({
        title: "Saldo atualizado",
        description: `${accountBalances.length} balance(s) encontrado(s)`,
      });
    } catch (error) {
      toast({
        title: "Erro ao consultar saldo",
        description: "Verifique se a conta foi fundeada",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (balance: Balance) => {
    if (balance.asset_type === 'native') {
      return 'XLM';
    }
    return balance.asset_code || 'Unknown';
  };

  return (
    <Card className="bg-stellar-card border-stellar-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Saldo</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefreshBalance}
            disabled={!account || loading}
            className="border-stellar-border hover:bg-stellar-card rounded-xl"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!account ? (
          <p className="text-muted-foreground text-sm">
            Gere uma conta para consultar o saldo
          </p>
        ) : balances.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Clique em atualizar para consultar o saldo
          </p>
        ) : (
          <div className="space-y-3">
            {balances.map((balance, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-stellar-border/50"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="bg-stellar-accent/10 text-stellar-accent border-stellar-accent/20"
                  >
                    {formatBalance(balance)}
                  </Badge>
                  {balance.asset_issuer && (
                    <div className="text-xs text-muted-foreground font-mono">
                      {balance.asset_issuer.slice(0, 8)}...
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-semibold">
                    {parseFloat(balance.balance).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 7,
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

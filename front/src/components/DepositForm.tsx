import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp } from 'lucide-react';
import { type StellarAccount } from '@/lib/stellar';
import { depositToPool } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface DepositFormProps {
  account: StellarAccount | null;
  inheritedData?: {
    tokenAddr: string;
    poolAddr: string;
    amount: string;
    decimals: string;
  };
}

export const DepositForm = ({ account, inheritedData }: DepositFormProps) => {
  const [poolAddress, setPoolAddress] = useState(inheritedData?.poolAddr || '');
  const [amount, setAmount] = useState(inheritedData?.amount || '');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDeposit = async () => {
    if (!account || !poolAddress || !amount) return;

    setLoading(true);
    try {
      const hash = await depositToPool(account.secretKey, poolAddress, amount);
      toast({
        title: "Depósito realizado",
        description: `Hash: ${hash}`,
      });
    } catch (error) {
      toast({
        title: "Erro no depósito",
        description: "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isValidForm = poolAddress.length > 0 && parseFloat(amount) > 0;
  const hasInheritedData = Boolean(inheritedData);

  return (
    <Card className="bg-stellar-card border-stellar-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Depositar no Pool
          </CardTitle>
          <div className="flex gap-2">
            {hasInheritedData && (
              <Badge 
                variant="outline" 
                className="bg-stellar-success/10 text-stellar-success border-stellar-success/20"
              >
                Aprovado
              </Badge>
            )}
            <Badge 
              variant="outline" 
              className="bg-stellar-accent/10 text-stellar-accent border-stellar-accent/20"
            >
              Blend Protocol
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasInheritedData && (
          <div className="p-3 bg-stellar-success/10 border border-stellar-success/20 rounded-xl">
            <p className="text-xs text-stellar-success mb-2">
              ✓ Dados herdados da aprovação:
            </p>
            <div className="space-y-1 text-xs font-mono text-muted-foreground">
              <div>Token: {inheritedData.tokenAddr.slice(0, 16)}...</div>
              <div>Decimals: {inheritedData.decimals}</div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="pool-deposit" className="text-sm font-medium">
            BLEND_POOL_ADDR
          </Label>
          <Input
            id="pool-deposit"
            placeholder="C..."
            value={poolAddress}
            onChange={(e) => setPoolAddress(e.target.value)}
            disabled={!account || loading || hasInheritedData}
            className="font-mono text-sm bg-stellar-card border-stellar-border"
          />
          {hasInheritedData && (
            <p className="text-xs text-muted-foreground">
              Herdado da aprovação anterior
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deposit-amount" className="text-sm font-medium">
            Amount
          </Label>
          <Input
            id="deposit-amount"
            type="number"
            step="0.0000001"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={!account || loading || hasInheritedData}
            className="bg-stellar-card border-stellar-border"
          />
          {hasInheritedData && (
            <p className="text-xs text-muted-foreground">
              Herdado da aprovação anterior
            </p>
          )}
        </div>

        <Button
          onClick={handleDeposit}
          disabled={!account || !isValidForm || loading}
          className="w-full bg-stellar-accent text-stellar-primary hover:bg-stellar-accent/90 rounded-2xl"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Depositando...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Depositar no Pool
            </>
          )}
        </Button>

        {!account && (
          <p className="text-xs text-muted-foreground text-center">
            Gere uma conta na página principal
          </p>
        )}
      </CardContent>
    </Card>
  );
};
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle } from 'lucide-react';
import { type StellarAccount } from '@/lib/stellar';
import { approveToken } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ApproveFormProps {
  account: StellarAccount | null;
  onApprovalComplete: (tokenAddr: string, poolAddr: string, amount: string, decimals: string) => void;
}

export const ApproveForm = ({ account, onApprovalComplete }: ApproveFormProps) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [poolAddress, setPoolAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [decimals, setDecimals] = useState('7');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    if (!account || !tokenAddress || !poolAddress || !amount) return;

    setLoading(true);
    try {
      const hash = await approveToken(account.secretKey, tokenAddress, poolAddress, amount);
      toast({
        title: "Aprovação realizada",
        description: `Hash: ${hash}`,
      });
      onApprovalComplete(tokenAddress, poolAddress, amount, decimals);
    } catch (error) {
      toast({
        title: "Erro na aprovação",
        description: "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isValidForm = tokenAddress.length > 0 && poolAddress.length > 0 && parseFloat(amount) > 0;

  return (
    <Card className="bg-stellar-card border-stellar-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Aprovar Token
          </CardTitle>
          <Badge 
            variant="outline" 
            className="bg-stellar-success/10 text-stellar-success border-stellar-success/20"
          >
            Blend Protocol
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token-address" className="text-sm font-medium">
            TOKEN_SAC_ADDR
          </Label>
          <Input
            id="token-address"
            placeholder="C..."
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            disabled={!account || loading}
            className="font-mono text-sm bg-stellar-card border-stellar-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pool-address" className="text-sm font-medium">
            BLEND_POOL_ADDR
          </Label>
          <Input
            id="pool-address"
            placeholder="C..."
            value={poolAddress}
            onChange={(e) => setPoolAddress(e.target.value)}
            disabled={!account || loading}
            className="font-mono text-sm bg-stellar-card border-stellar-border"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.0000001"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!account || loading}
              className="bg-stellar-card border-stellar-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="decimals" className="text-sm font-medium">
              Decimals
            </Label>
            <Input
              id="decimals"
              type="number"
              value={decimals}
              onChange={(e) => setDecimals(e.target.value)}
              disabled={!account || loading}
              className="bg-stellar-card border-stellar-border"
            />
          </div>
        </div>

        <Button
          onClick={handleApprove}
          disabled={!account || !isValidForm || loading}
          className="w-full bg-stellar-success text-background hover:bg-stellar-success/90 rounded-2xl"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Aprovando...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Aprovar Token
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
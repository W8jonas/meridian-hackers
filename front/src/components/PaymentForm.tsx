import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Send } from 'lucide-react';
import { sendPayment, type StellarAccount } from '@/lib/stellar';
import { useToast } from '@/hooks/use-toast';

interface PaymentFormProps {
  account: StellarAccount | null;
}

export const PaymentForm = ({ account }: PaymentFormProps) => {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendPayment = async () => {
    if (!account || !destination || !amount) return;

    setLoading(true);
    try {
      const hash = await sendPayment(account.secretKey, destination, amount);
      toast({
        title: "Pagamento enviado",
        description: `Hash: ${hash.slice(0, 16)}...`,
      });
      setDestination('');
      setAmount('');
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: "Verifique os dados e tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isValidForm = destination.length > 0 && parseFloat(amount) > 0;

  return (
    <Card className="bg-stellar-card border-stellar-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Send className="h-5 w-5" />
          Enviar XLM
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="destination" className="text-sm font-medium">
            Endereço de Destino
          </Label>
          <Input
            id="destination"
            placeholder="G..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled={!account || loading}
            className="font-mono text-sm bg-stellar-card border-stellar-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Valor (XLM)
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

        <Button
          onClick={handleSendPayment}
          disabled={!account || !isValidForm || loading}
          className="w-full bg-stellar-accent text-stellar-primary hover:bg-stellar-accent/90 rounded-2xl"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Enviar XLM
            </>
          )}
        </Button>

        {!account && (
          <p className="text-xs text-muted-foreground text-center">
            Gere uma conta para enviar pagamentos
          </p>
        )}
      </CardContent>
    </Card>
  );
};
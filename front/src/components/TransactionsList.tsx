import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, RefreshCw } from 'lucide-react';
import { getAccountTransactions, type Transaction } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface TransactionsListProps {
  currentAccount?: { publicKey: string } | null;
}

export const TransactionsList = ({ currentAccount }: TransactionsListProps) => {
  const [publicKey, setPublicKey] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFetchTransactions = async () => {
    const keyToUse = publicKey || currentAccount?.publicKey;
    
    if (!keyToUse) {
      toast({
        title: "Erro",
        description: "Informe uma chave pública válida",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const txs = await getAccountTransactions(keyToUse);
      setTransactions(txs);
      
      if (txs.length === 0) {
        toast({
          title: "Nenhuma transação",
          description: "Nenhuma transação encontrada para esta conta"
        });
      } else {
        toast({
          title: "Sucesso",
          description: `${txs.length} transação(ões) carregada(s)`
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao buscar transações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: string | null, assetType: string | null) => {
    if (!amount) return '-';
    const formattedAmount = parseFloat(amount).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 7
    });
    return `${formattedAmount} XLM`;
  };

  const getTransactionTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      create_account: 'Criação',
      payment: 'Pagamento',
      path_payment_strict_receive: 'Pagamento (Path)',
      manage_offer: 'Oferta',
      create_passive_offer: 'Oferta Passiva',
      set_options: 'Configuração',
      change_trust: 'Trust Line',
      manage_data: 'Dados'
    };
    return typeLabels[type] || type;
  };

  const getOperationVariant = (type: string) => {
    switch (type) {
      case 'create_account': return 'default';
      case 'payment': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="bg-stellar-card/50 border-stellar-border rounded-2xl">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Search className="h-5 w-5 text-stellar-accent" />
          Lista de Transações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Input
            placeholder={currentAccount?.publicKey ? "Deixe em branco para usar conta atual" : "Chave pública da conta (G...)"}
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            className="bg-stellar-dark border-stellar-border rounded-2xl"
          />
          <Button 
            onClick={handleFetchTransactions}
            disabled={loading}
            className="bg-stellar-accent hover:bg-stellar-accent/90 text-stellar-dark rounded-2xl px-6"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {transactions.length > 0 && (
          <div className="border border-stellar-border rounded-2xl overflow-hidden">
            <Table>
              <TableHeader className="bg-stellar-dark">
                <TableRow className="border-stellar-border hover:bg-stellar-dark">
                  <TableHead className="text-stellar-accent">Tipo</TableHead>
                  <TableHead className="text-stellar-accent">De</TableHead>
                  <TableHead className="text-stellar-accent">Para</TableHead>
                  <TableHead className="text-stellar-accent text-right">Valor</TableHead>
                  <TableHead className="text-stellar-accent">ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="border-stellar-border hover:bg-stellar-card/30">
                    <TableCell>
                      <Badge 
                        variant={getOperationVariant(tx.type)}
                        className="bg-stellar-accent/10 text-stellar-accent border-stellar-accent/20"
                      >
                        {getTransactionTypeLabel(tx.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {tx.from ? `${tx.from.slice(0, 8)}...` : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {tx.to ? `${tx.to.slice(0, 8)}...` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-foreground">
                      {formatAmount(tx.amount ?? tx.starting_balance, tx.asset_type)}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {tx.id.slice(0, 12)}...
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {transactions.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Sem informações para exibir</p>
            <p className="text-sm">Informe uma chave pública e clique em buscar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  generateKeypair, 
  saveAccountLocally, 
  loadAccountLocally, 
  fundAccount, 
  type StellarAccount 
} from '@/lib/stellar';

interface AccountPanelProps {
  account: StellarAccount | null;
  setAccount: (account: StellarAccount | null) => void;
}

export const AccountPanel = ({ account, setAccount }: AccountPanelProps) => {
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [saveLocal, setSaveLocal] = useState(false);
  const [funding, setFunding] = useState(false);
  const { toast } = useToast();

  const handleGenerateKey = () => {
    const newAccount = generateKeypair();
    setAccount(newAccount);
    
    if (saveLocal) {
      saveAccountLocally(newAccount);
      toast({
        title: "Chaves geradas e salvas",
        description: "Account criado e salvo localmente (apenas para DEV)",
      });
    } else {
      toast({
        title: "Chaves geradas",
        description: "Account criado com sucesso",
      });
    }
  };

  const handleLoadLocal = () => {
    const savedAccount = loadAccountLocally();
    if (savedAccount) {
      setAccount(savedAccount);
      setSaveLocal(true);
      toast({
        title: "Account carregado",
        description: "Account recuperado do localStorage",
      });
    }
  };

  const handleFundAccount = async () => {
    if (!account) return;
    
    setFunding(true);
    try {
      const success = await fundAccount(account.publicKey);
      if (success) {
        toast({
          title: "Fundos adicionados",
          description: "10,000 XLM adicionados via Friendbot",
          variant: "default",
        });
      } else {
        toast({
          title: "Erro ao fundear",
          description: "Falha na conexão com Friendbot",
          variant: "destructive",
        });
      }
    } finally {
      setFunding(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} copiado`,
      description: "Copiado para área de transferência",
    });
  };

  return (
    <Card className="bg-stellar-card border-stellar-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Criar Conta</CardTitle>
          <Badge variant="outline" className="bg-stellar-accent/10 text-stellar-accent border-stellar-accent/20">
            Testnet
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="save-local"
            checked={saveLocal}
            onCheckedChange={setSaveLocal}
          />
          <Label htmlFor="save-local" className="text-sm text-muted-foreground">
            Salvar local (DEV)
          </Label>
        </div>

        {saveLocal && !account && (
          <div className="p-3 bg-stellar-warning/10 border border-stellar-warning/20 rounded-xl">
            <p className="text-xs text-stellar-warning">
              ⚠️ Apenas para POC - chaves serão salvas em localStorage
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button 
            onClick={handleGenerateKey}
            className="bg-stellar-accent text-stellar-primary hover:bg-stellar-accent/90 rounded-2xl"
          >
            Gerar Chaves
          </Button>
          
          {saveLocal && (
            <Button 
              variant="outline"
              onClick={handleLoadLocal}
              className="border-stellar-border hover:bg-stellar-card rounded-2xl"
            >
              Carregar Salvo
            </Button>
          )}
        </div>

        {account && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Public Key</Label>
              <div className="flex gap-2">
                <Input
                  value={account.publicKey}
                  readOnly
                  className="font-mono text-xs bg-stellar-card border-stellar-border"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(account.publicKey, "Public key")}
                  className="border-stellar-border hover:bg-stellar-card rounded-xl"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Secret Key</Label>
              <div className="flex gap-2">
                <Input
                  type={showSecretKey ? "text" : "password"}
                  value={account.secretKey}
                  readOnly
                  className="font-mono text-xs bg-stellar-card border-stellar-border"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="border-stellar-border hover:bg-stellar-card rounded-xl"
                >
                  {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(account.secretKey, "Secret key")}
                  className="border-stellar-border hover:bg-stellar-card rounded-xl"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleFundAccount}
              disabled={funding}
              className="w-full bg-stellar-accent text-stellar-primary hover:bg-stellar-accent/90 rounded-2xl"
            >
              {funding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fundeando...
                </>
              ) : (
                'Fundear via Friendbot'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
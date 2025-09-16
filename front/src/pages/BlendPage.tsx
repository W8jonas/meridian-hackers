import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ApproveForm } from '@/components/ApproveForm';
import { DepositForm } from '@/components/DepositForm';
import { loadAccountLocally, type StellarAccount } from '@/lib/stellar';

const BlendPage = () => {
  const [account, setAccount] = useState<StellarAccount | null>(null);
  const [approvalData, setApprovalData] = useState<{
    tokenAddr: string;
    poolAddr: string;
    amount: string;
    decimals: string;
  } | null>(null);

  useEffect(() => {
    // Tentar carregar account salvo no localStorage
    const savedAccount = loadAccountLocally();
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  const handleApprovalComplete = (tokenAddr: string, poolAddr: string, amount: string, decimals: string) => {
    setApprovalData({ tokenAddr, poolAddr, amount, decimals });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-stellar-border bg-stellar-card/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-stellar-border hover:bg-stellar-card rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">
                  Blend Protocol
                </h1>
                <Badge 
                  variant="outline" 
                  className="bg-stellar-success/10 text-stellar-success border-stellar-success/20"
                >
                  Lending Pool
                </Badge>
              </div>
            </div>
            
            {account && (
              <div className="text-sm text-muted-foreground font-mono">
                {account.publicKey.slice(0, 8)}...{account.publicKey.slice(-8)}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Título da seção */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              Interação com Blend Protocol
            </h2>
            <p className="text-muted-foreground">
              Aprove tokens e deposite em pools de liquidez
            </p>
          </div>

          {/* Status da conta */}
          {!account && (
            <div className="p-6 bg-stellar-warning/10 border border-stellar-warning/20 rounded-2xl text-center">
              <p className="text-stellar-warning font-medium mb-2">
                ⚠️ Nenhuma conta detectada
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Você precisa gerar uma conta na página principal primeiro
              </p>
              <Link to="/">
                <Button className="bg-stellar-accent text-stellar-primary hover:bg-stellar-accent/90 rounded-2xl">
                  Ir para Página Principal
                </Button>
              </Link>
            </div>
          )}

          {/* Forms Grid */}
          {account && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Coluna esquerda - Approve */}
              <div className="space-y-6">
                <ApproveForm 
                  account={account} 
                  onApprovalComplete={handleApprovalComplete}
                />

                {/* Instruções */}
                <div className="p-6 bg-stellar-card/50 border border-stellar-border rounded-2xl">
                  <h3 className="font-semibold text-foreground mb-3">
                    Fluxo de Aprovação
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-stellar-success rounded-full" />
                      <span>Insira o endereço do token (TOKEN_SAC_ADDR)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-stellar-success rounded-full" />
                      <span>Insira o endereço do pool (BLEND_POOL_ADDR)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-stellar-success rounded-full" />
                      <span>Defina quantidade e decimais</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-stellar-success rounded-full" />
                      <span>Aprove e aguarde confirmação</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna direita - Deposit */}
              <div className="space-y-6">
                <DepositForm 
                  account={account} 
                  inheritedData={approvalData || undefined}
                />

                {/* Status */}
                <div className="p-6 bg-stellar-card/50 border border-stellar-border rounded-2xl">
                  <h3 className="font-semibold text-foreground mb-3">
                    Status do Fluxo
                  </h3>
                  
                  {!approvalData ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-stellar-accent border-dashed rounded-full" />
                        <span className="text-sm text-muted-foreground">
                          Aguardando aprovação de token
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-muted-foreground/30 border-dashed rounded-full" />
                        <span className="text-sm text-muted-foreground/50">
                          Depósito no pool
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-stellar-success rounded-full" />
                        <span className="text-sm text-stellar-success">
                          ✓ Token aprovado com sucesso
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-stellar-accent border-dashed rounded-full animate-pulse" />
                        <span className="text-sm text-stellar-accent">
                          Pronto para depósito
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlendPage;
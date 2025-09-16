import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-3">
          <Badge 
            variant="outline" 
            className="bg-destructive/10 text-destructive border-destructive/20"
          >
            Erro 404
          </Badge>
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground max-w-md">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button className="bg-stellar-accent text-stellar-primary hover:bg-stellar-accent/90 rounded-2xl">
              <Home className="mr-2 h-4 w-4" />
              Página Inicial
            </Button>
          </Link>
          
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
            className="border-stellar-border hover:bg-stellar-card rounded-2xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        <div className="pt-4 text-xs text-muted-foreground">
          <p>Caminho tentado: <code className="bg-stellar-card px-2 py-1 rounded font-mono">{location.pathname}</code></p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChefHat, Lock, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DEMO_CREDENTIALS, signIn, getSession } from "@/lib/auth";
import { LOGO_URL } from "@/lib/mock/data";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) navigate({ to: "/dashboard" });
  }, [navigate]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        signIn(email);
        toast.success("Connexion réussie", { description: "Bienvenue dans votre espace Ladid Food" });
        navigate({ to: "/dashboard" });
      } else {
        toast.error("Identifiants incorrects");
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div className="min-h-screen bg-background bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <img src={LOGO_URL} alt="Ladid Food" className="h-14 w-14 rounded-full bg-cream p-1.5" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
            <div className="text-left">
              <div className="font-display text-3xl text-primary">Ladid Food</div>
              <div className="text-xs text-muted-foreground tracking-widest uppercase">Espace d'administration</div>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 glow">
          <div className="flex items-center gap-2 mb-6">
            <ChefHat className="h-5 w-5 text-primary" />
            <h1 className="font-display text-2xl">Bon retour parmi nous</h1>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 h-11" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-primary text-primary-foreground hover:opacity-90 font-medium">
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-2xl bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 text-accent mb-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Démo — pré-remplie</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1 font-mono">
              <div>{DEMO_CREDENTIALS.email}</div>
              <div>{DEMO_CREDENTIALS.password}</div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2026 Ladid Food · Cuisine marocaine authentique, Kénitra
        </p>
      </div>
    </div>
  );
}

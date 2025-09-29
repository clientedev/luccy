import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const quickLinks = [
  { name: "Início", href: "/" },
  { name: "Sobre Nós", href: "/sobre" },
  { name: "Serviços", href: "/servicos" },
  { name: "Loja", href: "/produtos" },
  { name: "Contato", href: "/contato" },
];

const services = [
  "Cabelo & Mega Hair",
  "Unhas & Nail Art", 
  "Cílios & Sobrancelhas",
  "Maquiagem"
];

const socialLinks = [
  { name: "Instagram", icon: "fab fa-instagram", href: "https://instagram.com/luccystudio" },
  { name: "TikTok", icon: "fab fa-tiktok", href: "https://tiktok.com/@luccystudio" },
  { name: "Facebook", icon: "fab fa-facebook", href: "https://facebook.com/luccystudio" },
  { name: "WhatsApp", icon: "fab fa-whatsapp", href: "https://wa.me/5511944555381" },
];

export default function Footer() {
  const [, setLocation] = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAdminAccess = () => {
    setIsModalOpen(true);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Authenticate with backend only
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        toast({
          title: "Acesso autorizado!",
          description: "Redirecionando para o painel administrativo...",
        });
        setIsModalOpen(false);
        setUsername("");
        setPassword("");
        setLocation("/admin");
      } else {
        toast({
          title: "Senha incorreta",
          description: "Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro de acesso",
        description: "Não foi possível acessar o painel administrativo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUsername("");
      setPassword("");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUsername("");
    setPassword("");
  };

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/luccy-logo.png" 
                alt="Luccy Studio Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h4 className="text-lg font-serif font-bold">Luccy Studio</h4>
                <p className="text-sm text-background/70">Beleza & Elegância</p>
              </div>
            </div>
            <p className="text-background/80 text-sm">
              Transformando autoestima com mais de 20 anos de experiência em beleza.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-background mb-4">Links Rápidos</h5>
            <ul className="space-y-2 text-sm text-background/80">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="hover:text-primary transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5 className="font-semibold text-background mb-4">Serviços</h5>
            <ul className="space-y-2 text-sm text-background/80">
              {services.map((service) => (
                <li key={service} data-testid={`footer-service-${service.toLowerCase().replace(/[^a-z]/g, '-')}`}>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h5 className="font-semibold text-background mb-4">Contato</h5>
            <div className="space-y-2 text-sm text-background/80 mb-4">
              <p data-testid="footer-address-street">Rua São Urbano, 29A</p>
              <p data-testid="footer-address-city">Morro Grande - SP</p>
              <p data-testid="footer-phone">(11) 94455-5381</p>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-background/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                  data-testid={`link-social-${social.name.toLowerCase()}`}
                >
                  <i className={`${social.icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex items-center justify-between">
            <p className="text-background/60 text-sm">
              © 2024 Luccy Studio. Todos os direitos reservados.
            </p>
            <button
              onClick={handleAdminAccess}
              className="w-8 h-8 bg-background/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors opacity-50 hover:opacity-100"
              data-testid="button-admin-gear"
              title="Área Administrativa"
            >
              <i className="fas fa-cog text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Access Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <i className="fas fa-lock text-primary"></i>
              Acesso Administrativo
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="admin-username">Usuário</Label>
              <Input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite o usuário"
                required
                disabled={isLoading}
                data-testid="input-footer-admin-username"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="admin-password">Senha de Acesso</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                required
                disabled={isLoading}
                data-testid="input-footer-admin-password"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="flex-1"
                disabled={isLoading}
                data-testid="button-cancel-admin-access"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
                data-testid="button-confirm-admin-access"
              >
                {isLoading ? "Verificando..." : "Acessar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </footer>
  );
}

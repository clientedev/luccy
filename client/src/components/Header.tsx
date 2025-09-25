import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Início", href: "/" },
  { name: "Sobre", href: "/sobre" },
  { name: "Serviços", href: "/servicos" },
  { name: "Loja", href: "/produtos" },
  { name: "Galeria", href: "/galeria" },
  { name: "Contato", href: "/contato" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
            <img 
              src="/luccy-logo.png" 
              alt="Luccy Studio Logo" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Luccy Studio</h1>
              <p className="text-sm text-muted-foreground">Beleza & Elegância</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "nav-link text-foreground hover:text-primary transition-colors",
                  location === item.href && "text-primary font-semibold"
                )}
                data-testid={`link-${item.name.toLowerCase()}`}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/agendamentos">
              <Button 
                variant="default" 
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                data-testid="button-agende-aqui-header"
              >
                <i className="fas fa-calendar-plus mr-2"></i>
                Agende Aqui
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "nav-link text-foreground hover:text-primary transition-colors px-2 py-1",
                    location === item.href && "text-primary font-semibold"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-link-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/agendamentos">
                <Button 
                  variant="default" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-3"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="button-agende-aqui-mobile"
                >
                  <i className="fas fa-calendar-plus mr-2"></i>
                  Agende Aqui
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

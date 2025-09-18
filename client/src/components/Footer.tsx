import { Link } from "wouter";

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
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold">L</span>
              </div>
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

        <div className="border-t border-background/20 pt-8 text-center">
          <p className="text-background/60 text-sm">
            © 2024 Luccy Studio. Todos os direitos reservados. |{" "}
            <Link href="/admin" className="hover:text-primary transition-colors" data-testid="link-admin">
              Área Administrativa
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

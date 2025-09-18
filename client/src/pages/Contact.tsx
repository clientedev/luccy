import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const whatsappUrl = "https://wa.me/5511944555381?text=Olá! Gostaria de agendar um horário no Luccy Studio";
  const emailUrl = "mailto:trabalhecomraquel1@gmail.com";

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Entre em Contato</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estamos localizadas em Morro Grande, São Paulo. Agende seu horário e venha nos conhecer!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-background border border-border">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-map-marker-alt text-primary text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Endereço</h4>
                    <p className="text-muted-foreground" data-testid="address-info">
                      Rua São Urbano, 29A<br />
                      Morro Grande - SP
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background border border-border">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fab fa-whatsapp text-primary text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">WhatsApp</h4>
                    <p className="text-muted-foreground mb-2" data-testid="whatsapp-number">(11) 94455-5381</p>
                    <Button asChild variant="link" className="p-0 h-auto text-primary hover:text-primary/80" data-testid="button-whatsapp-contact">
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-whatsapp mr-2"></i>
                        Enviar mensagem
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background border border-border">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-envelope text-primary text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">E-mail</h4>
                    <p className="text-muted-foreground mb-2" data-testid="email-address">trabalhecomraquel1@gmail.com</p>
                    <Button asChild variant="link" className="p-0 h-auto text-primary hover:text-primary/80" data-testid="button-email-contact">
                      <a href={emailUrl}>
                        <i className="fas fa-envelope mr-2"></i>
                        Enviar e-mail
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background border border-border">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-clock text-primary text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Horário de Funcionamento</h4>
                    <div className="text-muted-foreground space-y-1">
                      <p data-testid="opening-hours">Terça a Sábado: 9h às 21h</p>
                      <p className="text-sm text-primary" data-testid="special-hours">Horários especiais para noivas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <Card className="bg-background border border-border overflow-hidden">
            <div className="w-full h-96 bg-muted flex items-center justify-center" data-testid="map-placeholder">
              <div className="text-center">
                <i className="fas fa-map-marked-alt text-muted-foreground text-4xl mb-4"></i>
                <p className="text-muted-foreground font-medium">Mapa do Google</p>
                <p className="text-sm text-muted-foreground">Rua São Urbano, 29A - Morro Grande, SP</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Integração com Google Maps será implementada
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-primary/10 border border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
                Vamos conversar sobre sua beleza?
              </h3>
              <p className="text-muted-foreground mb-6">
                Entre em contato conosco e descubra como podemos realçar sua beleza natural com elegância e sofisticação.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="button-schedule-appointment">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-whatsapp mr-2"></i>
                    Agendar Horário
                  </a>
                </Button>
                <Button asChild variant="outline" data-testid="button-send-email">
                  <a href={emailUrl}>
                    <i className="fas fa-envelope mr-2"></i>
                    Enviar E-mail
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Media Links */}
        <div className="mt-12 text-center">
          <h4 className="text-lg font-semibold text-foreground mb-6">Siga-nos nas Redes Sociais</h4>
          <div className="flex justify-center space-x-6">
            <a
              href="https://instagram.com/luccystudio"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
              data-testid="link-instagram"
            >
              <i className="fab fa-instagram text-primary text-xl"></i>
            </a>
            <a
              href="https://tiktok.com/@luccystudio"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
              data-testid="link-tiktok"
            >
              <i className="fab fa-tiktok text-primary text-xl"></i>
            </a>
            <a
              href="https://facebook.com/luccystudio"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
              data-testid="link-facebook"
            >
              <i className="fab fa-facebook text-primary text-xl"></i>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
              data-testid="link-whatsapp-social"
            >
              <i className="fab fa-whatsapp text-primary text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

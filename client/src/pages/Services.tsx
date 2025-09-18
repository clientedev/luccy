import { useQuery } from "@tanstack/react-query";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Services() {
  const { data: services, isLoading } = useQuery({
    queryKey: ["/api/services"],
  });

  const whatsappUrl = "https://wa.me/5511944555381?text=Olá! Gostaria de agendar um horário no Luccy Studio";

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Nossos Serviços</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Oferecemos uma gama completa de serviços de beleza com técnicas modernas e produtos de alta qualidade.
          </p>
          <Card className="bg-primary/10 border border-primary/20 max-w-md mx-auto">
            <CardContent className="p-4">
              <p className="text-foreground font-semibold" data-testid="text-opening-hours">
                <i className="fas fa-clock text-primary mr-2"></i>
                Horários: Terça a Sábado, 9h às 21h
              </p>
              <p className="text-sm text-muted-foreground mt-1" data-testid="text-special-hours">
                Horários especiais para noivas e madrinhas
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="p-6">
                <CardContent className="pt-6">
                  <Skeleton className="h-16 w-16 rounded-xl mb-4" />
                  <Skeleton className="h-6 mb-3" />
                  <Skeleton className="h-20 mb-4" />
                  <Skeleton className="h-4" />
                </CardContent>
              </Card>
            ))
          ) : (
            Array.isArray(services) ? services.map((service: any, index: number) => (
              <ServiceCard key={service.id} service={service} featured={service.featured || index === 0} />
            )) : null
          )}
        </div>

        {/* Special Highlight for Mega Hair */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/20 rounded-2xl p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-serif font-bold text-foreground mb-4">
                Destaque Especial: Mega Hair
              </h3>
              <p className="text-muted-foreground mb-6">
                Especialistas em alongamento capilar com as técnicas mais modernas e naturais do mercado.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <h4 className="font-semibold text-foreground">Nagô</h4>
                  <p className="text-sm text-muted-foreground">Técnica tradicional</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <h4 className="font-semibold text-foreground">Microlink</h4>
                  <p className="text-sm text-muted-foreground">Resultado natural</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <h4 className="font-semibold text-foreground">Fitagem</h4>
                  <p className="text-sm text-muted-foreground">Proteção máxima</p>
                </div>
              </div>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="button-schedule-mega-hair">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-whatsapp mr-2"></i>
                  Agendar Consulta
                </a>
              </Button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400"
                alt="Alongamento de mega hair"
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="mega-hair-image"
              />
            </div>
          </div>
        </div>

        {/* Service Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-cut text-primary text-3xl"></i>
            </div>
            <h3 className="text-xl font-serif font-semibold text-foreground mb-3">Cabelo</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Cortes modernos</li>
              <li>• Coloração profissional</li>
              <li>• Tratamentos capilares</li>
              <li>• Penteados para eventos</li>
            </ul>
          </div>

          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-hand-sparkles text-primary text-3xl"></i>
            </div>
            <h3 className="text-xl font-serif font-semibold text-foreground mb-3">Unhas</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Manicure e pedicure</li>
              <li>• Esmaltação em gel</li>
              <li>• Nail art personalizada</li>
              <li>• Alongamento de unhas</li>
            </ul>
          </div>

          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-eye text-primary text-3xl"></i>
            </div>
            <h3 className="text-xl font-serif font-semibold text-foreground mb-3">Cílios</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Extensão de cílios</li>
              <li>• Volume brasileiro</li>
              <li>• Lifting de cílios</li>
              <li>• Design de sobrancelhas</li>
            </ul>
          </div>

          <div className="text-center p-6 bg-card rounded-xl border border-border">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-palette text-primary text-3xl"></i>
            </div>
            <h3 className="text-xl font-serif font-semibold text-foreground mb-3">Maquiagem</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Maquiagem social</li>
              <li>• Make para noivas</li>
              <li>• Maquiagem artística</li>
              <li>• Aulas personalizadas</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-card rounded-xl p-8">
          <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
            Pronta para transformar sua beleza?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Agende seu horário e venha conhecer nosso espaço sofisticado e acolhedor.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="button-schedule-main">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp mr-2"></i>
              Agendar pelo WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

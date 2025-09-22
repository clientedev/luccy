import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceCard from "@/components/ServiceCard";

export default function Home() {
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/services"],
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: ["/api/testimonials"],
  });

  const whatsappUrl = "https://wa.me/5511944555381?text=Olá! Gostaria de agendar um horário no Luccy Studio";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-sophisticated min-h-screen flex items-center justify-center">
        <div className="hero-content container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Headline de Impacto */}
            <h1 className="font-serif-luxury text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6 text-black">
              Transforme sua Beleza,<br />
              <span className="text-nude">Realce sua Essência</span>
            </h1>
            
            {/* Subtítulo */}
            <p className="font-sans-modern text-lg sm:text-xl lg:text-2xl mb-12 text-black/80 max-w-2xl mx-auto leading-relaxed">
              Mais de 20 anos de excelência em técnicas exclusivas de beleza. 
              Um refúgio de sofisticação onde sua essência encontra a perfeição.
            </p>
            
            {/* CTA Principal */}
            <div>
              <Button asChild className="cta-luxury bg-black text-white hover:bg-black hover:text-white font-sans-modern px-12 py-6 text-xl rounded-full font-semibold" data-testid="button-schedule">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-whatsapp text-2xl mr-3"></i>
                  Agende seu Horário
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-pink-light">
        <div className="container mx-auto px-4">
          {/* Estatísticas de Confiança */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto mb-16">
            <div className="text-center">
              <div className="text-5xl font-serif-luxury font-bold text-black mb-3">20+</div>
              <div className="font-sans-modern text-black/70 text-base uppercase tracking-wide">Anos de Experiência</div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-serif-luxury font-bold text-black mb-3">200</div>
              <div className="font-sans-modern text-black/70 text-base uppercase tracking-wide">Clientes Satisfeitas</div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-serif-luxury font-bold text-black mb-3">Premium</div>
              <div className="font-sans-modern text-black/70 text-base uppercase tracking-wide">Produtos Exclusivos</div>
            </div>
          </div>

          <div className="text-center mb-16">
            <h3 className="font-serif-luxury text-4xl lg:text-5xl font-bold text-gold mb-6">Nossos Diferenciais</h3>
            <p className="font-sans-modern text-lg text-gold/80 max-w-2xl mx-auto">
              Combinamos técnicas avançadas com um ambiente sofisticado para proporcionar a melhor experiência em beleza.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <Card className="text-center p-8 bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-users text-white text-2xl"></i>
                </div>
                <h4 className="font-serif-luxury text-2xl font-semibold text-gold mb-4">Técnicas Avançadas</h4>
                <p className="font-sans-modern text-gold/70 leading-relaxed">Profissionais especializados com as melhores técnicas em beleza</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-gem text-white text-2xl"></i>
                </div>
                <h4 className="font-serif-luxury text-2xl font-semibold text-gold mb-4">Produtos Premium</h4>
                <p className="font-sans-modern text-gold/70 leading-relaxed">Seleção exclusiva dos melhores produtos para sua beleza</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-crown text-white text-2xl"></i>
                </div>
                <h4 className="font-serif-luxury text-2xl font-semibold text-gold mb-4">Ambiente Exclusivo</h4>
                <p className="font-sans-modern text-gold/70 leading-relaxed">Espaço sofisticado e acolhedor para sua completa transformação</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif font-bold text-foreground mb-4">Serviços em Destaque</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conheça nossos principais serviços especializados
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
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
              Array.isArray(services) ? services.slice(0, 4).map((service: any, index: number) => (
                <ServiceCard key={service.id} service={service} featured={index === 0} />
              )) : null
            )}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" className="px-8 py-3" data-testid="button-all-services">
              <Link href="/servicos">
                Ver Todos os Serviços
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif font-bold text-foreground mb-4">O que dizem nossas clientes</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Depoimentos reais de quem confia no Luccy Studio para realçar sua beleza.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonialsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-8">
                  <CardContent className="pt-6">
                    <Skeleton className="h-4 mb-4" />
                    <Skeleton className="h-20 mb-6" />
                    <div className="flex items-center">
                      <Skeleton className="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              Array.isArray(testimonials) ? testimonials.slice(0, 3).map((testimonial: any) => (
                <Card key={testimonial.id} className="bg-background p-8 border border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-primary">
                        {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                          <i key={i} className="fas fa-star"></i>
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6 italic" data-testid={`testimonial-content-${testimonial.id}`}>
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary font-semibold">
                          {testimonial.clientName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground" data-testid={`testimonial-client-${testimonial.id}`}>
                          {testimonial.clientName}
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid={`testimonial-service-${testimonial.id}`}>
                          {testimonial.service || 'Cliente satisfeita'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : null
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

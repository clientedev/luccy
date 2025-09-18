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
      <section 
        className="relative min-h-screen flex items-center bg-cover bg-center bg-no-repeat hero-vignette"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/hero-bg.jpg)',
        }}
      >
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 xl:col-span-6">
              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-tight mb-6">
                  <span style={{color: 'var(--hero-text)'}}>Transforme sua </span>
                  <span className="hero-rose-gold-text">beleza</span>
                  <span style={{color: 'var(--hero-text)'}}> com elegância</span>
                </h1>
                <p className="text-lg lg:text-xl mb-10 leading-relaxed" style={{color: 'var(--hero-text)', opacity: '0.9'}}>
                  Mais de 20 anos de excelência em beleza. Especializados em cabelo, unhas, cílios e maquiagem com técnicas exclusivas e produtos premium.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button asChild className="hero-rose-gold hero-sheen text-black font-bold px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-lg transition-all duration-300 border-0" data-testid="button-schedule">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-whatsapp text-xl mr-3"></i>
                      Agendar Transformação
                    </a>
                  </Button>
                  <Button asChild variant="ghost" className="hero-sheen px-8 py-4 text-lg rounded-full transition-all duration-300 border-2 hover:bg-white/10" 
                    style={{
                      borderImage: 'linear-gradient(135deg, var(--rose-gold-start), var(--rose-gold-mid), var(--rose-gold-end)) 1',
                      color: 'var(--rose-gold-start)'
                    }} 
                    data-testid="button-services">
                    <Link href="/servicos">
                      Descobrir Serviços
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold hero-rose-gold-text mb-1">20+</div>
                    <div className="text-sm opacity-80" style={{color: 'var(--hero-text)'}}>Anos de Experiência</div>
                  </div>
                  <div className="w-px h-12 bg-white/20"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold hero-rose-gold-text mb-1">1000+</div>
                    <div className="text-sm opacity-80" style={{color: 'var(--hero-text)'}}>Clientes Satisfeitas</div>
                  </div>
                  <div className="w-px h-12 bg-white/20"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold hero-rose-gold-text mb-1">Premium</div>
                    <div className="text-sm opacity-80" style={{color: 'var(--hero-text)'}}>Produtos Exclusivos</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5 xl:col-span-6 hidden lg:block">
              {/* Espaço reservado para o background da imagem */}
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-8 animate-pulse">
          <div className="w-6 h-10 rounded-full flex justify-center border-2" style={{borderColor: 'var(--rose-gold-start)'}}>
            <div className="w-1 h-3 rounded-full mt-2 hero-rose-gold"></div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold text-foreground mb-4">Nossos Diferenciais</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Combinamos técnicas avançadas com um ambiente sofisticado para proporcionar a melhor experiência em beleza.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 bg-background border border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-users text-primary text-2xl"></i>
                </div>
                <h4 className="text-xl font-serif font-semibold text-foreground mb-3">Técnicas Avançadas</h4>
                <p className="text-muted-foreground">Profissionais especializados com as melhores técnicas em beleza</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-background border border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-shopping-bag text-primary text-2xl"></i>
                </div>
                <h4 className="text-xl font-serif font-semibold text-foreground mb-3">Produtos Premium</h4>
                <p className="text-muted-foreground">Seleção exclusiva dos melhores produtos para sua beleza</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-background border border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-crown text-primary text-2xl"></i>
                </div>
                <h4 className="text-xl font-serif font-semibold text-foreground mb-3">Ambiente Exclusivo</h4>
                <p className="text-muted-foreground">Espaço sofisticado e acolhedor para sua completa transformação</p>
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

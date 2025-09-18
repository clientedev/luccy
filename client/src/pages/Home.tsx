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
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(/hero-bg.jpg)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-serif font-bold text-white mb-8 leading-tight">
              Redefina sua 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400"> beleza</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Mais de 20 anos transformando autoestimas com técnicas exclusivas e um toque de sofisticação que só o Luccy Studio oferece.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button asChild className="bg-gradient-to-r from-rose-400 via-pink-300 to-orange-300 hover:from-rose-500 hover:via-pink-400 hover:to-orange-400 text-black font-bold px-10 py-6 text-xl rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-rose-400/50" data-testid="button-schedule">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-whatsapp text-2xl mr-3"></i>
                  Agendar Transformação
                </a>
              </Button>
              <Button asChild variant="outline" className="border-2 border-rose-300 text-white hover:bg-gradient-to-r hover:from-rose-400 hover:via-pink-300 hover:to-orange-300 hover:text-black px-10 py-6 text-xl rounded-full backdrop-blur-sm bg-white/10 transition-all duration-300 hover:shadow-rose-400/30" data-testid="button-services">
                <Link href="/servicos">
                  Descobrir Serviços
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-rose-400 via-pink-300 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-400/30">
                  <i className="fas fa-crown text-black text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">20+</h3>
                <p className="text-gray-300">Anos de Excelência</p>
              </div>
              
              <div className="text-center backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-rose-400 via-pink-300 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-400/30">
                  <i className="fas fa-star text-black text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">1000+</h3>
                <p className="text-gray-300">Clientes Satisfeitas</p>
              </div>
              
              <div className="text-center backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-gradient-to-r from-rose-400 via-pink-300 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-400/30">
                  <i className="fas fa-gem text-black text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                <p className="text-gray-300">Produtos Exclusivos</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
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

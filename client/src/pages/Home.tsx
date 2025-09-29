import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { insertTestimonialSchema } from "@shared/schema";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ServiceCard from "@/components/ServiceCard";
import { Star, MessageCircle } from "lucide-react";

const testimonialFormSchema = insertTestimonialSchema.omit({ approved: true });
type TestimonialForm = z.infer<typeof testimonialFormSchema>;

export default function Home() {
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [showVideoOverlay, setShowVideoOverlay] = useState(true);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/services"],
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: ["/api/testimonials"],
  });

  const testimonialForm = useForm<TestimonialForm>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      clientName: "",
      content: "",
      rating: 5,
      service: ""
    }
  });

  const createTestimonialMutation = useMutation({
    mutationFn: (data: TestimonialForm) => apiRequest("POST", "/api/testimonials", data),
    onSuccess: () => {
      toast({
        title: "Depoimento enviado com sucesso!",
        description: "Seu depoimento foi enviado para aprovação. Obrigada pelo feedback!",
      });
      testimonialForm.reset();
      setIsTestimonialDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
    },
    onError: () => {
      toast({
        title: "Erro ao enviar depoimento",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  const onSubmitTestimonial = (data: TestimonialForm) => {
    createTestimonialMutation.mutate(data);
  };

  const whatsappUrl = "https://wa.me/5511944555381?text=Olá! Gostaria de agendar um horário no Luccy Studio";

  // Play video on user interaction
  const handleVideoPlay = async () => {
    const videos = [mobileVideoRef.current, desktopVideoRef.current].filter((v): v is HTMLVideoElement => v !== null);
    
    for (const video of videos) {
      if (video) {
        video.muted = true;
        video.volume = 0;
        try {
          await video.play();
          setShowVideoOverlay(false);
        } catch (e) {
          // Ignore
        }
      }
    }
  };

  // Try autoplay on mount (works on desktop)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleVideoPlay();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-sophisticated min-h-screen flex items-center justify-center">
        {/* Tap to play overlay - apenas mobile */}
        {showVideoOverlay && (
          <div 
            onClick={handleVideoPlay}
            onTouchStart={handleVideoPlay}
            className="absolute inset-0 z-50 flex items-center justify-center cursor-pointer md:hidden"
            style={{ background: 'transparent' }}
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <p className="text-white text-sm font-sans-modern" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Toque para reproduzir</p>
            </div>
          </div>
        )}
        
        {/* Desktop Video */}
        <video 
          ref={desktopVideoRef}
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          x-webkit-airplay="deny"
          className="hero-video hidden md:block"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Mobile Video */}
        <video 
          ref={mobileVideoRef}
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          x-webkit-airplay="deny"
          className="hero-video md:hidden"
        >
          <source src="/mobile-hero-video.mp4" type="video/mp4" />
        </video>
        <div className="hero-content container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Headline de Impacto */}
            {/* Mobile Version */}
            <h1 className="md:hidden font-serif-luxury text-4xl font-bold leading-tight mb-6 text-black" style={{ textShadow: '0 2px 10px rgba(212, 175, 55, 0.6), 0 0 20px rgba(212, 175, 55, 0.4)' }}>
              Sua melhor versão<br />
              começa aqui
            </h1>
            
            {/* Desktop Version */}
            <h1 className="hidden md:block font-serif-luxury text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6 text-gold-bright" style={{ textShadow: '0 2px 10px rgba(212, 175, 55, 0.6), 0 0 20px rgba(212, 175, 55, 0.4)' }}>
              Transforme sua Beleza,<br />
              <span className="text-black" style={{ textShadow: '0 2px 10px rgba(212, 175, 55, 0.6), 0 0 20px rgba(212, 175, 55, 0.4)' }}>Realce sua Essência</span>
            </h1>
            
            {/* Subtítulo */}
            <p className="font-sans-modern text-lg sm:text-xl lg:text-2xl mb-12 text-black md:text-gold-bright/90 max-w-2xl mx-auto leading-relaxed" style={{ textShadow: '0 1px 8px rgba(212, 175, 55, 0.5), 0 0 15px rgba(212, 175, 55, 0.3)' }}>
              Mais de 20 anos de excelência em técnicas exclusivas de beleza. 
              Um refúgio de sofisticação onde sua essência encontra a perfeição.
            </p>
            
            {/* CTA Principal */}
            <div>
              <Button asChild className="cta-luxury cta-pulse bg-black text-white hover:bg-black hover:text-white font-sans-modern px-12 py-6 text-xl rounded-full font-semibold" data-testid="button-schedule">
                <Link href="/agendamentos">
                  <i className="fas fa-calendar-alt text-2xl mr-3"></i>
                  Agende seu Horário
                </Link>
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
              <div className="text-5xl font-serif-luxury font-bold text-gold-bright mb-3">20+</div>
              <div className="font-sans-modern text-gold/80 text-base uppercase tracking-wide">Anos de Experiência</div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-serif-luxury font-bold text-gold-bright mb-3">+200</div>
              <div className="font-sans-modern text-gold/80 text-base uppercase tracking-wide">Clientes Satisfeitas</div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-serif-luxury font-bold text-gold-bright mb-3">Premium</div>
              <div className="font-sans-modern text-gold/80 text-base uppercase tracking-wide">Produtos Exclusivos</div>
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

          <div className="text-center mt-12">
            <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3" data-testid="button-add-testimonial">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Deixar Depoimento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Compartilhe sua Experiência</DialogTitle>
                </DialogHeader>
                <Form {...testimonialForm}>
                  <form onSubmit={testimonialForm.handleSubmit(onSubmitTestimonial)} className="space-y-4">
                    <FormField
                      control={testimonialForm.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seu Nome</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Digite seu nome" 
                              {...field} 
                              data-testid="input-testimonial-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={testimonialForm.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Serviço Realizado</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <SelectTrigger data-testid="select-testimonial-service">
                                <SelectValue placeholder="Selecione o serviço" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.isArray(services) && services.map((service: any) => (
                                  <SelectItem key={service.id} value={service.name}>
                                    {service.name}
                                  </SelectItem>
                                ))}
                                <SelectItem value="Geral">Experiência Geral</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={testimonialForm.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sua Avaliação</FormLabel>
                          <FormControl>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Button
                                  key={star}
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="p-0 h-8 w-8"
                                  onClick={() => field.onChange(star)}
                                  data-testid={`star-rating-${star}`}
                                >
                                  <Star 
                                    className={`w-6 h-6 ${
                                      star <= (field.value || 0) 
                                        ? 'fill-yellow-400 text-yellow-400' 
                                        : 'text-gray-300'
                                    }`}
                                  />
                                </Button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={testimonialForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seu Depoimento</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Conte como foi sua experiência no Luccy Studio..." 
                              {...field} 
                              data-testid="textarea-testimonial-content"
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsTestimonialDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createTestimonialMutation.isPending}
                        className="flex-1"
                        data-testid="button-submit-testimonial"
                      >
                        {createTestimonialMutation.isPending ? "Enviando..." : "Enviar"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
    </div>
  );
}

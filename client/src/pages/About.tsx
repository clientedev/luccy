export default function About() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
            alt="Profissional do Luccy Studio atendendo cliente"
            className="rounded-2xl shadow-xl w-full h-auto"
            data-testid="about-image"
          />

          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-6">Sobre o Luccy Studio</h1>
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed" data-testid="about-paragraph-1">
                O Luccy Studio nasceu para transformar a autoestima de cada cliente. Trazemos expertise consolidada em moda e beleza para oferecer serviços de excelência.
              </p>
              <p className="text-lg leading-relaxed" data-testid="about-paragraph-2">
                Aqui unimos cuidados especializados em cabelo, unhas, cílios e maquiagem com um espaço acolhedor e sofisticado.
              </p>
              <div className="grid grid-cols-2 gap-6 py-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-experience">Premium</div>
                  <div className="text-sm text-muted-foreground">Técnicas Exclusivas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-clients">500+</div>
                  <div className="text-sm text-muted-foreground">Clientes Satisfeitas</div>
                </div>
              </div>
              <p className="font-medium text-foreground" data-testid="about-quote">
                <em>"Sua beleza é nossa paixão"</em> - Raquel Luci Lopes da Silva
              </p>
            </div>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-8 bg-card rounded-xl border border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-heart text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-serif font-semibold text-foreground mb-4">Nossa Missão</h3>
            <p className="text-muted-foreground">
              Transformar a autoestima de cada cliente através de serviços de beleza especializados e um atendimento acolhedor e personalizado.
            </p>
          </div>

          <div className="text-center p-8 bg-card rounded-xl border border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-eye text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-serif font-semibold text-foreground mb-4">Nossa Visão</h3>
            <p className="text-muted-foreground">
              Ser reconhecido como o salão de referência em São Paulo pela excelência em serviços de beleza e pela experiência única oferecida aos clientes.
            </p>
          </div>

          <div className="text-center p-8 bg-card rounded-xl border border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-gem text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-serif font-semibold text-foreground mb-4">Nossos Valores</h3>
            <p className="text-muted-foreground">
              Qualidade, elegância, inovação e respeito. Valorizamos cada cliente como única, oferecendo sempre o melhor em produtos e técnicas.
            </p>
          </div>
        </div>

        {/* History Timeline */}
        <div className="mt-20">
          <h3 className="text-3xl font-serif font-bold text-foreground text-center mb-12">Nossa História</h3>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">2004 - O Início</h4>
                  <p className="text-muted-foreground">
                    Raquel Luci Lopes da Silva inicia sua jornada no mundo da beleza, acumulando experiência em diversos salões de São Paulo.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">2010 - Especialização</h4>
                  <p className="text-muted-foreground">
                    Especialização em técnicas avançadas de coloração, mega hair e extensões. Participação em cursos internacionais de moda e beleza.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">2020 - Expansão dos Serviços</h4>
                  <p className="text-muted-foreground">
                    Ampliação para serviços completos de beleza: unhas, cílios, maquiagem e consultoria de imagem.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">2024 - Luccy Studio</h4>
                  <p className="text-muted-foreground">
                    Inauguração do Luccy Studio em Morro Grande, unindo toda a experiência acumulada em um espaço sofisticado e acolhedor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

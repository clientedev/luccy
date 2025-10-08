import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Gallery() {
  const { data: galleryImages, isLoading } = useQuery({
    queryKey: ["/api/gallery"],
  });

  // Sample portfolio images
  const portfolioImages = [
    {
      src: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      alt: "Maquiagem profissional com olhos marcantes",
      category: "Maquiagem Artística"
    },
    {
      src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      alt: "Nail art elegante com detalhes dourados",
      category: "Nail Art"
    },
    {
      src: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      alt: "Penteado de noiva elegante com volume",
      category: "Penteados"
    },
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      alt: "Extensão de cílios com curvatura perfeita",
      category: "Extensão de Cílios"
    },
    {
      src: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      alt: "Transformação capilar com mechas douradas",
      category: "Coloração"
    },
    {
      src: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
      alt: "Maquiagem de noiva com pele iluminada",
      category: "Noivas"
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Galeria & Portfólio</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Confira nossos trabalhos e acompanhe nossas novidades no Instagram.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {portfolioImages.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                data-testid={`gallery-image-${index}`}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white font-semibold" data-testid={`gallery-category-${index}`}>
                  {image.category}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Gallery Images */}
        {Array.isArray(galleryImages) && galleryImages.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-8 text-center">Trabalhos Recentes</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image: any) => (
                <div key={image.id} className="group relative overflow-hidden rounded-xl">
                  <img
                    src={image.image}
                    alt={image.title || 'Trabalho do Luccy Studio'}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    data-testid={`admin-gallery-image-${image.id}`}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white font-semibold" data-testid={`admin-gallery-title-${image.id}`}>
                      {image.title || image.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instagram Integration Section */}
        <Card className="bg-background p-8 text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <i className="fab fa-instagram text-primary text-3xl"></i>
              <h4 className="text-2xl font-serif font-semibold text-foreground">Siga no Instagram</h4>
            </div>
            <p className="text-muted-foreground mb-6">
              Acompanhe nossos trabalhos diários e fique por dentro das novidades.
            </p>

            {/* Instagram Feed Placeholder */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted rounded-lg flex items-center justify-center"
                  data-testid={`instagram-placeholder-${i}`}
                >
                  <i className="fab fa-instagram text-muted-foreground text-2xl"></i>
                </div>
              ))}
            </div>

            <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg" data-testid="button-instagram">
              <a
                href="https://www.instagram.com/luccystudio_/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram mr-2"></i>
                @luccystudio_
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Portfolio Categories */}
        <div className="grid md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-palette text-primary text-2xl"></i>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Maquiagem</h3>
            <p className="text-sm text-muted-foreground">Social, noivas e artística</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-cut text-primary text-2xl"></i>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Cabelo</h3>
            <p className="text-sm text-muted-foreground">Cortes, cores e penteados</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-hand-sparkles text-primary text-2xl"></i>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Unhas</h3>
            <p className="text-sm text-muted-foreground">Nail art e decorações</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-eye text-primary text-2xl"></i>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Cílios</h3>
            <p className="text-sm text-muted-foreground">Extensões e volume</p>
          </div>
        </div>
      </div>
    </div>
  );
}

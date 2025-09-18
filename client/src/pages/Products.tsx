import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Products() {
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Sample product categories for display
  const productCategories = [
    {
      name: "Maquiagens",
      slug: "maquiagens",
      description: "Bases, batons, sombras e mais",
      priceFrom: "R$ 10",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    },
    {
      name: "Hidratantes",
      slug: "hidratantes", 
      description: "Cuidados para pele e cabelo",
      priceFrom: "R$ 15",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    },
    {
      name: "Roupas Femininas",
      slug: "roupas",
      description: "Peças selecionadas com estilo", 
      priceFrom: "R$ 20",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    },
    {
      name: "Bijuterias",
      slug: "bijuterias",
      description: "Acessórios para realçar sua beleza",
      priceFrom: "R$ 10", 
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Nossa Loja</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Produtos cuidadosamente selecionados para complementar sua rotina de beleza.
          </p>
        </div>

        {/* Product Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {productCategories.map((category) => (
            <Card key={category.slug} className="product-card bg-card overflow-hidden border border-border hover:shadow-lg transition-all">
              <img
                src={category.image}
                alt={`Categoria ${category.name}`}
                className="w-full h-48 object-cover"
                data-testid={`category-image-${category.slug}`}
              />
              <CardContent className="p-6">
                <h4 className="text-xl font-serif font-semibold text-foreground mb-2" data-testid={`category-name-${category.slug}`}>
                  {category.name}
                </h4>
                <p className="text-muted-foreground text-sm mb-4" data-testid={`category-description-${category.slug}`}>
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold" data-testid={`category-price-${category.slug}`}>
                    A partir de {category.priceFrom}
                  </span>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    data-testid={`button-view-products-${category.slug}`}
                  >
                    Ver Produtos
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Products Tabs */}
        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" data-testid="tab-all-products">Todos</TabsTrigger>
            <TabsTrigger value="maquiagens" data-testid="tab-makeup">Maquiagem</TabsTrigger>
            <TabsTrigger value="hidratantes" data-testid="tab-skincare">Skincare</TabsTrigger>
            <TabsTrigger value="roupas" data-testid="tab-clothing">Roupas</TabsTrigger>
            <TabsTrigger value="bijuterias" data-testid="tab-jewelry">Bijuterias</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {productsLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 mb-2" />
                      <Skeleton className="h-16 mb-4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-9 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : Array.isArray(products) && products.length > 0 ? (
                products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <i className="fas fa-box-open text-muted-foreground text-4xl mb-4"></i>
                  <p className="text-muted-foreground">Produtos em breve!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Other tab contents would filter products by category */}
          <TabsContent value="maquiagens" className="mt-8">
            <div className="text-center py-12">
              <i className="fas fa-palette text-muted-foreground text-4xl mb-4"></i>
              <p className="text-muted-foreground">Produtos de maquiagem em breve!</p>
            </div>
          </TabsContent>

          <TabsContent value="hidratantes" className="mt-8">
            <div className="text-center py-12">
              <i className="fas fa-tint text-muted-foreground text-4xl mb-4"></i>
              <p className="text-muted-foreground">Produtos de skincare em breve!</p>
            </div>
          </TabsContent>

          <TabsContent value="roupas" className="mt-8">
            <div className="text-center py-12">
              <i className="fas fa-tshirt text-muted-foreground text-4xl mb-4"></i>
              <p className="text-muted-foreground">Roupas femininas em breve!</p>
            </div>
          </TabsContent>

          <TabsContent value="bijuterias" className="mt-8">
            <div className="text-center py-12">
              <i className="fas fa-gem text-muted-foreground text-4xl mb-4"></i>
              <p className="text-muted-foreground">Bijuterias em breve!</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Simple Checkout CTA */}
        <Card className="text-center bg-secondary/50 p-8 max-w-md mx-auto">
          <CardContent className="pt-6">
            <i className="fas fa-shopping-cart text-primary text-3xl mb-4"></i>
            <h4 className="text-xl font-serif font-semibold text-foreground mb-2">Compra Simples e Segura</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Checkout simplificado com entrega rápida
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="button-explore-products">
              Explorar Todos os Produtos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

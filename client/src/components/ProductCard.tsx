import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="product-card bg-card overflow-hidden border border-border hover:shadow-lg transition-all">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
          data-testid={`product-image-${product.id}`}
        />
      )}
      <CardContent className="p-6">
        <h4 className="text-xl font-serif font-semibold text-foreground mb-2" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h4>
        {product.description && (
          <p className="text-muted-foreground text-sm mb-4" data-testid={`product-description-${product.id}`}>
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-primary font-bold" data-testid={`product-price-${product.id}`}>
            R$ {product.price}
          </span>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            data-testid={`button-buy-${product.id}`}
          >
            Comprar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

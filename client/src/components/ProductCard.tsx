import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const images = [product.image1, product.image2, product.image3].filter((img): img is string => !!img);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBuyClick = () => {
    const whatsappNumber = "5511944555381";
    const message = `Olá! Tenho interesse no produto: *${product.name}*\nPreço: R$ ${product.price}\n\nGostaria de mais informações!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="product-card bg-card overflow-hidden border border-border hover:shadow-lg transition-all">
      {images.length > 0 && (
        <div className="relative group">
          <img
            src={images[currentImageIndex]}
            alt={`${product.name} - Imagem ${currentImageIndex + 1}`}
            className="w-full h-48 object-cover"
            data-testid={`product-image-${product.id}`}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`button-prev-image-${product.id}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`button-next-image-${product.id}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
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
            onClick={handleBuyClick}
            className="bg-green-500 hover:bg-green-600 text-white"
            data-testid={`button-buy-${product.id}`}
          >
            <SiWhatsapp className="w-4 h-4 mr-2" />
            Comprar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

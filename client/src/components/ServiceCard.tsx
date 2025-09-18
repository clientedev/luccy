import { Card, CardContent } from "@/components/ui/card";
import { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
  featured?: boolean;
}

export default function ServiceCard({ service, featured = false }: ServiceCardProps) {
  return (
    <Card className={`service-card bg-background border border-border hover:shadow-lg transition-all ${featured ? 'ring-2 ring-primary/20' : ''}`}>
      <CardContent className="p-6">
        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
          <i className="fas fa-cut text-primary text-2xl"></i>
        </div>
        <h4 className="text-xl font-serif font-semibold text-foreground mb-3" data-testid={`service-name-${service.id}`}>
          {service.name}
        </h4>
        {service.description && (
          <p className="text-muted-foreground text-sm mb-4" data-testid={`service-description-${service.id}`}>
            {service.description}
          </p>
        )}
        {service.price && (
          <div className="text-primary font-semibold" data-testid={`service-price-${service.id}`}>
            {service.price}
          </div>
        )}
        {service.duration && (
          <div className="text-sm text-muted-foreground mt-1" data-testid={`service-duration-${service.id}`}>
            Duração: {service.duration}
          </div>
        )}
        {featured && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <p className="text-xs font-semibold text-primary mb-1">DESTAQUE ESPECIAL</p>
            <p className="text-sm text-foreground font-medium">Alongamento Mega Hair</p>
            <p className="text-xs text-muted-foreground">Nagô, Microlink, Fitagem</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

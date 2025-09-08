import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Star, Building, Crown } from "lucide-react";

const plans = [
  {
    name: "Estándar",
    price: "$199",
    currency: "USD",
    period: "/mes",
    description: "Perfecto para empresas que inician su SGCN",
    icon: Check,
    popular: false,
    features: [
      "Hasta 50 empleados",
      "Hasta 10 procesos SGCN",
      "Módulos 1-5 (Gobierno, ARA, BIA, Estrategias, Planes)",
      "50GB almacén documental",
      "Retención 1 año",
      "Soporte estándar",
      "Exportes PDF/JSON",
      "Cumplimiento ISO 22301 básico"
    ]
  },
  {
    name: "Profesional",
    price: "$399",
    currency: "USD", 
    period: "/mes",
    description: "Para empresas que requieren funcionalidad completa",
    icon: Star,
    popular: true,
    features: [
      "Hasta 150 empleados",
      "Hasta 30 procesos SGCN", 
      "Todos los módulos (1-7)",
      "Pruebas automatizadas + QA",
      "200GB almacén documental",
      "Retención 2 años",
      "Soporte prioritario",
      "Integraciones ITSM",
      "Dashboard AI Advisor"
    ]
  },
  {
    name: "Premium",
    price: "Personalizado",
    currency: "",
    period: "/año",
    description: "Solución empresarial sin límites",
    icon: Building,
    popular: false,
    features: [
      "Empleados ilimitados",
      "Procesos SGCN ilimitados",
      "Todos los módulos + IA avanzada",
      "Soporte 24/7 preferencial",
      "500GB almacén documental", 
      "Retención 3 años",
      "2 atenciones de incidentes/año",
      "Chaos Engineering",
      "Benchmarking sectorial"
    ]
  },
  {
    name: "Empresarial Portafolio",
    price: "Contactar",
    currency: "",
    period: "",
    description: "Gestión multi-empresa con white-labeling",
    icon: Crown,
    popular: false,
    features: [
      "Todo lo del Premium",
      "Dashboard Fenix-SGCN Portafolio",
      "White-labeling completo",
      "Multi-tenant avanzado",
      "SLA contractual personalizado",
      "Soporte dedicado 24/7",
      "Consultoría especializada",
      "Implementación guiada"
    ]
  }
];

const Pricing = () => {
  return (
    <section id="plans" className="py-20 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="text-primary border-primary mb-4">
            Planes y Precios
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Elige el Plan Perfecto
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Desde startups hasta grandes corporaciones. Cada plan incluye todas las 
            funcionalidades necesarias para el cumplimiento de estándares internacionales.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative h-full hover:shadow-card-custom transition-smooth ${
                plan.popular 
                  ? 'border-primary shadow-elegant scale-105' 
                  : 'border-border/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-white px-4 py-1">
                    Más Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                    plan.popular 
                      ? 'bg-gradient-primary' 
                      : 'bg-muted'
                  }`}>
                    <plan.icon className={`h-6 w-6 ${
                      plan.popular ? 'text-white' : 'text-primary'
                    }`} />
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-primary">
                      {plan.price}
                    </span>
                    {plan.currency && (
                      <span className="text-sm text-muted-foreground ml-1">
                        {plan.currency}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground ml-1">
                      {plan.period}
                    </span>
                  </div>
                </div>
                
                <CardDescription className="text-center">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant={plan.popular ? "hero" : "professional"} 
                  className="w-full"
                  size="lg"
                >
                  {plan.name === "Premium" || plan.name === "Empresarial Portafolio" 
                    ? "Contactar Ventas" 
                    : "Comenzar Prueba"
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            ¿Necesitas más información? Nuestro equipo está listo para ayudarte.
          </p>
          <Button variant="outline" size="lg">
            Programar Demostración Personalizada
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
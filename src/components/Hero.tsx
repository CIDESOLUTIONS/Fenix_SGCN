import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.png";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero pt-20 pb-16 md:pt-24 md:pb-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="text-primary border-primary">
                ISO 22301 • ISO 31000 • NIST Compliant
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                La Plataforma SaaS
                <span className="bg-gradient-primary bg-clip-text text-transparent"> más Completa</span> para 
                <span className="bg-gradient-primary bg-clip-text text-transparent"> SGCN</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Implementa, opera, audita y mejora tu Sistema de Gestión de Continuidad del Negocio 
                con total conformidad a estándares internacionales. La solución empresarial que supera 
                a Fusion, Veoci y MetricStream.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8">
                Comenzar Prueba Gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="professional" size="lg" className="text-lg px-8">
                Ver Demo Interactiva
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>99.95% SLA</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-secondary" />
                <span>API &lt; 200ms</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 text-primary" />
                <span>Multi-idioma</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={heroDashboard} 
                alt="Fenix-SGCN Dashboard" 
                className="w-full h-auto rounded-2xl shadow-elegant"
              />
            </div>
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-2xl blur-2xl scale-110"></div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(55,_99,_244,_0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,_185,_129,_0.05),transparent_50%)]"></div>
      </div>
    </section>
  );
};

export default Hero;
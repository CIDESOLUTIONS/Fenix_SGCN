import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Linkedin, 
  Twitter, 
  Globe,
  Shield,
  Award,
  Building
} from "lucide-react";
import cideLogo from "@/assets/cide-logo.png";
import phoenixLogo from "@/assets/phoenix-logo.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center space-x-3">
                <img src={phoenixLogo} alt="Fenix" className="h-10 w-10" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Fenix-SGCN
                  </span>
                  <span className="text-sm text-muted-foreground">by CIDE SAS</span>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                La plataforma SaaS más completa para Sistemas de Gestión de Continuidad del Negocio. 
                Cumplimiento total con ISO 22301, ISO 31000 y estándares internacionales.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Bogotá, Colombia</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+57 315 765 1063</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>comercial@cidesas.com</span>
                </div>
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Soluciones</h3>
              <div className="space-y-3">
                {[
                  "Análisis de Impacto (BIA)",
                  "Análisis de Riesgos (ARA)", 
                  "Planes de Continuidad",
                  "Pruebas Automatizadas",
                  "Dashboard Ejecutivo",
                  "Mejora Continua"
                ].map((item) => (
                  <a 
                    key={item}
                    href="#" 
                    className="block text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Standards & Compliance */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Cumplimiento</h3>
              <div className="space-y-3">
                {[
                  "ISO 22301:2019",
                  "ISO 31000:2018",
                  "ISO 27001:2022",
                  "NIST Framework",
                  "GDPR Compliance",
                  "SOC 2 Type II"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-secondary" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources & Contact */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Recursos</h3>
              <div className="space-y-3">
                {[
                  "Documentación API",
                  "Centro de Ayuda",
                  "Webinars",
                  "Casos de Estudio",
                  "Blog",
                  "Soporte Técnico"
                ].map((item) => (
                  <a 
                    key={item}
                    href="#" 
                    className="block text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {item}
                  </a>
                ))}
              </div>

              <div className="pt-4">
                <Button variant="hero" className="w-full">
                  Comenzar Ahora
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Trust Indicators */}
        <div className="py-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">99.95% SLA</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-secondary" />
              <span className="text-sm text-muted-foreground">ISO Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Enterprise Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-secondary" />
              <span className="text-sm text-muted-foreground">Multi-región</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={cideLogo} alt="CIDE SAS" className="h-10" />
              <div className="text-sm text-muted-foreground">
                © 2025 CIDE SAS. Todos los derechos reservados.
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Globe className="h-5 w-5" />
              </a>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-smooth">Privacidad</a>
              <a href="#" className="hover:text-primary transition-smooth">Términos</a>
              <a href="#" className="hover:text-primary transition-smooth">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
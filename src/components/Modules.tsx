import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  AlertTriangle, 
  Target, 
  MapPin, 
  FileText, 
  TestTube2, 
  TrendingUp 
} from "lucide-react";

const modules = [
  {
    id: 1,
    icon: BookOpen,
    title: "Planeación y Gobierno",
    description: "Gestión de políticas con workflow de aprobación, firmas electrónicas y control de vigencia. Editor RACI colaborativo con versionado.",
    standard: "ISO 22301 - Cláusula 5",
    included: ["Estándar", "Profesional", "Premium", "Empresarial"]
  },
  {
    id: 2,
    icon: AlertTriangle,
    title: "Riesgo de Continuidad (ARA)",
    description: "Registro de riesgos con KRIs/KPIs, integración con fuentes externas y escenarios 'what-if' con simulaciones Montecarlo.",
    standard: "ISO 31000 + ISO 22301",
    included: ["Estándar", "Profesional", "Premium", "Empresarial"]
  },
  {
    id: 3,
    icon: Target,
    title: "Análisis de Impacto (BIA)",
    description: "Cuestionarios inteligentes con sugerencias automáticas de RTO/RPO/MTPD. Dependency mapping visual y simulación de pérdidas.",
    standard: "ISO 22317",
    included: ["Estándar", "Profesional", "Premium", "Empresarial"]
  },
  {
    id: 4,
    icon: MapPin,
    title: "Escenarios y Estrategias",
    description: "Biblioteca de escenarios sectoriales, algoritmo de recomendación de estrategias y simulación de costo-efectividad.",
    standard: "ISO 22331",
    included: ["Estándar", "Profesional", "Premium", "Empresarial"]
  },
  {
    id: 5,
    icon: FileText,
    title: "Planes de Continuidad",
    description: "Editor visual drag & drop, orquestador en vivo y playbooks integrados con ITSM. Registro de tiempos reales vs RTO/RPO.",
    standard: "ISO 22301 - Cláusula 8",
    included: ["Estándar", "Profesional", "Premium", "Empresarial"]
  },
  {
    id: 6,
    icon: TestTube2,
    title: "Pruebas de Continuidad",
    description: "Programador de ejercicios, ejecución guiada con scoring automático y captura de evidencias multimedia.",
    standard: "ISO 22301 - Cláusula 8.5",
    included: ["Profesional", "Premium", "Empresarial"]
  },
  {
    id: 7,
    icon: TrendingUp,
    title: "Mejora Continua",
    description: "Workflow de hallazgos y acciones correctivas, dashboard de desempeño y reportes automatizados de revisión directiva.",
    standard: "ISO 22301 - Cláusula 10",
    included: ["Profesional", "Premium", "Empresarial"]
  }
];

const Modules = () => {
  return (
    <section id="modules" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="text-secondary border-secondary mb-4">
            Módulos SGCN
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            7 Módulos Especializados
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cada módulo está diseñado para cumplir específicamente con los requisitos 
            de los estándares ISO 22301, ISO 31000 y mejores prácticas internacionales.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {modules.map((module) => (
            <Card key={module.id} className="h-full hover:shadow-card-custom transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Módulo {module.id}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
                <Badge variant="secondary" className="w-fit text-xs">
                  {module.standard}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {module.description}
                </CardDescription>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Incluido en planes:</p>
                  <div className="flex flex-wrap gap-2">
                    {module.included.map((plan) => (
                      <Badge key={plan} variant="outline" className="text-xs">
                        {plan}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="lg">
            Ver Demo de Módulos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Modules;
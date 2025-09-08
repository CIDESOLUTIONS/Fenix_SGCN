import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Shield, 
  Workflow, 
  Settings, 
  FileCheck, 
  TestTube,
  Brain,
  Globe
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Dashboard Ejecutivo",
    description: "KPIs de resiliencia, heatmaps dinámicos y AI Advisor con recomendaciones predictivas",
    badge: "IA Integrada"
  },
  {
    icon: Shield,
    title: "Análisis de Riesgos (ARA)",
    description: "Registro de riesgos con métricas avanzadas, integración con fuentes externas y simulaciones Montecarlo",
    badge: "ISO 31000"
  },
  {
    icon: Workflow,
    title: "Análisis de Impacto (BIA)",
    description: "Cuestionarios inteligentes, simulación de interrupciones y dependency mapping visual",
    badge: "ISO 22317"
  },
  {
    icon: FileCheck,
    title: "Planes de Continuidad",
    description: "Editor visual, orquestador en vivo y playbooks integrados con ITSM",
    badge: "ISO 22301"
  },
  {
    icon: TestTube,
    title: "Pruebas Automatizadas",
    description: "Simulacros programados, ejecución guiada con scoring automático y evidencias multimedia",
    badge: "Automatizado"
  },
  {
    icon: Settings,
    title: "Mejora Continua",
    description: "Workflow de hallazgos, acciones correctivas y reportes automatizados de revisión",
    badge: "PDCA"
  },
  {
    icon: Brain,
    title: "IA Predictiva",
    description: "Análisis predictivo de riesgos, sugerencias automáticas y optimización de estrategias",
    badge: "Machine Learning"
  },
  {
    icon: Globe,
    title: "Multi-tenant",
    description: "Gestión de múltiples empresas, white-labeling y benchmarking sectorial",
    badge: "Enterprise"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="text-primary border-primary mb-4">
            Características Avanzadas
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Supera a la Competencia
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Funcionalidades que van más allá de Fusion, Veoci y MetricStream, 
            con tecnología de vanguardia y cumplimiento total de estándares internacionales.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="h-full hover:shadow-card-custom transition-smooth border-border/50">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
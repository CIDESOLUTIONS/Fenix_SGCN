import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Shield, AlertTriangle, TrendingUp, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  probability: number;
  impact: number;
  riskScore: number;
  status: string;
  owner: string;
  mitigationStrategy: string;
  createdAt: string;
}

const RiskAnalysis = () => {
  const { toast } = useToast();
  const [risks, setRisks] = useState<Risk[]>([
    {
      id: "1",
      title: "Falla del Sistema Principal",
      description: "Interrupción del sistema de información principal por falla técnica",
      category: "Tecnología",
      probability: 3,
      impact: 4,
      riskScore: 12,
      status: "Activo",
      owner: "TI",
      mitigationStrategy: "Implementar redundancia y backups automáticos",
      createdAt: "2024-01-15"
    },
    {
      id: "2", 
      title: "Pérdida de Personal Clave",
      description: "Ausencia prolongada de personal crítico para operaciones",
      category: "Recursos Humanos",
      probability: 2,
      impact: 3,
      riskScore: 6,
      status: "En Monitoreo",
      owner: "RRHH",
      mitigationStrategy: "Plan de sucesión y documentación de procesos",
      createdAt: "2024-01-10"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRisk, setNewRisk] = useState({
    title: "",
    description: "",
    category: "",
    probability: 1,
    impact: 1,
    owner: "",
    mitigationStrategy: ""
  });

  const handleAddRisk = () => {
    const risk: Risk = {
      id: Date.now().toString(),
      ...newRisk,
      riskScore: newRisk.probability * newRisk.impact,
      status: "Activo",
      createdAt: new Date().toISOString().split('T')[0]
    };

    setRisks([...risks, risk]);
    setNewRisk({
      title: "",
      description: "",
      category: "",
      probability: 1,
      impact: 1,
      owner: "",
      mitigationStrategy: ""
    });
    setIsDialogOpen(false);
    toast({
      title: "Riesgo agregado",
      description: "El riesgo ha sido registrado exitosamente.",
    });
  };

  const getRiskLevel = (score: number) => {
    if (score >= 15) return { level: "Crítico", color: "destructive" };
    if (score >= 9) return { level: "Alto", color: "destructive" };
    if (score >= 4) return { level: "Medio", color: "default" };
    return { level: "Bajo", color: "secondary" };
  };

  const stats = {
    totalRisks: risks.length,
    criticalRisks: risks.filter(r => r.riskScore >= 15).length,
    highRisks: risks.filter(r => r.riskScore >= 9 && r.riskScore < 15).length,
    averageScore: risks.reduce((acc, r) => acc + r.riskScore, 0) / risks.length || 0
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Análisis de Riesgos (ARA)</h1>
            <p className="text-muted-foreground mt-2">Gestión integral de riesgos según ISO 31000</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Riesgo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Registrar Nuevo Riesgo</DialogTitle>
                  <DialogDescription>
                    Complete la información del riesgo identificado
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título del Riesgo</Label>
                      <Input
                        id="title"
                        value={newRisk.title}
                        onChange={(e) => setNewRisk({...newRisk, title: e.target.value})}
                        placeholder="Nombre del riesgo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría</Label>
                      <Select value={newRisk.category} onValueChange={(value) => setNewRisk({...newRisk, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tecnología">Tecnología</SelectItem>
                          <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                          <SelectItem value="Operacional">Operacional</SelectItem>
                          <SelectItem value="Financiero">Financiero</SelectItem>
                          <SelectItem value="Regulatorio">Regulatorio</SelectItem>
                          <SelectItem value="Reputacional">Reputacional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={newRisk.description}
                      onChange={(e) => setNewRisk({...newRisk, description: e.target.value})}
                      placeholder="Describa el riesgo detalladamente"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="probability">Probabilidad (1-5)</Label>
                      <Select value={newRisk.probability.toString()} onValueChange={(value) => setNewRisk({...newRisk, probability: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Muy Baja</SelectItem>
                          <SelectItem value="2">2 - Baja</SelectItem>
                          <SelectItem value="3">3 - Media</SelectItem>
                          <SelectItem value="4">4 - Alta</SelectItem>
                          <SelectItem value="5">5 - Muy Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="impact">Impacto (1-5)</Label>
                      <Select value={newRisk.impact.toString()} onValueChange={(value) => setNewRisk({...newRisk, impact: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Insignificante</SelectItem>
                          <SelectItem value="2">2 - Menor</SelectItem>
                          <SelectItem value="3">3 - Moderado</SelectItem>
                          <SelectItem value="4">4 - Mayor</SelectItem>
                          <SelectItem value="5">5 - Catastrófico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner">Responsable</Label>
                      <Input
                        id="owner"
                        value={newRisk.owner}
                        onChange={(e) => setNewRisk({...newRisk, owner: e.target.value})}
                        placeholder="Área responsable"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mitigation">Estrategia de Mitigación</Label>
                    <Textarea
                      id="mitigation"
                      value={newRisk.mitigationStrategy}
                      onChange={(e) => setNewRisk({...newRisk, mitigationStrategy: e.target.value})}
                      placeholder="Describa las medidas de mitigación"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddRisk} disabled={!newRisk.title || !newRisk.category}>
                    Registrar Riesgo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Riesgos</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRisks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Riesgos Críticos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.criticalRisks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Riesgos Altos</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{stats.highRisks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Puntuación Promedio</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido Principal */}
        <Tabs defaultValue="risks" className="w-full">
          <TabsList>
            <TabsTrigger value="risks">Registro de Riesgos</TabsTrigger>
            <TabsTrigger value="matrix">Matriz de Riesgos</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="risks" className="space-y-4">
            <div className="grid gap-4">
              {risks.map((risk) => {
                const riskLevel = getRiskLevel(risk.riskScore);
                return (
                  <Card key={risk.id} className="border-border/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">{risk.title}</CardTitle>
                          <Badge variant={riskLevel.color as any}>
                            {riskLevel.level}
                          </Badge>
                          <Badge variant="outline">{risk.category}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{risk.riskScore}</div>
                          <div className="text-xs text-muted-foreground">
                            P:{risk.probability} × I:{risk.impact}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <CardDescription>{risk.description}</CardDescription>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Responsable:</span> {risk.owner}
                          </div>
                          <div>
                            <span className="font-medium">Estado:</span> {risk.status}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-sm">Estrategia de Mitigación:</span>
                          <p className="text-sm text-muted-foreground mt-1">{risk.mitigationStrategy}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="matrix" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Matriz de Riesgos</CardTitle>
                <CardDescription>Visualización de riesgos por probabilidad e impacto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2 text-center text-sm">
                  <div></div>
                  <div className="font-medium">1</div>
                  <div className="font-medium">2</div>
                  <div className="font-medium">3</div>
                  <div className="font-medium">4</div>
                  <div className="font-medium">5</div>
                  
                  {[5,4,3,2,1].map(impact => (
                    <>
                      <div key={impact} className="font-medium">{impact}</div>
                      {[1,2,3,4,5].map(probability => {
                        const score = probability * impact;
                        const riskLevel = getRiskLevel(score);
                        const risksInCell = risks.filter(r => r.probability === probability && r.impact === impact);
                        return (
                          <div 
                            key={`${probability}-${impact}`}
                            className={`p-4 border rounded text-xs min-h-[60px] flex flex-col justify-center items-center ${
                              score >= 15 ? 'bg-destructive/20 border-destructive' :
                              score >= 9 ? 'bg-orange-500/20 border-orange-500' :
                              score >= 4 ? 'bg-yellow-500/20 border-yellow-500' :
                              'bg-secondary/20 border-border'
                            }`}
                          >
                            <div className="font-bold">{score}</div>
                            {risksInCell.length > 0 && (
                              <div className="text-xs">{risksInCell.length} riesgo(s)</div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  ))}
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  <strong>Eje X:</strong> Probabilidad | <strong>Eje Y:</strong> Impacto
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reportes de Análisis de Riesgos</CardTitle>
                <CardDescription>Informes y documentación del proceso ARA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Button variant="outline" className="justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Reporte Ejecutivo de Riesgos
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Matriz de Riesgos Completa
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Plan de Tratamiento de Riesgos
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Historial de Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RiskAnalysis;
import { useState, useEffect } from "react";
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
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import CriteriaManager from "@/components/CriteriaManager";
import EvaluationMatrix from "@/components/EvaluationMatrix";

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
      status: "Activo",
      owner: "RRHH",
      mitigationStrategy: "Plan de sucesión y entrenamiento cruzado",
      createdAt: "2024-01-20"
    }
  ]);

  const [criteria, setCriteria] = useState<any[]>([]);
  const [newRisk, setNewRisk] = useState({
    title: "",
    description: "",
    category: "",
    probability: 1,
    impact: 1,
    owner: "",
    mitigationStrategy: ""
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddRisk = () => {
    const risk: Risk = {
      ...newRisk,
      id: Date.now().toString(),
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

  // Transform risks to match EvaluationMatrix interface
  const riskItems = risks.map(risk => ({
    id: risk.id,
    risk_name: risk.title,
    risk_description: risk.description
  }));

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
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
                                <SelectItem value="Legal">Legal</SelectItem>
                                <SelectItem value="Ambiental">Ambiental</SelectItem>
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
                            placeholder="Describa el riesgo identificado"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="owner">Responsable</Label>
                            <Input
                              id="owner"
                              value={newRisk.owner}
                              onChange={(e) => setNewRisk({...newRisk, owner: e.target.value})}
                              placeholder="Área o persona responsable"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Puntuación Calculada</Label>
                            <div className="flex items-center h-10 px-3 py-2 border rounded-md bg-muted">
                              <span className="font-medium">{newRisk.probability * newRisk.impact}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mitigation">Estrategia de Mitigación</Label>
                          <Textarea
                            id="mitigation"
                            value={newRisk.mitigationStrategy}
                            onChange={(e) => setNewRisk({...newRisk, mitigationStrategy: e.target.value})}
                            placeholder="Describa las medidas para mitigar este riesgo"
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddRisk}>
                          Guardar Riesgo
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Stats Cards */}
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
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Vista General</TabsTrigger>
                  <TabsTrigger value="risks">Riesgos</TabsTrigger>
                  <TabsTrigger value="criteria">Criterios</TabsTrigger>
                  <TabsTrigger value="evaluation">Evaluación</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Registro de Riesgos Identificados</CardTitle>
                      <CardDescription>
                        Lista completa de riesgos identificados con su evaluación
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {risks.map((risk) => {
                          const riskLevel = getRiskLevel(risk.riskScore);
                          return (
                            <div key={risk.id} className="border rounded-lg p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-semibold">{risk.title}</h3>
                                  <Badge variant="outline">{risk.category}</Badge>
                                  <Badge variant={riskLevel.color as any}>{riskLevel.level}</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">
                                    Puntuación: {risk.riskScore}
                                  </span>
                                  <Button variant="outline" size="sm">
                                    Editar
                                  </Button>
                                </div>
                              </div>
                              <p className="text-muted-foreground">{risk.description}</p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Responsable:</span> {risk.owner}
                                </div>
                                <div>
                                  <span className="font-medium">Probabilidad:</span> {risk.probability}/5
                                </div>
                                <div>
                                  <span className="font-medium">Impacto:</span> {risk.impact}/5
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-sm">Estrategia de Mitigación:</span>
                                <p className="text-sm text-muted-foreground mt-1">{risk.mitigationStrategy}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="risks" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gestión de Riesgos</CardTitle>
                      <CardDescription>
                        Administre los riesgos identificados
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center text-muted-foreground py-8">
                        Funcionalidad en desarrollo
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="criteria" className="space-y-4">
                  <CriteriaManager 
                    moduleType="risk" 
                    onCriteriaChange={(newCriteria) => setCriteria(newCriteria)}
                  />
                </TabsContent>

                <TabsContent value="evaluation" className="space-y-4">
                  <EvaluationMatrix
                    moduleType="risk"
                    criteria={criteria}
                    items={riskItems}
                    itemNameField="risk_name"
                    itemDescField="risk_description"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default RiskAnalysis;
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Building2, Clock, DollarSign, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import CriteriaManager from '@/components/CriteriaManager';
import EvaluationMatrix from '@/components/EvaluationMatrix';

interface BusinessProcess {
  id: string;
  name: string;
  description: string;
  department: string;
  criticality_level: string;
  responsible_person: string;
  dependencies: string[];
  raci_responsible: string;
  raci_accountable: string;
  raci_consulted: string;
  raci_informed: string;
  created_at: string;
}

interface BIAAssessment {
  id: string;
  process_id: string;
  rto: number; // Recovery Time Objective (hours)
  rpo: number; // Recovery Point Objective (hours)
  mtpd: number; // Maximum Tolerable Period of Disruption (hours)
  mbco: number; // Minimum Business Continuity Objective (%)
  financial_impact_1h: number;
  financial_impact_24h: number;
  financial_impact_1w: number;
  operational_impact: string;
  regulatory_impact: string;
  reputation_impact: string;
  created_at: string;
}

const BusinessImpactAnalysis = () => {
  const { user } = useAuth();
  const { t, formatCurrency } = useSettings();
  const { toast } = useToast();
  const [processes, setProcesses] = useState<BusinessProcess[]>([]);
  const [assessments, setAssessments] = useState<BIAAssessment[]>([]);
  const [criteria, setCriteria] = useState<any[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<BusinessProcess | null>(null);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
  const [isBIADialogOpen, setIsBIADialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [processForm, setProcessForm] = useState({
    name: "",
    description: "",
    department: "",
    criticality_level: "",
    responsible_person: "",
    dependencies: "",
    raci_responsible: "",
    raci_accountable: "",
    raci_consulted: "",
    raci_informed: ""
  });

  const [biaForm, setBiaForm] = useState({
    process_id: "",
    rto: "",
    rpo: "",
    mtpd: "",
    mbco: "",
    financial_impact_1h: "",
    financial_impact_24h: "",
    financial_impact_1w: "",
    operational_impact: "",
    regulatory_impact: "",
    reputation_impact: ""
  });

  useEffect(() => {
    fetchProcesses();
    fetchAssessments();
  }, []);

  const fetchProcesses = async () => {
    const { data, error } = await supabase
      .from('business_processes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Error al cargar procesos de negocio",
        variant: "destructive"
      });
    } else {
      setProcesses(data || []);
    }
    setLoading(false);
  };

  const fetchAssessments = async () => {
    const { data, error } = await supabase
      .from('bia_assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Error al cargar evaluaciones BIA",
        variant: "destructive"
      });
    } else {
      setAssessments(data || []);
    }
  };

  const handleProcessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const processData = {
      ...processForm,
      user_id: user.id,
      dependencies: processForm.dependencies.split(',').map(d => d.trim()).filter(d => d)
    };

    if (selectedProcess) {
      const { error } = await supabase
        .from('business_processes')
        .update(processData)
        .eq('id', selectedProcess.id);

      if (error) {
        toast({
          title: "Error",
          description: "Error al actualizar proceso",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Éxito",
          description: "Proceso actualizado correctamente"
        });
        fetchProcesses();
        setIsProcessDialogOpen(false);
        resetProcessForm();
      }
    } else {
      const { error } = await supabase
        .from('business_processes')
        .insert([processData]);

      if (error) {
        toast({
          title: "Error",
          description: "Error al crear proceso",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Éxito",
          description: "Proceso creado correctamente"
        });
        fetchProcesses();
        setIsProcessDialogOpen(false);
        resetProcessForm();
      }
    }
  };

  const handleBIASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const biaData = {
      user_id: user.id,
      process_id: biaForm.process_id,
      rto: parseInt(biaForm.rto),
      rpo: parseInt(biaForm.rpo),
      mtpd: parseInt(biaForm.mtpd),
      mbco: parseInt(biaForm.mbco),
      financial_impact_1h: parseFloat(biaForm.financial_impact_1h),
      financial_impact_24h: parseFloat(biaForm.financial_impact_24h),
      financial_impact_1w: parseFloat(biaForm.financial_impact_1w),
      operational_impact: biaForm.operational_impact,
      regulatory_impact: biaForm.regulatory_impact,
      reputation_impact: biaForm.reputation_impact
    };

    const { error } = await supabase
      .from('bia_assessments')
      .insert([biaData]);

    if (error) {
      toast({
        title: "Error",
        description: "Error al crear evaluación BIA",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Éxito",
        description: "Evaluación BIA creada correctamente"
      });
      fetchAssessments();
      setIsBIADialogOpen(false);
      resetBIAForm();
    }
  };

  const resetProcessForm = () => {
    setProcessForm({
      name: "",
      description: "",
      department: "",
      criticality_level: "",
      responsible_person: "",
      dependencies: "",
      raci_responsible: "",
      raci_accountable: "",
      raci_consulted: "",
      raci_informed: ""
    });
    setSelectedProcess(null);
  };

  const resetBIAForm = () => {
    setBiaForm({
      process_id: "",
      rto: "",
      rpo: "",
      mtpd: "",
      mbco: "",
      financial_impact_1h: "",
      financial_impact_24h: "",
      financial_impact_1w: "",
      operational_impact: "",
      regulatory_impact: "",
      reputation_impact: ""
    });
  };

  const editProcess = (process: BusinessProcess) => {
    setSelectedProcess(process);
    setProcessForm({
      name: process.name,
      description: process.description || "",
      department: process.department || "",
      criticality_level: process.criticality_level || "",
      responsible_person: process.responsible_person || "",
      dependencies: process.dependencies?.join(', ') || "",
      raci_responsible: process.raci_responsible || "",
      raci_accountable: process.raci_accountable || "",
      raci_consulted: process.raci_consulted || "",
      raci_informed: process.raci_informed || ""
    });
    setIsProcessDialogOpen(true);
  };

  const deleteProcess = async (id: string) => {
    const { error } = await supabase
      .from('business_processes')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Error al eliminar proceso",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Éxito",
        description: "Proceso eliminado correctamente"
      });
      fetchProcesses();
    }
  };

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'default';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Análisis de Impacto al Negocio (BIA)
                </h1>
                <p className="text-muted-foreground mt-2">
                  Gestión de procesos críticos y evaluación de impactos
                </p>
              </div>
            </div>

            <Tabs defaultValue="concepts" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="processes">Procesos de Negocio</TabsTrigger>
                <TabsTrigger value="concepts">Conceptos BIA</TabsTrigger>
                <TabsTrigger value="assessments">Evaluaciones BIA</TabsTrigger>
                <TabsTrigger value="criteria">Criterios</TabsTrigger>
                <TabsTrigger value="summary">Resumen Ejecutivo</TabsTrigger>
              </TabsList>

              <TabsContent value="processes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Procesos de Negocio
                      </CardTitle>
                      <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => resetProcessForm()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Proceso
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>
                              {selectedProcess ? 'Editar Proceso' : 'Nuevo Proceso de Negocio'}
                            </DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleProcessSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Nombre del Proceso</Label>
                                <Input
                                  id="name"
                                  value={processForm.name}
                                  onChange={(e) => setProcessForm({...processForm, name: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="department">Departamento</Label>
                                <Input
                                  id="department"
                                  value={processForm.department}
                                  onChange={(e) => setProcessForm({...processForm, department: e.target.value})}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="description">Descripción</Label>
                              <Textarea
                                id="description"
                                value={processForm.description}
                                onChange={(e) => setProcessForm({...processForm, description: e.target.value})}
                                rows={3}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="criticality">Nivel de Criticidad</Label>
                                <Select 
                                  value={processForm.criticality_level} 
                                  onValueChange={(value) => setProcessForm({...processForm, criticality_level: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar nivel" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="critical">Crítico</SelectItem>
                                    <SelectItem value="high">Alto</SelectItem>
                                    <SelectItem value="medium">Medio</SelectItem>
                                    <SelectItem value="low">Bajo</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="responsible">Responsable</Label>
                                <Input
                                  id="responsible"
                                  value={processForm.responsible_person}
                                  onChange={(e) => setProcessForm({...processForm, responsible_person: e.target.value})}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dependencies">Dependencias (separadas por coma)</Label>
                              <Input
                                id="dependencies"
                                value={processForm.dependencies}
                                onChange={(e) => setProcessForm({...processForm, dependencies: e.target.value})}
                                placeholder="Sistema ERP, Base de datos, Red corporativa"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="raci_responsible">RACI - Responsable</Label>
                                <Input
                                  id="raci_responsible"
                                  value={processForm.raci_responsible}
                                  onChange={(e) => setProcessForm({...processForm, raci_responsible: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="raci_accountable">RACI - Accountable</Label>
                                <Input
                                  id="raci_accountable"
                                  value={processForm.raci_accountable}
                                  onChange={(e) => setProcessForm({...processForm, raci_accountable: e.target.value})}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="raci_consulted">RACI - Consultado</Label>
                                <Input
                                  id="raci_consulted"
                                  value={processForm.raci_consulted}
                                  onChange={(e) => setProcessForm({...processForm, raci_consulted: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="raci_informed">RACI - Informado</Label>
                                <Input
                                  id="raci_informed"
                                  value={processForm.raci_informed}
                                  onChange={(e) => setProcessForm({...processForm, raci_informed: e.target.value})}
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button type="button" variant="outline" onClick={() => setIsProcessDialogOpen(false)}>
                                Cancelar
                              </Button>
                              <Button type="submit">
                                {selectedProcess ? 'Actualizar' : 'Crear'} Proceso
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Proceso</TableHead>
                          <TableHead>Departamento</TableHead>
                          <TableHead>Criticidad</TableHead>
                          <TableHead>Responsable</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {processes.map((process) => (
                          <TableRow key={process.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{process.name}</div>
                                {process.description && (
                                  <div className="text-sm text-muted-foreground">{process.description}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{process.department}</TableCell>
                            <TableCell>
                              <Badge variant={getCriticalityColor(process.criticality_level)}>
                                {process.criticality_level}
                              </Badge>
                            </TableCell>
                            <TableCell>{process.responsible_person}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => editProcess(process)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteProcess(process.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="concepts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Conceptos Fundamentales del BIA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Timeline Concepts */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card className="border-2 border-blue-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-blue-700">RTO - Recovery Time Objective</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            <strong>Tiempo Recuperación Core Activo</strong>
                          </p>
                          <p className="text-sm">
                            Es el tiempo máximo aceptable que puede tomar recuperar un proceso de negocio después de una interrupción. 
                            Representa el tiempo desde el incidente hasta que el proceso esté operativo nuevamente.
                          </p>
                          <div className="mt-3 p-2 bg-blue-50 rounded">
                            <span className="text-xs font-medium text-blue-700">Ejemplo: 4 horas máximo</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-green-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-green-700">RPO - Recovery Point Objective</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            <strong>Punto Objetivo Recuperación</strong>
                          </p>
                          <p className="text-sm">
                            Es la cantidad máxima de datos que una organización puede permitirse perder durante una interrupción, 
                            medida en tiempo. Define el punto en el tiempo al cual los datos deben ser recuperados.
                          </p>
                          <div className="mt-3 p-2 bg-green-50 rounded">
                            <span className="text-xs font-medium text-green-700">Ejemplo: Pérdida máxima de 1 hora de datos</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-purple-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-purple-700">MTPD - Maximum Tolerable Period of Disruption</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            <strong>Período Máximo Indisponibilidad Tolerable</strong>
                          </p>
                          <p className="text-sm">
                            Es el tiempo máximo que una organización puede tolerar la interrupción de un proceso crítico de negocio 
                            antes de que el impacto se vuelva inaceptable para la supervivencia de la organización.
                          </p>
                          <div className="mt-3 p-2 bg-purple-50 rounded">
                            <span className="text-xs font-medium text-purple-700">Ejemplo: 72 horas máximo</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-orange-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-orange-700">MBCO - Minimum Business Continuity Objective</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            <strong>Objetivo Mínimo Continuidad Negocio</strong>
                          </p>
                          <p className="text-sm">
                            Es el nivel mínimo de servicios y/o productos que es aceptable para la organización durante una interrupción. 
                            Se expresa como un porcentaje de operación normal.
                          </p>
                          <div className="mt-3 p-2 bg-orange-50 rounded">
                            <span className="text-xs font-medium text-orange-700">Ejemplo: 60% de capacidad operativa</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Plans Overview */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Planes del SGCN</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <Card className="border-l-4 border-l-red-500">
                          <CardHeader>
                            <CardTitle className="text-base">IRP - Plan Respuesta Incidente</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Procedimientos inmediatos para responder a un incidente y minimizar el impacto inicial.
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-blue-500">
                          <CardHeader>
                            <CardTitle className="text-base">DRP - Plan Recuperación Desastres</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Estrategias y procedimientos para recuperar sistemas críticos después de un desastre.
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                          <CardHeader>
                            <CardTitle className="text-base">BCP - Plan Continuidad Negocio</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Plan integral para mantener operaciones críticas durante y después de una interrupción.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Relationship Timeline */}
                    <Card className="bg-gradient-to-r from-blue-50 to-green-50">
                      <CardHeader>
                        <CardTitle className="text-lg">Relación Temporal de los Objetivos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm"><strong>Incidente:</strong> Interrupción del servicio</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm"><strong>RPO:</strong> Punto máximo de pérdida de datos aceptable</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm"><strong>RTO:</strong> Tiempo para recuperar operaciones críticas</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-sm"><strong>WRT:</strong> Tiempo para recuperación completa</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-sm"><strong>MTPD:</strong> Límite máximo tolerable de interrupción</span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-white rounded border">
                          <p className="text-xs text-muted-foreground">
                            <strong>Nota importante:</strong> RTO debe ser siempre menor que MTPD. El MBCO define el nivel mínimo 
                            de servicio durante el período de recuperación.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="criteria" className="space-y-4">
                <CriteriaManager 
                  moduleType="bia" 
                  onCriteriaChange={(newCriteria) => setCriteria(newCriteria)}
                />
              </TabsContent>

              <TabsContent value="evaluation" className="space-y-4">
                <EvaluationMatrix
                  moduleType="bia"
                  criteria={criteria}
                  items={assessments.map(assessment => ({
                    id: assessment.id,
                    process_name: `Process ${assessment.process_id}`,
                    operational_impact: assessment.operational_impact
                  }))}
                  itemNameField="process_name"
                  itemDescField="operational_impact"
                />
              </TabsContent>

              <TabsContent value="criteria" className="space-y-4">
                <CriteriaManager 
                  moduleType="bia" 
                  onCriteriaChange={(newCriteria) => setCriteria(newCriteria)}
                />
              </TabsContent>

              <TabsContent value="evaluation" className="space-y-4">
                <EvaluationMatrix
                  moduleType="bia"
                  criteria={criteria}
                  items={assessments.map(assessment => ({
                    id: assessment.id,
                    process_name: `Process ${assessment.process_id}`,
                    operational_impact: assessment.operational_impact
                  }))}
                  itemNameField="process_name"
                  itemDescField="operational_impact"
                />
              </TabsContent>

              <TabsContent value="assessments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Evaluaciones BIA
                      </CardTitle>
                      <Dialog open={isBIADialogOpen} onOpenChange={setIsBIADialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => resetBIAForm()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Evaluación
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Nueva Evaluación BIA</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleBIASubmit} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="process_id">Proceso de Negocio</Label>
                              <Select 
                                value={biaForm.process_id} 
                                onValueChange={(value) => setBiaForm({...biaForm, process_id: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar proceso" />
                                </SelectTrigger>
                                <SelectContent>
                                  {processes.map((process) => (
                                    <SelectItem key={process.id} value={process.id}>
                                      {process.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="rto">RTO - Recovery Time Objective (horas)</Label>
                                <Input
                                  id="rto"
                                  type="number"
                                  value={biaForm.rto}
                                  onChange={(e) => setBiaForm({...biaForm, rto: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="rpo">RPO - Recovery Point Objective (horas)</Label>
                                <Input
                                  id="rpo"
                                  type="number"
                                  value={biaForm.rpo}
                                  onChange={(e) => setBiaForm({...biaForm, rpo: e.target.value})}
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="mtpd">MTPD - Período Máximo Tolerable (horas)</Label>
                                <Input
                                  id="mtpd"
                                  type="number"
                                  value={biaForm.mtpd}
                                  onChange={(e) => setBiaForm({...biaForm, mtpd: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="mbco">MBCO - Objetivo Mínimo de Continuidad (%)</Label>
                                <Input
                                  id="mbco"
                                  type="number"
                                  value={biaForm.mbco}
                                  onChange={(e) => setBiaForm({...biaForm, mbco: e.target.value})}
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="financial_1h">Impacto Financiero 1h</Label>
                                <Input
                                  id="financial_1h"
                                  type="number"
                                  step="0.01"
                                  value={biaForm.financial_impact_1h}
                                  onChange={(e) => setBiaForm({...biaForm, financial_impact_1h: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="financial_24h">Impacto Financiero 24h</Label>
                                <Input
                                  id="financial_24h"
                                  type="number"
                                  step="0.01"
                                  value={biaForm.financial_impact_24h}
                                  onChange={(e) => setBiaForm({...biaForm, financial_impact_24h: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="financial_1w">Impacto Financiero 1 semana</Label>
                                <Input
                                  id="financial_1w"
                                  type="number"
                                  step="0.01"
                                  value={biaForm.financial_impact_1w}
                                  onChange={(e) => setBiaForm({...biaForm, financial_impact_1w: e.target.value})}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="operational_impact">Impacto Operacional</Label>
                              <Textarea
                                id="operational_impact"
                                value={biaForm.operational_impact}
                                onChange={(e) => setBiaForm({...biaForm, operational_impact: e.target.value})}
                                rows={3}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="regulatory_impact">Impacto Regulatorio</Label>
                              <Textarea
                                id="regulatory_impact"
                                value={biaForm.regulatory_impact}
                                onChange={(e) => setBiaForm({...biaForm, regulatory_impact: e.target.value})}
                                rows={3}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="reputation_impact">Impacto Reputacional</Label>
                              <Textarea
                                id="reputation_impact"
                                value={biaForm.reputation_impact}
                                onChange={(e) => setBiaForm({...biaForm, reputation_impact: e.target.value})}
                                rows={3}
                              />
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button type="button" variant="outline" onClick={() => setIsBIADialogOpen(false)}>
                                Cancelar
                              </Button>
                              <Button type="submit">
                                Crear Evaluación
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Proceso</TableHead>
                          <TableHead>RTO/RPO</TableHead>
                          <TableHead>MTPD</TableHead>
                          <TableHead>Impacto Financiero 24h</TableHead>
                          <TableHead>Fecha</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assessments.map((assessment) => {
                          const process = processes.find(p => p.id === assessment.process_id);
                          return (
                            <TableRow key={assessment.id}>
                              <TableCell>
                                <div className="font-medium">{process?.name || 'Proceso no encontrado'}</div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>RTO: {assessment.rto}h</div>
                                  <div>RPO: {assessment.rpo}h</div>
                                </div>
                              </TableCell>
                              <TableCell>{assessment.mtpd}h</TableCell>
                              <TableCell>
                                {formatCurrency(assessment.financial_impact_24h)}
                              </TableCell>
                              <TableCell>
                                {new Date(assessment.created_at).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="summary" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Procesos Críticos</CardTitle>
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {processes.filter(p => p.criticality_level === 'critical').length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        de {processes.length} procesos totales
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">RTO Promedio</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {assessments.length > 0 
                          ? Math.round(assessments.reduce((sum, a) => sum + a.rto, 0) / assessments.length)
                          : 0
                        }h
                      </div>
                      <p className="text-xs text-muted-foreground">
                        tiempo de recuperación objetivo
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Impacto Total 24h</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(
                          assessments.reduce((sum, a) => sum + (a.financial_impact_24h || 0), 0)
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        impacto financiero estimado
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribución de Criticidad</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="h-48 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center">
                          <Building2 className="h-12 w-12 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground text-center">
                            Visualización interactiva de dependencias entre procesos
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Crítico</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span>Alto</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                            <span>Bajo</span>
                          </div>
                        </div>

                        <Button className="w-full" variant="outline">
                          <Building2 className="h-4 w-4 mr-2" />
                          Generar Mapa de Dependencias
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Mapa de Dependencias Visual
                      </CardTitle>
                    </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['critical', 'high', 'medium', 'low'].map((level) => {
                        const count = processes.filter(p => p.criticality_level === level).length;
                        const percentage = processes.length > 0 ? (count / processes.length) * 100 : 0;
                        
                        return (
                          <div key={level} className="flex items-center space-x-4">
                            <Badge variant={getCriticalityColor(level)} className="w-20 justify-center">
                              {level}
                            </Badge>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-12 text-right">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                     </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default BusinessImpactAnalysis;
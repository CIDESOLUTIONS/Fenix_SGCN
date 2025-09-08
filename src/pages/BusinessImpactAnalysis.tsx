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

            <Tabs defaultValue="processes" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="processes">Procesos de Negocio</TabsTrigger>
                <TabsTrigger value="assessments">Evaluaciones BIA</TabsTrigger>
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

                <Card>
                  <CardHeader>
                    <CardTitle>Distribución de Criticidad</CardTitle>
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
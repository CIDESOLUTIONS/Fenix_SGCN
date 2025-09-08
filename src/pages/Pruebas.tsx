import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  TestTube, 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  FileText,
  Play,
  Pause,
  RotateCcw,
  Download,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ContinuityTest {
  id: string;
  test_name: string;
  test_type: string;
  test_date: string;
  plan_id?: string;
  participants: string[];
  objectives: string[];
  results?: string;
  findings: string[];
  overall_rating?: number;
  corrective_actions?: any;
  created_at: string;
  updated_at: string;
}

interface ContinuityPlan {
  id: string;
  plan_name: string;
  plan_type: string;
}

interface TestExecutionStep {
  id: string;
  step_number: number;
  step_description: string;
  expected_result?: string;
  actual_result?: string;
  status: 'pending' | 'passed' | 'failed' | 'skipped';
  execution_time?: number;
  notes?: string;
  executed_by?: string;
  executed_at?: string;
}

interface CorrectiveAction {
  id: string;
  action_description: string;
  assigned_to?: string;
  assigned_email?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  completion_date?: string;
  progress_notes?: string;
}

export default function Pruebas() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tests, setTests] = useState<ContinuityTest[]>([]);
  const [plans, setPlans] = useState<ContinuityPlan[]>([]);
  const [selectedTest, setSelectedTest] = useState<ContinuityTest | null>(null);
  const [executionSteps, setExecutionSteps] = useState<TestExecutionStep[]>([]);
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isExecutionDialogOpen, setIsExecutionDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchTests();
    fetchPlans();
  }, [user, navigate]);

  const fetchTests = async () => {
    try {
      const { data, error } = await supabase
        .from("continuity_tests")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTests(data || []);
    } catch (error: any) {
      console.error("Error fetching tests:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las pruebas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("continuity_plans")
        .select("id, plan_name, plan_type")
        .eq("user_id", user?.id);

      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      console.error("Error fetching plans:", error);
    }
  };

  const fetchTestExecutionSteps = async (testId: string) => {
    try {
      const { data, error } = await supabase
        .from("test_execution_steps")
        .select("*")
        .eq("test_id", testId)
        .order("step_number");

      if (error) throw error;
      setExecutionSteps(data?.map(step => ({
        ...step,
        status: step.status as 'pending' | 'passed' | 'failed' | 'skipped'
      })) || []);
    } catch (error: any) {
      console.error("Error fetching execution steps:", error);
    }
  };

  const fetchCorrectiveActions = async (testId: string) => {
    try {
      const { data, error } = await supabase
        .from("corrective_actions")
        .select("*")
        .eq("test_id", testId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCorrectiveActions(data?.map(action => ({
        ...action,
        priority: action.priority as 'low' | 'medium' | 'high' | 'critical',
        status: action.status as 'pending' | 'in_progress' | 'completed' | 'cancelled'
      })) || []);
    } catch (error: any) {
      console.error("Error fetching corrective actions:", error);
    }
  };

  const handleCreateTest = async (formData: FormData) => {
    try {
      const testData = {
        user_id: user?.id,
        test_name: formData.get("test_name") as string,
        test_type: formData.get("test_type") as string,
        test_date: formData.get("test_date") as string,
        plan_id: formData.get("plan_id") as string || null,
        participants: (formData.get("participants") as string).split(",").map(p => p.trim()).filter(Boolean),
        objectives: (formData.get("objectives") as string).split(",").map(o => o.trim()).filter(Boolean),
      };

      const { error } = await supabase
        .from("continuity_tests")
        .insert(testData);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Prueba creada correctamente",
      });
      
      setIsCreateDialogOpen(false);
      fetchTests();
    } catch (error: any) {
      console.error("Error creating test:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la prueba",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (rating?: number) => {
    if (!rating) return <Badge variant="secondary">Sin calificar</Badge>;
    if (rating >= 80) return <Badge className="bg-green-500">Exitosa</Badge>;
    if (rating >= 60) return <Badge variant="outline">Parcial</Badge>;
    return <Badge variant="destructive">Fallida</Badge>;
  };

  const getProgressColor = (rating?: number) => {
    if (!rating) return "bg-gray-300";
    if (rating >= 80) return "bg-green-500";
    if (rating >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const generateTestReport = (test: ContinuityTest) => {
    // Aquí implementarías la generación del informe
    toast({
      title: "Generando informe",
      description: "El informe se descargará en breve",
    });
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <TestTube className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
              <p className="mt-4 text-muted-foreground">Cargando pruebas...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            <h1 className="text-xl font-semibold">Pruebas de Continuidad</h1>
          </div>
        </header>

        <div className="flex-1 space-y-4 p-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Gestión de Pruebas</h2>
              <p className="text-muted-foreground">
                Ejecuta, controla y evalúa las pruebas de continuidad de negocio
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Prueba
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Prueba</DialogTitle>
                  <DialogDescription>
                    Define los parámetros para una nueva prueba de continuidad
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateTest(new FormData(e.currentTarget));
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="test_name">Nombre de la Prueba</Label>
                      <Input id="test_name" name="test_name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="test_type">Tipo de Prueba</Label>
                      <Select name="test_type" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tabletop">Mesa de Trabajo</SelectItem>
                          <SelectItem value="walkthrough">Revisión</SelectItem>
                          <SelectItem value="simulation">Simulación</SelectItem>
                          <SelectItem value="full_interruption">Interrupción Total</SelectItem>
                          <SelectItem value="parallel">Paralela</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="test_date">Fecha de Prueba</Label>
                      <Input id="test_date" name="test_date" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plan_id">Plan Asociado</Label>
                      <Select name="plan_id">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {plans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.plan_name} ({plan.plan_type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participants">Participantes (separados por comas)</Label>
                    <Input id="participants" name="participants" placeholder="Juan Pérez, María González..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="objectives">Objetivos (separados por comas)</Label>
                    <Textarea id="objectives" name="objectives" placeholder="Verificar RTO, Validar comunicaciones..." />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Crear Prueba</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">Lista de Pruebas</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="reports">Informes</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              <div className="grid gap-4">
                {tests.map((test) => (
                  <Card key={test.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {test.test_name}
                            {getStatusBadge(test.overall_rating)}
                          </CardTitle>
                          <CardDescription>
                            Tipo: {test.test_type} • 
                            Fecha: {format(new Date(test.test_date), "d 'de' MMMM, yyyy", { locale: es })}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTest(test);
                              fetchTestExecutionSteps(test.id);
                              fetchCorrectiveActions(test.id);
                              setIsExecutionDialogOpen(true);
                            }}
                          >
                            <Play className="mr-1 h-3 w-3" />
                            Ejecutar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateTestReport(test)}
                          >
                            <Download className="mr-1 h-3 w-3" />
                            Informe
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {test.overall_rating && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Calificación General</span>
                              <span>{test.overall_rating}%</span>
                            </div>
                            <Progress 
                              value={test.overall_rating} 
                              className={`h-2 ${getProgressColor(test.overall_rating)}`}
                            />
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Participantes:</strong>
                            <p className="text-muted-foreground">
                              {test.participants.length > 0 ? test.participants.join(", ") : "No especificados"}
                            </p>
                          </div>
                          <div>
                            <strong>Objetivos:</strong>
                            <p className="text-muted-foreground">
                              {test.objectives.length > 0 ? test.objectives.join(", ") : "No especificados"}
                            </p>
                          </div>
                        </div>

                        {test.findings && test.findings.length > 0 && (
                          <div>
                            <strong className="text-sm">Hallazgos:</strong>
                            <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                              {test.findings.map((finding, index) => (
                                <li key={index}>{finding}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {tests.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <TestTube className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay pruebas registradas</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Comienza creando tu primera prueba de continuidad
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Primera Prueba
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pruebas</CardTitle>
                    <TestTube className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{tests.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Exitosas</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {tests.filter(t => t.overall_rating && t.overall_rating >= 80).length}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Parciales</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {tests.filter(t => t.overall_rating && t.overall_rating >= 60 && t.overall_rating < 80).length}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fallidas</CardTitle>
                    <XCircle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {tests.filter(t => t.overall_rating && t.overall_rating < 60).length}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generación de Informes</CardTitle>
                  <CardDescription>
                    Genera informes detallados de las pruebas realizadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Button variant="outline" className="h-20 flex-col">
                      <FileText className="h-8 w-8 mb-2" />
                      Informe Ejecutivo
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <BarChart3 className="h-8 w-8 mb-2" />
                      Análisis de Tendencias
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <AlertTriangle className="h-8 w-8 mb-2" />
                      Acciones Correctivas
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Calendar className="h-8 w-8 mb-2" />
                      Cronograma de Pruebas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Dialog de Ejecución de Pruebas */}
        <Dialog open={isExecutionDialogOpen} onOpenChange={setIsExecutionDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ejecución de Prueba: {selectedTest?.test_name}</DialogTitle>
              <DialogDescription>
                Controla el flujo de ejecución y registra los resultados
              </DialogDescription>
            </DialogHeader>
            
            {selectedTest && (
              <Tabs defaultValue="execution" className="w-full">
                <TabsList>
                  <TabsTrigger value="execution">Ejecución</TabsTrigger>
                  <TabsTrigger value="corrective">Acciones Correctivas</TabsTrigger>
                  <TabsTrigger value="summary">Resumen</TabsTrigger>
                </TabsList>
                
                <TabsContent value="execution" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold">Pasos de Ejecución</h4>
                      <Button size="sm">
                        <Plus className="mr-1 h-3 w-3" />
                        Agregar Paso
                      </Button>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Paso</TableHead>
                          <TableHead>Descripción</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Tiempo</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {executionSteps.map((step) => (
                          <TableRow key={step.id}>
                            <TableCell>{step.step_number}</TableCell>
                            <TableCell>{step.step_description}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  step.status === 'passed' ? 'default' :
                                  step.status === 'failed' ? 'destructive' :
                                  step.status === 'skipped' ? 'secondary' : 'outline'
                                }
                              >
                                {step.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{step.execution_time || 0} min</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline">
                                  <Play className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="corrective" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold">Acciones Correctivas</h4>
                      <Button size="sm">
                        <Plus className="mr-1 h-3 w-3" />
                        Nueva Acción
                      </Button>
                    </div>
                    
                    <div className="grid gap-4">
                      {correctiveActions.map((action) => (
                        <Card key={action.id}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">{action.action_description}</CardTitle>
                              <Badge 
                                variant={
                                  action.status === 'completed' ? 'default' :
                                  action.status === 'in_progress' ? 'secondary' :
                                  action.status === 'cancelled' ? 'destructive' : 'outline'
                                }
                              >
                                {action.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>Asignado a:</strong> {action.assigned_to || "No asignado"}
                              </div>
                              <div>
                                <strong>Prioridad:</strong> 
                                <Badge 
                                  className="ml-2"
                                  variant={
                                    action.priority === 'critical' ? 'destructive' :
                                    action.priority === 'high' ? 'destructive' :
                                    action.priority === 'medium' ? 'secondary' : 'outline'
                                  }
                                >
                                  {action.priority}
                                </Badge>
                              </div>
                              {action.due_date && (
                                <div>
                                  <strong>Fecha límite:</strong> {format(new Date(action.due_date), "d/M/yyyy")}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="summary" className="space-y-4">
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Resumen de la Prueba</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Calificación General</Label>
                            <Input 
                              type="number" 
                              placeholder="0-100" 
                              min="0" 
                              max="100"
                              defaultValue={selectedTest.overall_rating || ""}
                            />
                          </div>
                          <div>
                            <Label>Estado</Label>
                            <Select defaultValue={selectedTest.overall_rating ? "completed" : "pending"}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="in_progress">En Progreso</SelectItem>
                                <SelectItem value="completed">Completada</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Resultados</Label>
                          <Textarea 
                            placeholder="Descripción de los resultados obtenidos..."
                            defaultValue={selectedTest.results || ""}
                          />
                        </div>
                        <div>
                          <Label>Conclusiones y Recomendaciones</Label>
                          <Textarea 
                            placeholder="Conclusiones principales y recomendaciones..."
                          />
                        </div>
                        <Button className="w-full">
                          Guardar Resumen
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
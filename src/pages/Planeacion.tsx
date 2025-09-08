import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, FileText, Users, Target, Settings, Shield, Clock, AlertCircle, CheckCircle2, Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PlanningPolicy {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  version: string;
  approved_by: string;
  approval_date: string;
  review_date: string;
  created_at: string;
  updated_at: string;
}

interface PlanningObjective {
  id: string;
  title: string;
  description: string;
  priority: string;
  target_date: string;
  responsible: string;
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

interface OrganizationalStructure {
  id: string;
  role_name: string;
  responsibilities: string[];
  authority_level: string;
  assigned_person: string;
  backup_person: string;
  contact_info: string;
  created_at: string;
  updated_at: string;
}

interface BusinessProcess {
  id: string;
  name: string;
  description: string;
  department: string;
  responsible_person: string;
  criticality_level: string;
  dependencies: string[];
  raci_responsible: string;
  raci_accountable: string;
  raci_consulted: string;
  raci_informed: string;
  include_in_continuity: boolean;
  created_at: string;
  updated_at: string;
}

export default function Planeacion() {
  const { user } = useAuth();
  const { language, currency } = useSettings();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  // Estados para las diferentes secciones
  const [policies, setPolicies] = useState<PlanningPolicy[]>([]);
  const [objectives, setObjectives] = useState<PlanningObjective[]>([]);
  const [orgStructure, setOrgStructure] = useState<OrganizationalStructure[]>([]);
  const [businessProcesses, setBusinessProcesses] = useState<BusinessProcess[]>([]);
  
  // Estados para formularios
  const [newPolicy, setNewPolicy] = useState({
    title: "",
    description: "",
    category: "",
    status: "draft",
    version: "1.0",
    approved_by: "",
    approval_date: "",
    review_date: ""
  });
  
  const [newObjective, setNewObjective] = useState({
    title: "",
    description: "",
    priority: "medium",
    target_date: "",
    responsible: "",
    status: "pending",
    progress: 0
  });
  
  const [newRole, setNewRole] = useState({
    role_name: "",
    responsibilities: [""],
    authority_level: "",
    assigned_person: "",
    backup_person: "",
    contact_info: ""
  });

  const [newProcess, setNewProcess] = useState({
    name: "",
    description: "",
    department: "",
    responsible_person: "",
    criticality_level: "medium",
    dependencies: [""],
    raci_responsible: "",
    raci_accountable: "",
    raci_consulted: "",
    raci_informed: "",
    include_in_continuity: false
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"policy" | "objective" | "role" | "process">("policy");

  const translations = {
    es: {
      title: "Módulo de Planeación",
      subtitle: "Planificación Estratégica de Continuidad de Negocio",
      overview: "Resumen",
      policies: "Políticas y Procedimientos",
      objectives: "Objetivos Estratégicos",
      organization: "Estructura Organizacional",
      processes: "Procesos Críticos",
      resources: "Recursos y Presupuesto",
      timeline: "Cronograma",
      addNew: "Agregar Nuevo",
      addPolicy: "Agregar Política",
      addObjective: "Agregar Objetivo",
      addRole: "Agregar Rol",
      addProcess: "Agregar Proceso",
      save: "Guardar",
      cancel: "Cancelar",
      edit: "Editar",
      delete: "Eliminar",
      title_field: "Título",
      description: "Descripción",
      category: "Categoría",
      status: "Estado",
      version: "Versión",
      priority: "Prioridad",
      responsible: "Responsable",
      progress: "Progreso",
      role_name: "Nombre del Rol",
      responsibilities: "Responsabilidades",
      authority_level: "Nivel de Autoridad",
      assigned_person: "Persona Asignada",
      backup_person: "Persona de Respaldo",
      contact_info: "Información de Contacto",
      process_name: "Nombre del Proceso",
      department: "Departamento",
      criticality: "Criticidad",
      dependencies: "Dependencias",
      raci_matrix: "Matriz RACI",
      include_continuity: "Incluir en Continuidad",
      yes: "Sí",
      no: "No",
      critical: "Crítico",
      high: "Alto",
      medium: "Medio",
      low: "Bajo",
      draft: "Borrador",
      active: "Activo",
      pending: "Pendiente",
      approved: "Aprobado",
      completed: "Completado",
      security: "Seguridad",
      operational: "Operacional",
      technical: "Técnico",
      administrative: "Administrativo"
    },
    en: {
      title: "Planning Module",
      subtitle: "Business Continuity Strategic Planning",
      overview: "Overview",
      policies: "Policies and Procedures",
      objectives: "Strategic Objectives",
      organization: "Organizational Structure",
      processes: "Critical Processes",
      resources: "Resources and Budget",
      timeline: "Timeline",
      addNew: "Add New",
      addPolicy: "Add Policy",
      addObjective: "Add Objective",
      addRole: "Add Role",
      addProcess: "Add Process",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      title_field: "Title",
      description: "Description",
      category: "Category",
      status: "Status",
      version: "Version",
      priority: "Priority",
      responsible: "Responsible",
      progress: "Progress",
      role_name: "Role Name",
      responsibilities: "Responsibilities",
      authority_level: "Authority Level",
      assigned_person: "Assigned Person",
      backup_person: "Backup Person",
      contact_info: "Contact Information",
      process_name: "Process Name",
      department: "Department",
      criticality: "Criticality",
      dependencies: "Dependencies",
      raci_matrix: "RACI Matrix",
      include_continuity: "Include in Continuity",
      yes: "Yes",
      no: "No",
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      draft: "Draft",
      active: "Active",
      pending: "Pending",
      approved: "Approved",
      completed: "Completed",
      security: "Security",
      operational: "Operational",
      technical: "Technical",
      administrative: "Administrative"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.es;

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Cargar procesos de negocio desde la base de datos
      const { data: processesData, error: processesError } = await supabase
        .from('business_processes')
        .select('*')
        .eq('user_id', user?.id);

      if (processesError) throw processesError;

      const transformedProcesses = processesData?.map(process => ({
        ...process,
        include_in_continuity: process.criticality_level === 'critical' || process.criticality_level === 'high'
      })) || [];

      setBusinessProcesses(transformedProcesses);
      
      // Datos de ejemplo para otras secciones
      setPolicies([
        {
          id: "1",
          title: "Política de Continuidad de Negocio",
          description: "Política principal que establece los lineamientos generales para la continuidad del negocio",
          category: "security",
          status: "approved",
          version: "2.1",
          approved_by: "Director General",
          approval_date: "2024-01-15",
          review_date: "2024-12-31",
          created_at: "2024-01-01",
          updated_at: "2024-01-15"
        }
      ]);
      
      setObjectives([
        {
          id: "1",
          title: "Implementar SGCN completo",
          description: "Desarrollar e implementar un Sistema de Gestión de Continuidad de Negocio según ISO 22301",
          priority: "high",
          target_date: "2024-12-31",
          responsible: "Equipo de Continuidad",
          status: "pending",
          progress: 35,
          created_at: "2024-01-01",
          updated_at: "2024-03-15"
        }
      ]);
      
      setOrgStructure([
        {
          id: "1",
          role_name: "Coordinador de Continuidad",
          responsibilities: ["Coordinar el programa de continuidad", "Supervisar pruebas", "Reportar a la dirección"],
          authority_level: "medium",
          assigned_person: "Juan Pérez",
          backup_person: "María González",
          contact_info: "juan.perez@empresa.com / +52 55 1234 5678",
          created_at: "2024-01-01",
          updated_at: "2024-01-01"
        }
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Error al cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProcess = async () => {
    try {
      const { data, error } = await supabase
        .from('business_processes')
        .insert([{
          ...newProcess,
          user_id: user?.id,
          dependencies: newProcess.dependencies.filter(dep => dep.trim() !== '')
        }])
        .select()
        .single();

      if (error) throw error;

      const processWithContinuity = {
        ...data,
        include_in_continuity: newProcess.include_in_continuity
      };

      setBusinessProcesses([...businessProcesses, processWithContinuity]);
      setNewProcess({
        name: "",
        description: "",
        department: "",
        responsible_person: "",
        criticality_level: "medium",
        dependencies: [""],
        raci_responsible: "",
        raci_accountable: "",
        raci_consulted: "",
        raci_informed: "",
        include_in_continuity: false
      });
      setIsDialogOpen(false);
      
      toast({
        title: "Éxito",
        description: "Proceso guardado correctamente",
      });
    } catch (error) {
      console.error("Error saving process:", error);
      toast({
        title: "Error",
        description: "Error al guardar el proceso",
        variant: "destructive",
      });
    }
  };

  const handleToggleContinuity = async (processId: string, newValue: boolean) => {
    try {
      setBusinessProcesses(prev => 
        prev.map(process => 
          process.id === processId 
            ? { ...process, include_in_continuity: newValue }
            : process
        )
      );
      
      toast({
        title: "Actualizado",
        description: `Proceso ${newValue ? 'incluido en' : 'excluido de'} continuidad`,
      });
    } catch (error) {
      console.error("Error updating process:", error);
      toast({
        title: "Error",
        description: "Error al actualizar el proceso",
        variant: "destructive",
      });
    }
  };

  const handleSavePolicy = async () => {
    try {
      // Aquí guardaríamos en la base de datos
      const policy: PlanningPolicy = {
        ...newPolicy,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setPolicies([...policies, policy]);
      setNewPolicy({
        title: "",
        description: "",
        category: "",
        status: "draft",
        version: "1.0",
        approved_by: "",
        approval_date: "",
        review_date: ""
      });
      setIsDialogOpen(false);
      
      toast({
        title: "Éxito",
        description: "Política guardada correctamente",
      });
    } catch (error) {
      console.error("Error saving policy:", error);
      toast({
        title: "Error",
        description: "Error al guardar la política",
        variant: "destructive",
      });
    }
  };

  const handleSaveObjective = async () => {
    try {
      const objective: PlanningObjective = {
        ...newObjective,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setObjectives([...objectives, objective]);
      setNewObjective({
        title: "",
        description: "",
        priority: "medium",
        target_date: "",
        responsible: "",
        status: "pending",
        progress: 0
      });
      setIsDialogOpen(false);
      
      toast({
        title: "Éxito",
        description: "Objetivo guardado correctamente",
      });
    } catch (error) {
      console.error("Error saving objective:", error);
      toast({
        title: "Error",
        description: "Error al guardar el objetivo",
        variant: "destructive",
      });
    }
  };

  const handleSaveRole = async () => {
    try {
      const role: OrganizationalStructure = {
        ...newRole,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setOrgStructure([...orgStructure, role]);
      setNewRole({
        role_name: "",
        responsibilities: [""],
        authority_level: "",
        assigned_person: "",
        backup_person: "",
        contact_info: ""
      });
      setIsDialogOpen(false);
      
      toast({
        title: "Éxito",
        description: "Rol guardado correctamente",
      });
    } catch (error) {
      console.error("Error saving role:", error);
      toast({
        title: "Error",
        description: "Error al guardar el rol",
        variant: "destructive",
      });
    }
  };

  const openDialog = (type: "policy" | "objective" | "role" | "process") => {
    setDialogType(type);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "outline",
      pending: "secondary",
      active: "default",
      approved: "default",
      completed: "default"
    };
    return <Badge variant={variants[status] || "outline"}>{t[status as keyof typeof t] || status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    };
    return (
      <Badge className={colors[priority] || "bg-gray-100 text-gray-800"}>
        {t[priority as keyof typeof t] || priority}
      </Badge>
    );
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <AppHeader />
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Cargando...</p>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

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
                  <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
                  <p className="text-muted-foreground">{t.subtitle}</p>
                </div>
              </div>

              {/* Tabs Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {t.overview}
                  </TabsTrigger>
                  <TabsTrigger value="policies" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {t.policies}
                  </TabsTrigger>
                  <TabsTrigger value="objectives" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {t.objectives}
                  </TabsTrigger>
                  <TabsTrigger value="organization" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t.organization}
                  </TabsTrigger>
                  <TabsTrigger value="processes" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {t.processes}
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {t.resources}
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t.timeline}
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Políticas Activas</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{policies.filter(p => p.status === 'active').length}</div>
                        <p className="text-xs text-muted-foreground">de {policies.length} totales</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Objetivos Pendientes</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{objectives.filter(o => o.status === 'pending').length}</div>
                        <p className="text-xs text-muted-foreground">de {objectives.length} totales</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Roles Definidos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{orgStructure.length}</div>
                        <p className="text-xs text-muted-foreground">roles configurados</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {objectives.length > 0 
                            ? Math.round(objectives.reduce((acc, obj) => acc + obj.progress, 0) / objectives.length)
                            : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">completado</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Actividades Recientes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Política actualizada</p>
                              <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Nuevo objetivo creado</p>
                              <p className="text-xs text-muted-foreground">Hace 1 día</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Rol asignado</p>
                              <p className="text-xs text-muted-foreground">Hace 3 días</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Próximas Fechas Importantes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-red-500" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Revisión de políticas</p>
                              <p className="text-xs text-muted-foreground">31 de diciembre, 2024</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-orange-500" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Objetivo: SGCN completo</p>
                              <p className="text-xs text-muted-foreground">31 de diciembre, 2024</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Policies Tab */}
                <TabsContent value="policies" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{t.policies}</h2>
                    <Button onClick={() => openDialog("policy")}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t.addPolicy}
                    </Button>
                  </div>

                  <div className="grid gap-6">
                    {policies.map((policy) => (
                      <Card key={policy.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{policy.title}</CardTitle>
                              <CardDescription>{policy.description}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(policy.status)}
                              <Badge variant="outline">v{policy.version}</Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Categoría:</span>
                              <p className="text-muted-foreground">{t[policy.category as keyof typeof t] || policy.category}</p>
                            </div>
                            <div>
                              <span className="font-medium">Aprobado por:</span>
                              <p className="text-muted-foreground">{policy.approved_by}</p>
                            </div>
                            <div>
                              <span className="font-medium">Fecha de aprobación:</span>
                              <p className="text-muted-foreground">{policy.approval_date}</p>
                            </div>
                            <div>
                              <span className="font-medium">Próxima revisión:</span>
                              <p className="text-muted-foreground">{policy.review_date}</p>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              {t.edit}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t.delete}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Objectives Tab */}
                <TabsContent value="objectives" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{t.objectives}</h2>
                    <Button onClick={() => openDialog("objective")}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t.addObjective}
                    </Button>
                  </div>

                  <div className="grid gap-6">
                    {objectives.map((objective) => (
                      <Card key={objective.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{objective.title}</CardTitle>
                              <CardDescription>{objective.description}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              {getPriorityBadge(objective.priority)}
                              {getStatusBadge(objective.status)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Responsable:</span>
                                <p className="text-muted-foreground">{objective.responsible}</p>
                              </div>
                              <div>
                                <span className="font-medium">Fecha objetivo:</span>
                                <p className="text-muted-foreground">{objective.target_date}</p>
                              </div>
                              <div>
                                <span className="font-medium">Progreso:</span>
                                <p className="text-muted-foreground">{objective.progress}%</p>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progreso</span>
                                <span>{objective.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${objective.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                {t.edit}
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t.delete}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Organization Tab */}
                <TabsContent value="organization" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{t.organization}</h2>
                    <Button onClick={() => openDialog("role")}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t.addRole}
                    </Button>
                  </div>

                  <div className="grid gap-6">
                    {orgStructure.map((role) => (
                      <Card key={role.id}>
                        <CardHeader>
                          <CardTitle>{role.role_name}</CardTitle>
                          <CardDescription>Nivel de autoridad: {role.authority_level}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <span className="font-medium">Responsabilidades:</span>
                              <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                                {role.responsibilities.map((resp, index) => (
                                  <li key={index}>{resp}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Persona asignada:</span>
                                <p className="text-muted-foreground">{role.assigned_person}</p>
                              </div>
                              <div>
                                <span className="font-medium">Persona de respaldo:</span>
                                <p className="text-muted-foreground">{role.backup_person}</p>
                              </div>
                              <div>
                                <span className="font-medium">Contacto:</span>
                                <p className="text-muted-foreground">{role.contact_info}</p>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                {t.edit}
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t.delete}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Critical Processes Tab */}
                <TabsContent value="processes" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{t.processes}</h2>
                    <Button onClick={() => openDialog("process")}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t.addProcess}
                    </Button>
                  </div>

                  <div className="grid gap-6">
                    {businessProcesses.map((process) => (
                      <Card key={process.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{process.name}</CardTitle>
                              <CardDescription>{process.description}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              {getPriorityBadge(process.criticality_level)}
                              <Badge variant={process.include_in_continuity ? "default" : "outline"}>
                                {process.include_in_continuity ? t.yes : t.no}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium">{t.department}:</span>
                                <p className="text-muted-foreground">{process.department}</p>
                              </div>
                              <div>
                                <span className="font-medium">{t.responsible}:</span>
                                <p className="text-muted-foreground">{process.responsible_person}</p>
                              </div>
                              <div>
                                <span className="font-medium">{t.criticality}:</span>
                                <p className="text-muted-foreground">{t[process.criticality_level as keyof typeof t] || process.criticality_level}</p>
                              </div>
                            </div>
                            
                            {process.dependencies && process.dependencies.length > 0 && (
                              <div>
                                <span className="font-medium">{t.dependencies}:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {process.dependencies.map((dep, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {dep}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="border-t pt-4">
                              <span className="font-medium mb-2 block">{t.raci_matrix}:</span>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-blue-600">R:</span>
                                  <p className="text-muted-foreground">{process.raci_responsible}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-green-600">A:</span>
                                  <p className="text-muted-foreground">{process.raci_accountable}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-yellow-600">C:</span>
                                  <p className="text-muted-foreground">{process.raci_consulted}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-purple-600">I:</span>
                                  <p className="text-muted-foreground">{process.raci_informed}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t">
                              <div className="flex items-center gap-3">
                                <Label htmlFor={`continuity-${process.id}`} className="text-sm font-medium">
                                  {t.include_continuity}
                                </Label>
                                <Button
                                  variant={process.include_in_continuity ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleToggleContinuity(process.id, !process.include_in_continuity)}
                                >
                                  {process.include_in_continuity ? t.yes : t.no}
                                </Button>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4 mr-2" />
                                  {t.edit}
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {t.delete}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Resources Tab */}
                <TabsContent value="resources" className="space-y-6">
                  <h2 className="text-2xl font-bold">{t.resources}</h2>
                  <Card>
                    <CardHeader>
                      <CardTitle>Recursos y Presupuesto</CardTitle>
                      <CardDescription>Planificación de recursos necesarios para la continuidad del negocio</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Esta sección estará disponible próximamente.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Timeline Tab */}
                <TabsContent value="timeline" className="space-y-6">
                  <h2 className="text-2xl font-bold">{t.timeline}</h2>
                  <Card>
                    <CardHeader>
                      <CardTitle>Cronograma de Implementación</CardTitle>
                      <CardDescription>Timeline de actividades y hitos del proyecto</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Esta sección estará disponible próximamente.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Dialog for Adding New Items */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {dialogType === "policy" && t.addPolicy}
                      {dialogType === "objective" && t.addObjective}
                      {dialogType === "role" && t.addRole}
                      {dialogType === "process" && t.addProcess}
                    </DialogTitle>
                  </DialogHeader>

                  {dialogType === "policy" && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">{t.title_field}</Label>
                        <Input
                          id="title"
                          value={newPolicy.title}
                          onChange={(e) => setNewPolicy({...newPolicy, title: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">{t.description}</Label>
                        <Textarea
                          id="description"
                          value={newPolicy.description}
                          onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">{t.category}</Label>
                        <Select value={newPolicy.category} onValueChange={(value) => setNewPolicy({...newPolicy, category: value})}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="security">{t.security}</SelectItem>
                            <SelectItem value="operational">{t.operational}</SelectItem>
                            <SelectItem value="technical">{t.technical}</SelectItem>
                            <SelectItem value="administrative">{t.administrative}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {dialogType === "objective" && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">{t.title_field}</Label>
                        <Input
                          id="title"
                          value={newObjective.title}
                          onChange={(e) => setNewObjective({...newObjective, title: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">{t.description}</Label>
                        <Textarea
                          id="description"
                          value={newObjective.description}
                          onChange={(e) => setNewObjective({...newObjective, description: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="priority" className="text-right">{t.priority}</Label>
                        <Select value={newObjective.priority} onValueChange={(value) => setNewObjective({...newObjective, priority: value})}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccionar prioridad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">{t.high}</SelectItem>
                            <SelectItem value="medium">{t.medium}</SelectItem>
                            <SelectItem value="low">{t.low}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="responsible" className="text-right">{t.responsible}</Label>
                        <Input
                          id="responsible"
                          value={newObjective.responsible}
                          onChange={(e) => setNewObjective({...newObjective, responsible: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                  )}

                  {dialogType === "role" && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role_name" className="text-right">{t.role_name}</Label>
                        <Input
                          id="role_name"
                          value={newRole.role_name}
                          onChange={(e) => setNewRole({...newRole, role_name: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="assigned_person" className="text-right">{t.assigned_person}</Label>
                        <Input
                          id="assigned_person"
                          value={newRole.assigned_person}
                          onChange={(e) => setNewRole({...newRole, assigned_person: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="backup_person" className="text-right">{t.backup_person}</Label>
                        <Input
                          id="backup_person"
                          value={newRole.backup_person}
                          onChange={(e) => setNewRole({...newRole, backup_person: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                  )}

                  {dialogType === "process" && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="process_name" className="text-right">{t.process_name}</Label>
                        <Input
                          id="process_name"
                          value={newProcess.name}
                          onChange={(e) => setNewProcess({...newProcess, name: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="process_description" className="text-right">{t.description}</Label>
                        <Textarea
                          id="process_description"
                          value={newProcess.description}
                          onChange={(e) => setNewProcess({...newProcess, description: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="department" className="text-right">{t.department}</Label>
                        <Input
                          id="department"
                          value={newProcess.department}
                          onChange={(e) => setNewProcess({...newProcess, department: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="responsible" className="text-right">{t.responsible}</Label>
                        <Input
                          id="responsible"
                          value={newProcess.responsible_person}
                          onChange={(e) => setNewProcess({...newProcess, responsible_person: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="criticality" className="text-right">{t.criticality}</Label>
                        <Select value={newProcess.criticality_level} onValueChange={(value) => setNewProcess({...newProcess, criticality_level: value})}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccionar criticidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="critical">{t.critical}</SelectItem>
                            <SelectItem value="high">{t.high}</SelectItem>
                            <SelectItem value="medium">{t.medium}</SelectItem>
                            <SelectItem value="low">{t.low}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="raci_responsible" className="text-right">RACI - R</Label>
                        <Input
                          id="raci_responsible"
                          value={newProcess.raci_responsible}
                          onChange={(e) => setNewProcess({...newProcess, raci_responsible: e.target.value})}
                          className="col-span-3"
                          placeholder="Responsable de ejecutar"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="raci_accountable" className="text-right">RACI - A</Label>
                        <Input
                          id="raci_accountable"
                          value={newProcess.raci_accountable}
                          onChange={(e) => setNewProcess({...newProcess, raci_accountable: e.target.value})}
                          className="col-span-3"
                          placeholder="Responsable del resultado"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="raci_consulted" className="text-right">RACI - C</Label>
                        <Input
                          id="raci_consulted"
                          value={newProcess.raci_consulted}
                          onChange={(e) => setNewProcess({...newProcess, raci_consulted: e.target.value})}
                          className="col-span-3"
                          placeholder="Consultado"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="raci_informed" className="text-right">RACI - I</Label>
                        <Input
                          id="raci_informed"
                          value={newProcess.raci_informed}
                          onChange={(e) => setNewProcess({...newProcess, raci_informed: e.target.value})}
                          className="col-span-3"
                          placeholder="Informado"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="include_continuity" className="text-right">{t.include_continuity}</Label>
                        <div className="col-span-3 flex items-center gap-2">
                          <Button
                            type="button"
                            variant={newProcess.include_in_continuity ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNewProcess({...newProcess, include_in_continuity: !newProcess.include_in_continuity})}
                          >
                            {newProcess.include_in_continuity ? t.yes : t.no}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      {t.cancel}
                    </Button>
                    <Button onClick={
                      dialogType === "policy" ? handleSavePolicy :
                      dialogType === "objective" ? handleSaveObjective :
                      dialogType === "role" ? handleSaveRole :
                      handleSaveProcess
                    }>
                      {t.save}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
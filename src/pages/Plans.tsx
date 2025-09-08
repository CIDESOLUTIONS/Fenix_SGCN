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
import { FileText, Upload, Download, Eye, Edit, Trash2, Plus, Calendar, User, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ContinuityPlan {
  id: string;
  plan_name: string;
  description?: string;
  plan_type?: string;
  status?: string;
  version?: string;
  scope?: string;
  objectives?: string[];
  activation_criteria?: string;
  key_personnel?: string[];
  procedures?: any;
  resources?: any;
  communication_plan?: string;
  testing_schedule?: string;
  last_tested?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function Plans() {
  const { user } = useAuth();
  const { language } = useSettings();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Estados principales
  const [plans, setPlans] = useState<ContinuityPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ContinuityPlan | null>(null);

  // Estados de formularios
  const [newPlan, setNewPlan] = useState({
    plan_name: "",
    description: "",
    plan_type: "Plan de Manejo de Crisis",
    status: "draft",
    version: "1.0",
    scope: "",
    objectives: [""],
    activation_criteria: "",
    key_personnel: [""],
    communication_plan: "",
    testing_schedule: ""
  });

  // Estados de UI
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"plan" | "edit" | "view">("plan");
  const [editingPlan, setEditingPlan] = useState<ContinuityPlan | null>(null);

  const translations = {
    es: {
      title: "Gestión de Planes",
      subtitle: "Sistema de Gestión de Planes de Continuidad de Negocio",
      plans: "Planes de Continuidad",
      newPlan: "Nuevo Plan",
      planName: "Nombre del Plan",
      description: "Descripción",
      planType: "Tipo de Plan",
      status: "Estado",
      version: "Versión",
      scope: "Alcance",
      objectives: "Objetivos",
      activationCriteria: "Criterios de Activación",
      keyPersonnel: "Personal Clave",
      communicationPlan: "Plan de Comunicación",
      testingSchedule: "Cronograma de Pruebas",
      procedures: "Procedimientos",
      resources: "Recursos",
      save: "Guardar",
      cancel: "Cancelar",
      edit: "Editar",
      delete: "Eliminar",
      view: "Ver Detalles",
      crisisManagement: "Plan de Manejo de Crisis",
      businessContinuity: "Plan de Continuidad de Negocio",
      disasterRecovery: "Plan de Recuperación ante Desastres",
      emergencyResponse: "Plan de Respuesta a Emergencias",
      draft: "Borrador",
      active: "Activo",
      approved: "Aprobado",
      underReview: "En Revisión",
      archived: "Archivado",
      lastTested: "Última Prueba",
      addObjective: "Agregar Objetivo",
      addPersonnel: "Agregar Personal",
      removeObjective: "Remover",
      removePersonnel: "Remover"
    },
    en: {
      title: "Plans Management",
      subtitle: "Business Continuity Plans Management System",
      plans: "Continuity Plans",
      newPlan: "New Plan",
      planName: "Plan Name",
      description: "Description",
      planType: "Plan Type",
      status: "Status",
      version: "Version",
      scope: "Scope",
      objectives: "Objectives",
      activationCriteria: "Activation Criteria",
      keyPersonnel: "Key Personnel",
      communicationPlan: "Communication Plan",
      testingSchedule: "Testing Schedule",
      procedures: "Procedures",
      resources: "Resources",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      view: "View Details",
      crisisManagement: "Crisis Management Plan",
      businessContinuity: "Business Continuity Plan",
      disasterRecovery: "Disaster Recovery Plan",
      emergencyResponse: "Emergency Response Plan",
      draft: "Draft",
      active: "Active",
      approved: "Approved",
      underReview: "Under Review",
      archived: "Archived",
      lastTested: "Last Tested",
      addObjective: "Add Objective",
      addPersonnel: "Add Personnel",
      removeObjective: "Remove",
      removePersonnel: "Remove"
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
      const { data: plansData, error: plansError } = await supabase
        .from('continuity_plans')
        .select('*')
        .eq('user_id', user?.id);

      if (plansError) throw plansError;
      setPlans(plansData || []);

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

  const handleSavePlan = async () => {
    try {
      const planData = {
        ...newPlan,
        user_id: user?.id,
        objectives: newPlan.objectives.filter(obj => obj.trim() !== ''),
        key_personnel: newPlan.key_personnel.filter(person => person.trim() !== ''),
      };

      const { data, error } = await supabase
        .from('continuity_plans')
        .insert([planData])
        .select()
        .single();

      if (error) throw error;

      setPlans([...plans, data]);
      resetPlanForm();
      setIsDialogOpen(false);

      toast({
        title: "Éxito",
        description: "Plan guardado correctamente",
      });
    } catch (error) {
      console.error("Error saving plan:", error);
      toast({
        title: "Error",
        description: "Error al guardar el plan",
        variant: "destructive",
      });
    }
  };

  const handleEditPlan = async () => {
    if (!editingPlan) return;

    try {
      const { error } = await supabase
        .from('continuity_plans')
        .update(newPlan)
        .eq('id', editingPlan.id);

      if (error) throw error;

      setPlans(plans.map(plan => 
        plan.id === editingPlan.id 
          ? { ...editingPlan, ...newPlan }
          : plan
      ));

      setIsDialogOpen(false);
      setEditingPlan(null);

      toast({
        title: "Éxito",
        description: "Plan actualizado correctamente",
      });
    } catch (error) {
      console.error("Error updating plan:", error);
      toast({
        title: "Error",
        description: "Error al actualizar el plan",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      const { error } = await supabase
        .from('continuity_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      setPlans(plans.filter(plan => plan.id !== planId));

      toast({
        title: "Éxito",
        description: "Plan eliminado correctamente",
      });
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast({
        title: "Error",
        description: "Error al eliminar el plan",
        variant: "destructive",
      });
    }
  };

  const resetPlanForm = () => {
    setNewPlan({
      plan_name: "",
      description: "",
      plan_type: "Plan de Manejo de Crisis",
      status: "draft",
      version: "1.0",
      scope: "",
      objectives: [""],
      activation_criteria: "",
      key_personnel: [""],
      communication_plan: "",
      testing_schedule: ""
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      draft: "bg-gray-100 text-gray-800",
      active: "bg-green-100 text-green-800",
      approved: "bg-blue-100 text-blue-800",
      underReview: "bg-yellow-100 text-yellow-800",
      archived: "bg-red-100 text-red-800"
    };
    return statusColors[status as keyof typeof statusColors] || statusColors.draft;
  };

  const getTypeIcon = (type: string) => {
    if (type?.includes("Crisis")) return <AlertTriangle className="h-4 w-4" />;
    if (type?.includes("Continuidad")) return <Shield className="h-4 w-4" />;
    if (type?.includes("Recuperación")) return <FileText className="h-4 w-4" />;
    if (type?.includes("Emergencia")) return <CheckCircle className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const openDialog = (type: "plan" | "edit" | "view", plan?: ContinuityPlan) => {
    setDialogType(type);
    if (plan && type === "edit") {
      setEditingPlan(plan);
      setNewPlan({
        plan_name: plan.plan_name,
        description: plan.description || "",
        plan_type: plan.plan_type || "Plan de Manejo de Crisis",
        status: plan.status || "draft",
        version: plan.version || "1.0",
        scope: plan.scope || "",
        objectives: plan.objectives || [""],
        activation_criteria: plan.activation_criteria || "",
        key_personnel: plan.key_personnel || [""],
        communication_plan: plan.communication_plan || "",
        testing_schedule: plan.testing_schedule || ""
      });
    } else if (plan && type === "view") {
      setSelectedPlan(plan);
    } else {
      resetPlanForm();
    }
    setIsDialogOpen(true);
  };

  const addArrayField = (field: "objectives" | "key_personnel") => {
    setNewPlan(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const updateArrayField = (field: "objectives" | "key_personnel", index: number, value: string) => {
    setNewPlan(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayField = (field: "objectives" | "key_personnel", index: number) => {
    setNewPlan(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Cargando...</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{t.title}</h2>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>
            <Button onClick={() => openDialog("plan")}>
              <Plus className="mr-2 h-4 w-4" />
              {t.newPlan}
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {plans.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center h-64">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No hay planes creados</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Comienza creando tu primer Plan de Manejo de Crisis para establecer las bases de tu Sistema de Gestión de Continuidad de Negocio.
                    </p>
                    <Button onClick={() => openDialog("plan")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Primer Plan
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                {plans.map((plan) => (
                  <Card key={plan.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(plan.plan_type || "")}
                          {plan.plan_name}
                        </div>
                      </CardTitle>
                      <Badge className={getStatusBadge(plan.status || "draft")}>
                        {plan.status || "draft"}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground mb-2">
                        {plan.plan_type}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {plan.description || "Sin descripción"}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>v{plan.version || "1.0"}</span>
                        {plan.last_tested && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(plan.last_tested).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openDialog("view", plan)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openDialog("edit", plan)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeletePlan(plan.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Editor Visual Drag & Drop
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground text-center">
                        Constructor visual de planes con elementos arrastrables
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <Plus className="h-3 w-3 mr-1" />
                        Procedimiento
                      </Button>
                      <Button variant="outline" size="sm">
                        <User className="h-3 w-3 mr-1" />
                        Responsable
                      </Button>
                      <Button variant="outline" size="sm">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Activador
                      </Button>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verificación
                      </Button>
                    </div>

                    <Button className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Abrir Editor Visual
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Dialog para crear/editar/ver */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {dialogType === "plan" && t.newPlan}
                  {dialogType === "edit" && "Editar Plan"}
                  {dialogType === "view" && "Detalles del Plan"}
                </DialogTitle>
              </DialogHeader>

              {(dialogType === "plan" || dialogType === "edit") && (
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="plan-name" className="text-right">{t.planName}</Label>
                    <Input
                      id="plan-name"
                      value={newPlan.plan_name}
                      onChange={(e) => setNewPlan({ ...newPlan, plan_name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="plan-type" className="text-right">{t.planType}</Label>
                    <Select value={newPlan.plan_type} onValueChange={(value) => setNewPlan({ ...newPlan, plan_type: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Plan de Manejo de Crisis">{t.crisisManagement}</SelectItem>
                        <SelectItem value="Plan de Continuidad de Negocio">{t.businessContinuity}</SelectItem>
                        <SelectItem value="Plan de Recuperación ante Desastres">{t.disasterRecovery}</SelectItem>
                        <SelectItem value="Plan de Respuesta a Emergencias">{t.emergencyResponse}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="plan-description" className="text-right">{t.description}</Label>
                    <Textarea
                      id="plan-description"
                      value={newPlan.description}
                      onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="plan-scope" className="text-right">{t.scope}</Label>
                    <Textarea
                      id="plan-scope"
                      value={newPlan.scope}
                      onChange={(e) => setNewPlan({ ...newPlan, scope: e.target.value })}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right mt-2">{t.objectives}</Label>
                    <div className="col-span-3 space-y-2">
                      {newPlan.objectives.map((objective, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={objective}
                            onChange={(e) => updateArrayField("objectives", index, e.target.value)}
                            placeholder={`Objetivo ${index + 1}`}
                            className="flex-1"
                          />
                          {newPlan.objectives.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayField("objectives", index)}
                            >
                              {t.removeObjective}
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayField("objectives")}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        {t.addObjective}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="activation-criteria" className="text-right">{t.activationCriteria}</Label>
                    <Textarea
                      id="activation-criteria"
                      value={newPlan.activation_criteria}
                      onChange={(e) => setNewPlan({ ...newPlan, activation_criteria: e.target.value })}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right mt-2">{t.keyPersonnel}</Label>
                    <div className="col-span-3 space-y-2">
                      {newPlan.key_personnel.map((person, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={person}
                            onChange={(e) => updateArrayField("key_personnel", index, e.target.value)}
                            placeholder={`Persona ${index + 1}`}
                            className="flex-1"
                          />
                          {newPlan.key_personnel.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayField("key_personnel", index)}
                            >
                              {t.removePersonnel}
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayField("key_personnel")}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        {t.addPersonnel}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="communication-plan" className="text-right">{t.communicationPlan}</Label>
                    <Textarea
                      id="communication-plan"
                      value={newPlan.communication_plan}
                      onChange={(e) => setNewPlan({ ...newPlan, communication_plan: e.target.value })}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="testing-schedule" className="text-right">{t.testingSchedule}</Label>
                    <Textarea
                      id="testing-schedule"
                      value={newPlan.testing_schedule}
                      onChange={(e) => setNewPlan({ ...newPlan, testing_schedule: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
              )}

              {dialogType === "view" && selectedPlan && (
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t.planName}</Label>
                      <p className="mt-1">{selectedPlan.plan_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t.planType}</Label>
                      <p className="mt-1">{selectedPlan.plan_type}</p>
                    </div>
                  </div>

                  {selectedPlan.description && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t.description}</Label>
                      <p className="mt-1">{selectedPlan.description}</p>
                    </div>
                  )}

                  {selectedPlan.scope && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t.scope}</Label>
                      <p className="mt-1">{selectedPlan.scope}</p>
                    </div>
                  )}

                  {selectedPlan.objectives && selectedPlan.objectives.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t.objectives}</Label>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        {selectedPlan.objectives.map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedPlan.activation_criteria && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t.activationCriteria}</Label>
                      <p className="mt-1">{selectedPlan.activation_criteria}</p>
                    </div>
                  )}

                  {selectedPlan.key_personnel && selectedPlan.key_personnel.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t.keyPersonnel}</Label>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        {selectedPlan.key_personnel.map((person, index) => (
                          <li key={index}>{person}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedPlan.communication_plan && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t.communicationPlan}</Label>
                      <p className="mt-1">{selectedPlan.communication_plan}</p>
                    </div>
                  )}

                  {selectedPlan.testing_schedule && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t.testingSchedule}</Label>
                      <p className="mt-1">{selectedPlan.testing_schedule}</p>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t.cancel}
                </Button>
                {(dialogType === "plan" || dialogType === "edit") && (
                  <Button 
                    onClick={dialogType === "plan" ? handleSavePlan : handleEditPlan}
                  >
                    {t.save}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
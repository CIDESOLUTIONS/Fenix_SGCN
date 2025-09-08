import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { AppSidebar } from '@/components/AppSidebar';
import AppHeader from '@/components/AppHeader';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Filter, Clock, DollarSign, Target, AlertTriangle } from 'lucide-react';

interface ContinuityStrategy {
  id: string;
  name: string;
  description: string;
  strategy_type: string;
  applicable_risks: string[];
  resources_required: string;
  implementation_timeline: number;
  estimated_cost: number;
  process_id?: string;
  created_at: string;
  updated_at: string;
}

interface BusinessProcess {
  id: string;
  name: string;
}

const ContinuityStrategies = () => {
  const { user } = useAuth();
  const { language } = useSettings();
  const { toast } = useToast();

  const [strategies, setStrategies] = useState<ContinuityStrategy[]>([]);
  const [processes, setProcesses] = useState<BusinessProcess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<ContinuityStrategy | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    strategy_type: '',
    applicable_risks: '',
    resources_required: '',
    implementation_timeline: '',
    estimated_cost: '',
    process_id: ''
  });

  const translations = {
    en: {
      title: "Continuity Strategies",
      subtitle: "Manage business continuity strategies and response plans",
      newStrategy: "New Strategy",
      search: "Search strategies...",
      filter: "Filter by type",
      all: "All Types",
      preventive: "Preventive",
      detective: "Detective",
      corrective: "Corrective",
      recovery: "Recovery",
      alternative: "Alternative",
      name: "Strategy Name",
      description: "Description",
      type: "Strategy Type",
      applicableRisks: "Applicable Risks",
      resourcesRequired: "Resources Required", 
      implementationTimeline: "Implementation Timeline (days)",
      estimatedCost: "Estimated Cost",
      process: "Related Process",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this strategy?",
      deleteDescription: "This action cannot be undone.",
      overview: "Overview",
      strategies: "Strategies",
      details: "Details",
      noStrategies: "No strategies found",
      createFirst: "Create your first continuity strategy",
      days: "days",
      timeline: "Timeline",
      cost: "Cost",
      risks: "Risks"
    },
    es: {
      title: "Estrategias de Continuidad",
      subtitle: "Gestionar estrategias de continuidad del negocio y planes de respuesta",
      newStrategy: "Nueva Estrategia",
      search: "Buscar estrategias...",
      filter: "Filtrar por tipo",
      all: "Todos los Tipos",
      preventive: "Preventiva",
      detective: "Detectiva",
      corrective: "Correctiva",
      recovery: "Recuperación",
      alternative: "Alternativa",
      name: "Nombre de la Estrategia",
      description: "Descripción",
      type: "Tipo de Estrategia",
      applicableRisks: "Riesgos Aplicables",
      resourcesRequired: "Recursos Requeridos",
      implementationTimeline: "Cronograma de Implementación (días)",
      estimatedCost: "Costo Estimado",
      process: "Proceso Relacionado",
      save: "Guardar",
      cancel: "Cancelar",
      edit: "Editar",
      delete: "Eliminar",
      confirmDelete: "¿Está seguro de que desea eliminar esta estrategia?",
      deleteDescription: "Esta acción no se puede deshacer.",
      overview: "Vista General",
      strategies: "Estrategias",
      details: "Detalles",
      noStrategies: "No se encontraron estrategias",
      createFirst: "Crea tu primera estrategia de continuidad",
      days: "días",
      timeline: "Cronograma",
      cost: "Costo",
      risks: "Riesgos"
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [strategiesResult, processesResult] = await Promise.all([
        supabase
          .from('continuity_strategies')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('business_processes')
          .select('id, name')
          .eq('user_id', user.id)
      ]);

      if (strategiesResult.error) throw strategiesResult.error;
      if (processesResult.error) throw processesResult.error;

      setStrategies(strategiesResult.data || []);
      setProcesses(processesResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      strategy_type: '',
      applicable_risks: '',
      resources_required: '',
      implementation_timeline: '',
      estimated_cost: '',
      process_id: ''
    });
    setEditingStrategy(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Strategy name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const strategyData = {
        name: formData.name,
        description: formData.description || null,
        strategy_type: formData.strategy_type || null,
        applicable_risks: formData.applicable_risks ? formData.applicable_risks.split(',').map(r => r.trim()) : [],
        resources_required: formData.resources_required || null,
        implementation_timeline: formData.implementation_timeline ? parseInt(formData.implementation_timeline) : null,
        estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : null,
        process_id: formData.process_id || null,
        user_id: user.id
      };

      if (editingStrategy) {
        const { error } = await supabase
          .from('continuity_strategies')
          .update(strategyData)
          .eq('id', editingStrategy.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Strategy updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('continuity_strategies')
          .insert([strategyData]);

        if (error) throw error;

        toast({
          title: "Success", 
          description: "Strategy created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving strategy:', error);
      toast({
        title: "Error",
        description: "Failed to save strategy",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (strategy: ContinuityStrategy) => {
    setEditingStrategy(strategy);
    setFormData({
      name: strategy.name,
      description: strategy.description || '',
      strategy_type: strategy.strategy_type || '',
      applicable_risks: strategy.applicable_risks?.join(', ') || '',
      resources_required: strategy.resources_required || '',
      implementation_timeline: strategy.implementation_timeline?.toString() || '',
      estimated_cost: strategy.estimated_cost?.toString() || '',
      process_id: strategy.process_id || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('continuity_strategies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Strategy deleted successfully",
      });

      loadData();
    } catch (error) {
      console.error('Error deleting strategy:', error);
      toast({
        title: "Error",
        description: "Failed to delete strategy",
        variant: "destructive",
      });
    }
  };

  const filteredStrategies = strategies.filter(strategy => {
    const matchesSearch = strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strategy.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || strategy.strategy_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    const colors = {
      preventive: 'bg-blue-100 text-blue-800',
      detective: 'bg-yellow-100 text-yellow-800',
      corrective: 'bg-orange-100 text-orange-800',
      recovery: 'bg-green-100 text-green-800',
      alternative: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getProcessName = (processId: string) => {
    const process = processes.find(p => p.id === processId);
    return process?.name || 'N/A';
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <AppHeader />
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading...</div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <AppHeader />
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">{t.title}</h2>
                <p className="text-muted-foreground">{t.subtitle}</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t.newStrategy}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingStrategy ? t.edit : t.newStrategy}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t.name} *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={t.name}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="strategy_type">{t.type}</Label>
                        <Select value={formData.strategy_type} onValueChange={(value) => setFormData({ ...formData, strategy_type: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder={t.type} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="preventive">{t.preventive}</SelectItem>
                            <SelectItem value="detective">{t.detective}</SelectItem>
                            <SelectItem value="corrective">{t.corrective}</SelectItem>
                            <SelectItem value="recovery">{t.recovery}</SelectItem>
                            <SelectItem value="alternative">{t.alternative}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">{t.description}</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder={t.description}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="applicable_risks">{t.applicableRisks}</Label>
                      <Textarea
                        id="applicable_risks"
                        value={formData.applicable_risks}
                        onChange={(e) => setFormData({ ...formData, applicable_risks: e.target.value })}
                        placeholder="Risk 1, Risk 2, Risk 3..."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resources_required">{t.resourcesRequired}</Label>
                      <Textarea
                        id="resources_required"
                        value={formData.resources_required}
                        onChange={(e) => setFormData({ ...formData, resources_required: e.target.value })}
                        placeholder={t.resourcesRequired}
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="implementation_timeline">{t.implementationTimeline}</Label>
                        <Input
                          id="implementation_timeline"
                          type="number"
                          value={formData.implementation_timeline}
                          onChange={(e) => setFormData({ ...formData, implementation_timeline: e.target.value })}
                          placeholder="30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estimated_cost">{t.estimatedCost}</Label>
                        <Input
                          id="estimated_cost"
                          type="number"
                          step="0.01"
                          value={formData.estimated_cost}
                          onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="process_id">{t.process}</Label>
                        <Select value={formData.process_id} onValueChange={(value) => setFormData({ ...formData, process_id: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder={t.process} />
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
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        {t.cancel}
                      </Button>
                      <Button onClick={handleSave}>{t.save}</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">{t.overview}</TabsTrigger>
                <TabsTrigger value="strategies">{t.strategies}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Strategies</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{strategies.length}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg. Timeline</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {strategies.length > 0 
                          ? Math.round(strategies.filter(s => s.implementation_timeline).reduce((acc, s) => acc + s.implementation_timeline, 0) / strategies.filter(s => s.implementation_timeline).length || 0)
                          : 0
                        } {t.days}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${strategies.filter(s => s.estimated_cost).reduce((acc, s) => acc + s.estimated_cost, 0).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Risk Coverage</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {new Set(strategies.flatMap(s => s.applicable_risks || [])).size}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="strategies" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t.search}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder={t.filter} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.all}</SelectItem>
                      <SelectItem value="preventive">{t.preventive}</SelectItem>
                      <SelectItem value="detective">{t.detective}</SelectItem>
                      <SelectItem value="corrective">{t.corrective}</SelectItem>
                      <SelectItem value="recovery">{t.recovery}</SelectItem>
                      <SelectItem value="alternative">{t.alternative}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filteredStrategies.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Target className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">{t.noStrategies}</h3>
                      <p className="text-muted-foreground mb-4">{t.createFirst}</p>
                      <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t.newStrategy}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredStrategies.map((strategy) => (
                      <Card key={strategy.id} className="relative">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{strategy.name}</CardTitle>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(strategy)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{t.confirmDelete}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {t.deleteDescription}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(strategy.id)}>
                                      {t.delete}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          {strategy.strategy_type && (
                            <Badge className={getTypeColor(strategy.strategy_type)}>
                              {t[strategy.strategy_type] || strategy.strategy_type}
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent>
                          {strategy.description && (
                            <p className="text-sm text-muted-foreground mb-4">
                              {strategy.description}
                            </p>
                          )}
                          
                          <div className="space-y-2 text-sm">
                            {strategy.implementation_timeline && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">{t.timeline}:</span>
                                <span>{strategy.implementation_timeline} {t.days}</span>
                              </div>
                            )}
                            
                            {strategy.estimated_cost && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">{t.cost}:</span>
                                <span>${strategy.estimated_cost.toLocaleString()}</span>
                              </div>
                            )}
                            
                            {strategy.applicable_risks?.length > 0 && (
                              <div>
                                <span className="text-muted-foreground">{t.risks}:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {strategy.applicable_risks.slice(0, 3).map((risk, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {risk}
                                    </Badge>
                                  ))}
                                  {strategy.applicable_risks.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{strategy.applicable_risks.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {strategy.process_id && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">{t.process}:</span>
                                <span className="text-xs">{getProcessName(strategy.process_id)}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ContinuityStrategies;
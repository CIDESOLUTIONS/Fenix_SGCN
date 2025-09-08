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
import { Plus, Search, Edit, Trash2, Filter, Weight, Target, Calculator, BarChart3, Star, CheckCircle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface StrategyCriteria {
  id: string;
  criteria_name: string;
  description: string;
  weight: number;
  criteria_type: string;
  min_value?: number;
  max_value?: number;
  scale_description?: any;
  created_at: string;
  updated_at: string;
}

interface BusinessProcess {
  id: string;
  name: string;
  criticality_level: string;
}

interface ContinuityStrategy {
  id: string;
  name: string;
  strategy_type: string;
}

interface ProcessStrategyEvaluation {
  id: string;
  process_id: string;
  strategy_id: string;
  criteria_id: string;
  score: number;
  notes?: string;
  evaluated_at: string;
}

interface EvaluationMatrix {
  [processId: string]: {
    [strategyId: string]: {
      [criteriaId: string]: number;
    };
  };
}

const StrategyCriteria = () => {
  const { user } = useAuth();
  const { language } = useSettings();
  const { toast } = useToast();

  const [criteria, setCriteria] = useState<StrategyCriteria[]>([]);
  const [processes, setProcesses] = useState<BusinessProcess[]>([]);
  const [strategies, setStrategies] = useState<ContinuityStrategy[]>([]);
  const [evaluations, setEvaluations] = useState<ProcessStrategyEvaluation[]>([]);
  const [evaluationMatrix, setEvaluationMatrix] = useState<EvaluationMatrix>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isCriteriaDialogOpen, setIsCriteriaDialogOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<StrategyCriteria | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcess, setSelectedProcess] = useState<string>('');

  const [criteriaFormData, setCriteriaFormData] = useState({
    criteria_name: '',
    description: '',
    weight: 20,
    criteria_type: 'quantitative',
    min_value: '',
    max_value: '',
    scale_description: ''
  });

  const translations = {
    en: {
      title: "Strategy Selection Criteria",
      subtitle: "Define criteria and weights for critical process strategy selection",
      newCriteria: "New Criteria",
      search: "Search criteria...",
      criteriaManagement: "Criteria Management",
      processEvaluation: "Process Evaluation",
      results: "Results",
      criteriaName: "Criteria Name",
      description: "Description",
      weight: "Weight (%)",
      type: "Type",
      quantitative: "Quantitative",
      qualitative: "Qualitative",
      minValue: "Min Value",
      maxValue: "Max Value",
      scaleDescription: "Scale Description",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      process: "Process",
      strategy: "Strategy",
      score: "Score",
      notes: "Notes",
      evaluate: "Evaluate",
      totalScore: "Total Score",
      weightedScore: "Weighted Score",
      criticalProcesses: "Critical Processes",
      selectProcess: "Select Process",
      evaluateStrategies: "Evaluate Strategies",
      recommendedStrategy: "Recommended Strategy",
      criteriaWeight: "Weight",
      evaluationMatrix: "Evaluation Matrix"
    },
    es: {
      title: "Criterios de Selección de Estrategias",
      subtitle: "Define criterios y ponderaciones para la selección de estrategias por proceso crítico",
      newCriteria: "Nuevo Criterio",
      search: "Buscar criterios...",
      criteriaManagement: "Gestión de Criterios",
      processEvaluation: "Evaluación de Procesos",
      results: "Resultados",
      criteriaName: "Nombre del Criterio",
      description: "Descripción",
      weight: "Peso (%)",
      type: "Tipo",
      quantitative: "Cuantitativo",
      qualitative: "Cualitativo",
      minValue: "Valor Mínimo",
      maxValue: "Valor Máximo",
      scaleDescription: "Descripción de Escala",
      save: "Guardar",
      cancel: "Cancelar",
      edit: "Editar",
      delete: "Eliminar",
      process: "Proceso",
      strategy: "Estrategia",
      score: "Puntuación",
      notes: "Notas",
      evaluate: "Evaluar",
      totalScore: "Puntuación Total",
      weightedScore: "Puntuación Ponderada",
      criticalProcesses: "Procesos Críticos",
      selectProcess: "Seleccionar Proceso",
      evaluateStrategies: "Evaluar Estrategias",
      recommendedStrategy: "Estrategia Recomendada",
      criteriaWeight: "Peso",
      evaluationMatrix: "Matriz de Evaluación"
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
      const [criteriaResult, processesResult, strategiesResult, evaluationsResult] = await Promise.all([
        supabase
          .from('strategy_criteria')
          .select('*')
          .eq('user_id', user.id)
          .order('weight', { ascending: false }),
        supabase
          .from('business_processes')
          .select('id, name, criticality_level')
          .eq('user_id', user.id)
          .in('criticality_level', ['high', 'critical']),
        supabase
          .from('continuity_strategies')
          .select('id, name, strategy_type')
          .eq('user_id', user.id),
        supabase
          .from('process_strategy_evaluations')
          .select('*')
          .eq('user_id', user.id)
      ]);

      if (criteriaResult.error) throw criteriaResult.error;
      if (processesResult.error) throw processesResult.error;
      if (strategiesResult.error) throw strategiesResult.error;
      if (evaluationsResult.error) throw evaluationsResult.error;

      setCriteria(criteriaResult.data || []);
      setProcesses(processesResult.data || []);
      setStrategies(strategiesResult.data || []);
      setEvaluations(evaluationsResult.data || []);

      // Build evaluation matrix
      const matrix: EvaluationMatrix = {};
      (evaluationsResult.data || []).forEach(evaluation => {
        if (!matrix[evaluation.process_id]) matrix[evaluation.process_id] = {};
        if (!matrix[evaluation.process_id][evaluation.strategy_id]) matrix[evaluation.process_id][evaluation.strategy_id] = {};
        matrix[evaluation.process_id][evaluation.strategy_id][evaluation.criteria_id] = evaluation.score;
      });
      setEvaluationMatrix(matrix);

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

  const resetCriteriaForm = () => {
    setCriteriaFormData({
      criteria_name: '',
      description: '',
      weight: 20,
      criteria_type: 'quantitative',
      min_value: '',
      max_value: '',
      scale_description: ''
    });
    setEditingCriteria(null);
  };

  const handleSaveCriteria = async () => {
    if (!criteriaFormData.criteria_name.trim()) {
      toast({
        title: "Error",
        description: "Criteria name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const criteriaData = {
        criteria_name: criteriaFormData.criteria_name,
        description: criteriaFormData.description || null,
        weight: criteriaFormData.weight,
        criteria_type: criteriaFormData.criteria_type,
        min_value: criteriaFormData.min_value ? parseFloat(criteriaFormData.min_value) : null,
        max_value: criteriaFormData.max_value ? parseFloat(criteriaFormData.max_value) : null,
        scale_description: criteriaFormData.scale_description ? JSON.parse(criteriaFormData.scale_description || '{}') : null,
        user_id: user.id
      };

      if (editingCriteria) {
        const { error } = await supabase
          .from('strategy_criteria')
          .update(criteriaData)
          .eq('id', editingCriteria.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Criteria updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('strategy_criteria')
          .insert([criteriaData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Criteria created successfully",
        });
      }

      setIsCriteriaDialogOpen(false);
      resetCriteriaForm();
      loadData();
    } catch (error) {
      console.error('Error saving criteria:', error);
      toast({
        title: "Error",
        description: "Failed to save criteria",
        variant: "destructive",
      });
    }
  };

  const handleEditCriteria = (criteriaItem: StrategyCriteria) => {
    setEditingCriteria(criteriaItem);
    setCriteriaFormData({
      criteria_name: criteriaItem.criteria_name,
      description: criteriaItem.description || '',
      weight: criteriaItem.weight,
      criteria_type: criteriaItem.criteria_type,
      min_value: criteriaItem.min_value?.toString() || '',
      max_value: criteriaItem.max_value?.toString() || '',
      scale_description: criteriaItem.scale_description ? JSON.stringify(criteriaItem.scale_description) : ''
    });
    setIsCriteriaDialogOpen(true);
  };

  const handleDeleteCriteria = async (id: string) => {
    try {
      const { error } = await supabase
        .from('strategy_criteria')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Criteria deleted successfully",
      });

      loadData();
    } catch (error) {
      console.error('Error deleting criteria:', error);
      toast({
        title: "Error",
        description: "Failed to delete criteria",
        variant: "destructive",
      });
    }
  };

  const handleScoreChange = async (processId: string, strategyId: string, criteriaId: string, score: number) => {
    try {
      const existingEvaluation = evaluations.find(e => 
        e.process_id === processId && e.strategy_id === strategyId && e.criteria_id === criteriaId
      );

      if (existingEvaluation) {
        const { error } = await supabase
          .from('process_strategy_evaluations')
          .update({ score, evaluated_at: new Date().toISOString() })
          .eq('id', existingEvaluation.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('process_strategy_evaluations')
          .insert([{
            user_id: user.id,
            process_id: processId,
            strategy_id: strategyId,
            criteria_id: criteriaId,
            score
          }]);

        if (error) throw error;
      }

      // Update local state
      const newMatrix = { ...evaluationMatrix };
      if (!newMatrix[processId]) newMatrix[processId] = {};
      if (!newMatrix[processId][strategyId]) newMatrix[processId][strategyId] = {};
      newMatrix[processId][strategyId][criteriaId] = score;
      setEvaluationMatrix(newMatrix);

    } catch (error) {
      console.error('Error saving evaluation:', error);
      toast({
        title: "Error",
        description: "Failed to save evaluation",
        variant: "destructive",
      });
    }
  };

  const calculateWeightedScore = (processId: string, strategyId: string) => {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    criteria.forEach(criteriaItem => {
      const score = evaluationMatrix[processId]?.[strategyId]?.[criteriaItem.id];
      if (score !== undefined) {
        totalWeightedScore += score * (criteriaItem.weight / 100);
        totalWeight += criteriaItem.weight;
      }
    });

    return totalWeight > 0 ? (totalWeightedScore / (totalWeight / 100)) : 0;
  };

  const getRecommendedStrategy = (processId: string) => {
    let bestStrategy = null;
    let bestScore = 0;

    strategies.forEach(strategy => {
      const score = calculateWeightedScore(processId, strategy.id);
      if (score > bestScore) {
        bestScore = score;
        bestStrategy = strategy;
      }
    });

    return { strategy: bestStrategy, score: bestScore };
  };

  const filteredCriteria = criteria.filter(criteriaItem =>
    criteriaItem.criteria_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    criteriaItem.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <Dialog open={isCriteriaDialogOpen} onOpenChange={setIsCriteriaDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetCriteriaForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t.newCriteria}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCriteria ? t.edit : t.newCriteria}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="criteria_name">{t.criteriaName} *</Label>
                        <Input
                          id="criteria_name"
                          value={criteriaFormData.criteria_name}
                          onChange={(e) => setCriteriaFormData({ ...criteriaFormData, criteria_name: e.target.value })}
                          placeholder={t.criteriaName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="criteria_type">{t.type}</Label>
                        <Select value={criteriaFormData.criteria_type} onValueChange={(value) => setCriteriaFormData({ ...criteriaFormData, criteria_type: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder={t.type} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quantitative">{t.quantitative}</SelectItem>
                            <SelectItem value="qualitative">{t.qualitative}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">{t.description}</Label>
                      <Textarea
                        id="description"
                        value={criteriaFormData.description}
                        onChange={(e) => setCriteriaFormData({ ...criteriaFormData, description: e.target.value })}
                        placeholder={t.description}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">{t.weight}: {criteriaFormData.weight}%</Label>
                      <Slider
                        id="weight"
                        min={1}
                        max={100}
                        step={1}
                        value={[criteriaFormData.weight]}
                        onValueChange={(value) => setCriteriaFormData({ ...criteriaFormData, weight: value[0] })}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min_value">{t.minValue}</Label>
                        <Input
                          id="min_value"
                          type="number"
                          value={criteriaFormData.min_value}
                          onChange={(e) => setCriteriaFormData({ ...criteriaFormData, min_value: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max_value">{t.maxValue}</Label>
                        <Input
                          id="max_value"
                          type="number"
                          value={criteriaFormData.max_value}
                          onChange={(e) => setCriteriaFormData({ ...criteriaFormData, max_value: e.target.value })}
                          placeholder="10"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsCriteriaDialogOpen(false)}>
                        {t.cancel}
                      </Button>
                      <Button onClick={handleSaveCriteria}>{t.save}</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs defaultValue="criteria" className="space-y-4">
              <TabsList>
                <TabsTrigger value="criteria">{t.criteriaManagement}</TabsTrigger>
                <TabsTrigger value="evaluation">{t.processEvaluation}</TabsTrigger>
                <TabsTrigger value="results">{t.results}</TabsTrigger>
              </TabsList>

              <TabsContent value="criteria" className="space-y-4">
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
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCriteria.map((criteriaItem) => (
                    <Card key={criteriaItem.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{criteriaItem.criteria_name}</CardTitle>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCriteria(criteriaItem)}
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
                                  <AlertDialogTitle>¿Eliminar criterio?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteCriteria(criteriaItem.id)}>
                                    {t.delete}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            <Weight className="h-3 w-3 mr-1" />
                            {criteriaItem.weight}%
                          </Badge>
                          <Badge variant="secondary">
                            {t[criteriaItem.criteria_type] || criteriaItem.criteria_type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {criteriaItem.description && (
                          <p className="text-sm text-muted-foreground">
                            {criteriaItem.description}
                          </p>
                        )}
                        {criteriaItem.min_value !== null && criteriaItem.max_value !== null && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Rango: {criteriaItem.min_value} - {criteriaItem.max_value}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="evaluation" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="process-select">{t.selectProcess}</Label>
                  <Select value={selectedProcess} onValueChange={setSelectedProcess}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectProcess} />
                    </SelectTrigger>
                    <SelectContent>
                      {processes.map((process) => (
                        <SelectItem key={process.id} value={process.id}>
                          {process.name} ({process.criticality_level})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProcess && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{t.evaluationMatrix}</CardTitle>
                      <CardDescription>
                        Evalúa cada estrategia según los criterios definidos (escala 1-10)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="border p-2 text-left">{t.strategy}</th>
                              {criteria.map((criteriaItem) => (
                                <th key={criteriaItem.id} className="border p-2 text-center min-w-24">
                                  <div className="text-sm font-medium">{criteriaItem.criteria_name}</div>
                                  <div className="text-xs text-muted-foreground">({criteriaItem.weight}%)</div>
                                </th>
                              ))}
                              <th className="border p-2 text-center">{t.weightedScore}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {strategies.map((strategy) => (
                              <tr key={strategy.id}>
                                <td className="border p-2 font-medium">
                                  <div>{strategy.name}</div>
                                  <div className="text-xs text-muted-foreground">{strategy.strategy_type}</div>
                                </td>
                                {criteria.map((criteriaItem) => (
                                  <td key={criteriaItem.id} className="border p-2 text-center">
                                    <Input
                                      type="number"
                                      min={criteriaItem.min_value || 1}
                                      max={criteriaItem.max_value || 10}
                                      step="0.1"
                                      value={evaluationMatrix[selectedProcess]?.[strategy.id]?.[criteriaItem.id] || ''}
                                      onChange={(e) => handleScoreChange(
                                        selectedProcess,
                                        strategy.id,
                                        criteriaItem.id,
                                        parseFloat(e.target.value) || 0
                                      )}
                                      className="w-16 text-center"
                                    />
                                  </td>
                                ))}
                                <td className="border p-2 text-center font-bold">
                                  {calculateWeightedScore(selectedProcess, strategy.id).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="results" className="space-y-4">
                <div className="grid gap-4">
                  {processes.map((process) => {
                    const recommendation = getRecommendedStrategy(process.id);
                    return (
                      <Card key={process.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                {process.name}
                              </CardTitle>
                              <CardDescription>
                                Nivel de criticidad: {process.criticality_level}
                              </CardDescription>
                            </div>
                            {recommendation.strategy && (
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">{t.recommendedStrategy}</div>
                                <div className="font-semibold text-lg flex items-center gap-2">
                                  <Star className="h-5 w-5 text-yellow-500" />
                                  {recommendation.strategy.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {t.weightedScore}: {recommendation.score.toFixed(2)}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {strategies.map((strategy) => {
                              const score = calculateWeightedScore(process.id, strategy.id);
                              const isRecommended = recommendation.strategy?.id === strategy.id;
                              return (
                                <div key={strategy.id} className={`flex items-center justify-between p-2 rounded ${isRecommended ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                  <div className="flex items-center gap-2">
                                    {isRecommended && <CheckCircle className="h-4 w-4 text-green-600" />}
                                    <span className={isRecommended ? 'font-semibold' : ''}>{strategy.name}</span>
                                    <Badge variant="outline" className="text-xs">{strategy.strategy_type}</Badge>
                                  </div>
                                  <div className={`font-mono ${isRecommended ? 'font-bold text-green-700' : ''}`}>
                                    {score.toFixed(2)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StrategyCriteria;
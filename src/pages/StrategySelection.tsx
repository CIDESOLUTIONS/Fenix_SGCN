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
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Filter, Scale, Target, Award, Calculator } from 'lucide-react';

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

const StrategySelection = () => {
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
  const [selectedProcess, setSelectedProcess] = useState<string>('');

  const [criteriaFormData, setCriteriaFormData] = useState({
    criteria_name: '',
    description: '',
    weight: [25],
    criteria_type: 'quantitative',
    min_value: '',
    max_value: '',
  });

  const translations = {
    en: {
      title: "Strategy Selection Criteria",
      subtitle: "Define criteria and weightings for critical process strategy selection",
      newCriteria: "New Criteria",
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
      process: "Process",
      strategy: "Strategy",
      score: "Score",
      notes: "Notes",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      evaluate: "Evaluate",
      totalScore: "Total Score",
      recommendation: "Recommendation",
      criticalProcesses: "Critical Processes",
      selectProcess: "Select Process",
      selectStrategy: "Select Strategy",
      selectCriteria: "Select Criteria",
      noCriteria: "No criteria defined",
      createFirstCriteria: "Create your first evaluation criteria",
      evaluateStrategies: "Evaluate Strategies",
      weightedScore: "Weighted Score",
      bestStrategy: "Best Strategy"
    },
    es: {
      title: "Criterios de Selección de Estrategias",
      subtitle: "Define criterios y ponderaciones para la selección de estrategias por proceso crítico",
      newCriteria: "Nuevo Criterio",
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
      process: "Proceso",
      strategy: "Estrategia",
      score: "Puntuación",
      notes: "Notas",
      save: "Guardar",
      cancel: "Cancelar",
      edit: "Editar",
      delete: "Eliminar",
      evaluate: "Evaluar",
      totalScore: "Puntuación Total",
      recommendation: "Recomendación",
      criticalProcesses: "Procesos Críticos",
      selectProcess: "Seleccionar Proceso",
      selectStrategy: "Seleccionar Estrategia",
      selectCriteria: "Seleccionar Criterio",
      noCriteria: "No hay criterios definidos",
      createFirstCriteria: "Crea tu primer criterio de evaluación",
      evaluateStrategies: "Evaluar Estrategias",
      weightedScore: "Puntuación Ponderada",
      bestStrategy: "Mejor Estrategia"
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
          .order('created_at', { ascending: false }),
        supabase
          .from('business_processes')
          .select('id, name, criticality_level')
          .eq('user_id', user.id)
          .eq('criticality_level', 'critical'),
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
        if (!matrix[evaluation.process_id]) {
          matrix[evaluation.process_id] = {};
        }
        if (!matrix[evaluation.process_id][evaluation.strategy_id]) {
          matrix[evaluation.process_id][evaluation.strategy_id] = {};
        }
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
      weight: [25],
      criteria_type: 'quantitative',
      min_value: '',
      max_value: '',
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

    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0) + criteriaFormData.weight[0];
    if (totalWeight > 100 && !editingCriteria) {
      toast({
        title: "Error",
        description: "Total weight cannot exceed 100%",
        variant: "destructive",
      });
      return;
    }

    try {
      const criteriaData = {
        criteria_name: criteriaFormData.criteria_name,
        description: criteriaFormData.description || null,
        weight: criteriaFormData.weight[0],
        criteria_type: criteriaFormData.criteria_type,
        min_value: criteriaFormData.min_value ? parseFloat(criteriaFormData.min_value) : null,
        max_value: criteriaFormData.max_value ? parseFloat(criteriaFormData.max_value) : null,
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

  const handleEditCriteria = (criteria: StrategyCriteria) => {
    setEditingCriteria(criteria);
    setCriteriaFormData({
      criteria_name: criteria.criteria_name,
      description: criteria.description || '',
      weight: [criteria.weight],
      criteria_type: criteria.criteria_type,
      min_value: criteria.min_value?.toString() || '',
      max_value: criteria.max_value?.toString() || '',
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

  const handleScoreUpdate = async (processId: string, strategyId: string, criteriaId: string, score: number) => {
    try {
      // Check if evaluation exists
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

      loadData();
    } catch (error) {
      console.error('Error updating score:', error);
      toast({
        title: "Error",
        description: "Failed to update score",
        variant: "destructive",
      });
    }
  };

  const calculateWeightedScore = (processId: string, strategyId: string) => {
    let totalScore = 0;
    let totalWeight = 0;

    criteria.forEach(criterion => {
      const score = evaluationMatrix[processId]?.[strategyId]?.[criterion.id];
      if (score !== undefined) {
        totalScore += score * (criterion.weight / 100);
        totalWeight += criterion.weight;
      }
    });

    return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
  };

  const getBestStrategy = (processId: string) => {
    let bestStrategy = null;
    let bestScore = -1;

    strategies.forEach(strategy => {
      const score = calculateWeightedScore(processId, strategy.id);
      if (score > bestScore) {
        bestScore = score;
        bestStrategy = strategy;
      }
    });

    return { strategy: bestStrategy, score: bestScore };
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
            </div>

            <Tabs defaultValue="criteria" className="space-y-4">
              <TabsList>
                <TabsTrigger value="criteria">{t.criteriaManagement}</TabsTrigger>
                <TabsTrigger value="evaluation">{t.processEvaluation}</TabsTrigger>
                <TabsTrigger value="results">{t.results}</TabsTrigger>
              </TabsList>

              <TabsContent value="criteria" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Evaluation Criteria</h3>
                  <Dialog open={isCriteriaDialogOpen} onOpenChange={setIsCriteriaDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetCriteriaForm}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t.newCriteria}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>
                          {editingCriteria ? t.edit : t.newCriteria}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
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
                          <Label htmlFor="description">{t.description}</Label>
                          <Textarea
                            id="description"
                            value={criteriaFormData.description}
                            onChange={(e) => setCriteriaFormData({ ...criteriaFormData, description: e.target.value })}
                            placeholder={t.description}
                            rows={2}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>{t.weight}: {criteriaFormData.weight[0]}%</Label>
                            <Slider
                              value={criteriaFormData.weight}
                              onValueChange={(value) => setCriteriaFormData({ ...criteriaFormData, weight: value })}
                              max={100}
                              step={5}
                              className="w-full"
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

                        {criteriaFormData.criteria_type === 'quantitative' && (
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
                                placeholder="100"
                              />
                            </div>
                          </div>
                        )}

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

                {criteria.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Scale className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">{t.noCriteria}</h3>
                      <p className="text-muted-foreground mb-4">{t.createFirstCriteria}</p>
                      <Button onClick={() => setIsCriteriaDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t.newCriteria}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {criteria.map((criterion) => (
                      <Card key={criterion.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{criterion.criteria_name}</CardTitle>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCriteria(criterion)}
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
                                    <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteCriteria(criterion.id)}>
                                      {t.delete}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {criterion.weight}% weight
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          {criterion.description && (
                            <p className="text-sm text-muted-foreground mb-2">{criterion.description}</p>
                          )}
                          <div className="text-sm">
                            <span className="font-medium">Type:</span> {t[criterion.criteria_type] || criterion.criteria_type}
                            {criterion.min_value !== null && criterion.max_value !== null && (
                              <div>
                                <span className="font-medium">Range:</span> {criterion.min_value} - {criterion.max_value}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Weight Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Weight Used:</span>
                        <span className="font-medium">
                          {criteria.reduce((sum, c) => sum + c.weight, 0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${Math.min(criteria.reduce((sum, c) => sum + c.weight, 0), 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="evaluation" className="space-y-4">
                {criteria.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Evaluation Criteria</h3>
                      <p className="text-muted-foreground mb-4">Create criteria first to evaluate strategies</p>
                      <Button onClick={() => setIsCriteriaDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t.newCriteria}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Label>{t.selectProcess}:</Label>
                      <Select value={selectedProcess} onValueChange={setSelectedProcess}>
                        <SelectTrigger className="w-[300px]">
                          <SelectValue placeholder={t.selectProcess} />
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

                    {selectedProcess && (
                      <Card>
                        <CardHeader>
                          <CardTitle>{t.evaluateStrategies}</CardTitle>
                          <CardDescription>
                            Evaluate each strategy against the defined criteria for{' '}
                            {processes.find(p => p.id === selectedProcess)?.name}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr>
                                  <th className="text-left border-b p-2">{t.strategy}</th>
                                  {criteria.map((criterion) => (
                                    <th key={criterion.id} className="text-center border-b p-2 min-w-[120px]">
                                      {criterion.criteria_name}
                                      <br />
                                      <span className="text-xs text-muted-foreground">
                                        ({criterion.weight}%)
                                      </span>
                                    </th>
                                  ))}
                                  <th className="text-center border-b p-2">{t.weightedScore}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {strategies.map((strategy) => (
                                  <tr key={strategy.id} className="border-b">
                                    <td className="p-2 font-medium">{strategy.name}</td>
                                    {criteria.map((criterion) => (
                                      <td key={criterion.id} className="p-2 text-center">
                                        <Input
                                          type="number"
                                          min={criterion.min_value || 0}
                                          max={criterion.max_value || 100}
                                          value={evaluationMatrix[selectedProcess]?.[strategy.id]?.[criterion.id] || ''}
                                          onChange={(e) => {
                                            const score = parseFloat(e.target.value);
                                            if (!isNaN(score)) {
                                              handleScoreUpdate(selectedProcess, strategy.id, criterion.id, score);
                                            }
                                          }}
                                          className="w-20 text-center"
                                          placeholder="0-100"
                                        />
                                      </td>
                                    ))}
                                    <td className="p-2 text-center font-medium">
                                      {calculateWeightedScore(selectedProcess, strategy.id).toFixed(1)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="results" className="space-y-4">
                <div className="grid gap-4">
                  {processes.map((process) => {
                    const bestResult = getBestStrategy(process.id);
                    return (
                      <Card key={process.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>{process.name}</span>
                            <Badge variant="outline">
                              {process.criticality_level}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {bestResult.strategy ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border">
                                <div>
                                  <h4 className="font-medium text-green-800">{t.bestStrategy}</h4>
                                  <p className="text-green-600">{bestResult.strategy.name}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-green-800">
                                    {bestResult.score.toFixed(1)}
                                  </div>
                                  <div className="text-sm text-green-600">Score</div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h5 className="font-medium">All Strategies Ranking:</h5>
                                {strategies
                                  .map(strategy => ({
                                    ...strategy,
                                    score: calculateWeightedScore(process.id, strategy.id)
                                  }))
                                  .sort((a, b) => b.score - a.score)
                                  .map((strategy, index) => (
                                    <div key={strategy.id} className="flex items-center justify-between p-2 border rounded">
                                      <div className="flex items-center space-x-2">
                                        <Badge variant={index === 0 ? "default" : "outline"}>
                                          #{index + 1}
                                        </Badge>
                                        <span>{strategy.name}</span>
                                      </div>
                                      <span className="font-medium">{strategy.score.toFixed(1)}</span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No evaluations completed for this process</p>
                          )}
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

export default StrategySelection;
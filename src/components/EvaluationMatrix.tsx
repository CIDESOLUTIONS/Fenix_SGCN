import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Calculator, Target } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Criteria {
  id: string;
  criteria_name: string;
  description: string;
  weight: number;
  criteria_type: string;
  min_value?: number;
  max_value?: number;
}

interface EvaluationMatrixProps {
  moduleType: 'risk' | 'bia' | 'strategy';
  criteria: Criteria[];
  items: any[];
  itemNameField: string;
  itemDescField?: string;
  onEvaluationChange?: (evaluations: any) => void;
}

const EvaluationMatrix: React.FC<EvaluationMatrixProps> = ({
  moduleType,
  criteria,
  items,
  itemNameField,
  itemDescField,
  onEvaluationChange
}) => {
  const { user } = useAuth();
  const { language } = useSettings();
  const { toast } = useToast();

  const [evaluations, setEvaluations] = useState<any>({});
  const [selectedItem, setSelectedItem] = useState<string>('');

  const translations = {
    en: {
      evaluationMatrix: "Evaluation Matrix",
      selectItem: "Select Item",
      score: "Score",
      weightedScore: "Weighted Score",
      totalScore: "Total Score",
      exportReport: "Export Report",
      consolidatedReport: "Consolidated Report",
      individualReport: "Individual Report",
      allItems: "All Items"
    },
    es: {
      evaluationMatrix: "Matriz de Evaluación",
      selectItem: "Seleccionar Item",
      score: "Puntuación",
      weightedScore: "Puntuación Ponderada",
      totalScore: "Puntuación Total",
      exportReport: "Exportar Reporte",
      consolidatedReport: "Reporte Consolidado",
      individualReport: "Reporte Individual",
      allItems: "Todos los Items"
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadEvaluations();
  }, [items, criteria]);

  const loadEvaluations = async () => {
    if (!user || criteria.length === 0 || items.length === 0) return;

    try {
      const { data, error } = await supabase
        .from('process_strategy_evaluations')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const evalMatrix: any = {};
      (data || []).forEach(evaluation => {
        if (!evalMatrix[evaluation.process_id]) evalMatrix[evaluation.process_id] = {};
        if (!evalMatrix[evaluation.process_id][evaluation.strategy_id]) evalMatrix[evaluation.process_id][evaluation.strategy_id] = {};
        evalMatrix[evaluation.process_id][evaluation.strategy_id][evaluation.criteria_id] = evaluation.score;
      });

      setEvaluations(evalMatrix);
      onEvaluationChange?.(evalMatrix);
    } catch (error) {
      console.error('Error loading evaluations:', error);
    }
  };

  const handleScoreChange = async (itemId: string, criteriaId: string, score: number) => {
    try {
      const existingEvaluation = evaluations[itemId]?.[criteriaId];

      if (existingEvaluation) {
        const { error } = await supabase
          .from('process_strategy_evaluations')
          .update({ score })
          .eq('process_id', itemId)
          .eq('criteria_id', criteriaId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('process_strategy_evaluations')
          .insert([{
            user_id: user.id,
            process_id: itemId,
            strategy_id: itemId, // Using same ID for simplicity
            criteria_id: criteriaId,
            score
          }]);

        if (error) throw error;
      }

      // Update local state
      const newEvaluations = { ...evaluations };
      if (!newEvaluations[itemId]) newEvaluations[itemId] = {};
      newEvaluations[itemId][criteriaId] = score;
      setEvaluations(newEvaluations);
      onEvaluationChange?.(newEvaluations);

    } catch (error) {
      console.error('Error saving evaluation:', error);
      toast({
        title: "Error",
        description: "Failed to save evaluation",
        variant: "destructive",
      });
    }
  };

  const calculateWeightedScore = (itemId: string) => {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    criteria.forEach(criteriaItem => {
      const score = evaluations[itemId]?.[criteriaItem.id];
      if (score !== undefined) {
        totalWeightedScore += score * (criteriaItem.weight / 100);
        totalWeight += criteriaItem.weight;
      }
    });

    return totalWeight > 0 ? (totalWeightedScore / (totalWeight / 100)) : 0;
  };

  const exportIndividualReport = (item: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text(`Reporte Individual - ${item[itemNameField]}`, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Módulo: ${moduleType.toUpperCase()}`, 20, 30);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 40);
    
    // Item details
    if (itemDescField && item[itemDescField]) {
      doc.text(`Descripción: ${item[itemDescField]}`, 20, 50);
    }

    // Evaluation table
    const tableData = criteria.map(criteriaItem => {
      const score = evaluations[item.id]?.[criteriaItem.id] || '-';
      const weightedScore = score !== '-' ? (score * (criteriaItem.weight / 100)).toFixed(2) : '-';
      return [
        criteriaItem.criteria_name,
        `${criteriaItem.weight}%`,
        score,
        weightedScore
      ];
    });

    // Add total row
    const totalScore = calculateWeightedScore(item.id);
    tableData.push(['TOTAL', '100%', '', totalScore.toFixed(2)]);

    // @ts-ignore
    doc.autoTable({
      head: [['Criterio', 'Peso', 'Puntuación', 'Ponderado']],
      body: tableData,
      startY: 60,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    doc.save(`reporte-individual-${item[itemNameField]}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportConsolidatedReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text(`Reporte Consolidado - ${moduleType.toUpperCase()}`, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Summary table
    const summaryData = items.map(item => {
      const totalScore = calculateWeightedScore(item.id);
      return [
        item[itemNameField],
        totalScore.toFixed(2),
        totalScore >= 8 ? 'Excelente' : totalScore >= 6 ? 'Bueno' : totalScore >= 4 ? 'Regular' : 'Deficiente'
      ];
    });

    // @ts-ignore
    doc.autoTable({
      head: [['Item', 'Puntuación Total', 'Clasificación']],
      body: summaryData,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    // Detailed evaluation for each item
    let yPosition = (doc as any).lastAutoTable.finalY + 20;

    items.forEach((item, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text(`${item[itemNameField]}`, 20, yPosition);
      yPosition += 10;

      const itemTableData = criteria.map(criteriaItem => {
        const score = evaluations[item.id]?.[criteriaItem.id] || '-';
        const weightedScore = score !== '-' ? (score * (criteriaItem.weight / 100)).toFixed(2) : '-';
        return [
          criteriaItem.criteria_name,
          `${criteriaItem.weight}%`,
          score,
          weightedScore
        ];
      });

      // @ts-ignore
      doc.autoTable({
        head: [['Criterio', 'Peso', 'Puntuación', 'Ponderado']],
        body: itemTableData,
        startY: yPosition,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    });

    doc.save(`reporte-consolidado-${moduleType}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (criteria.length === 0 || items.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">
            Debe definir criterios y tener items para evaluar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              {t.evaluationMatrix}
            </CardTitle>
            <CardDescription>
              Evalúa cada item según los criterios definidos
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={exportConsolidatedReport}>
              <Download className="h-4 w-4 mr-2" />
              {t.consolidatedReport}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item-select">{t.selectItem}</Label>
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectItem} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allItems}</SelectItem>
                {items.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item[itemNameField]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(selectedItem === 'all' || selectedItem) && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">Item</th>
                    {criteria.map((criteriaItem) => (
                      <th key={criteriaItem.id} className="border p-2 text-center min-w-24">
                        <div className="text-sm font-medium">{criteriaItem.criteria_name}</div>
                        <div className="text-xs text-muted-foreground">({criteriaItem.weight}%)</div>
                      </th>
                    ))}
                    <th className="border p-2 text-center">{t.totalScore}</th>
                    <th className="border p-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedItem === 'all' ? items : items.filter(item => item.id === selectedItem)).map((item) => (
                    <tr key={item.id}>
                      <td className="border p-2 font-medium">
                        <div>{item[itemNameField]}</div>
                        {itemDescField && item[itemDescField] && (
                          <div className="text-xs text-muted-foreground">{item[itemDescField]}</div>
                        )}
                      </td>
                      {criteria.map((criteriaItem) => (
                        <td key={criteriaItem.id} className="border p-2 text-center">
                          <Input
                            type="number"
                            min={criteriaItem.min_value || 1}
                            max={criteriaItem.max_value || 10}
                            step="0.1"
                            value={evaluations[item.id]?.[criteriaItem.id] || ''}
                            onChange={(e) => handleScoreChange(
                              item.id,
                              criteriaItem.id,
                              parseFloat(e.target.value) || 0
                            )}
                            className="w-16 text-center"
                          />
                        </td>
                      ))}
                      <td className="border p-2 text-center font-bold">
                        <Badge variant="outline">
                          {calculateWeightedScore(item.id).toFixed(2)}
                        </Badge>
                      </td>
                      <td className="border p-2 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => exportIndividualReport(item)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EvaluationMatrix;
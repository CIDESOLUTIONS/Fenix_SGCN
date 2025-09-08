import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Weight, FileText, Download } from 'lucide-react';
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
  module_type: string;
  created_at: string;
  updated_at: string;
}

interface CriteriaManagerProps {
  moduleType: 'risk' | 'bia' | 'strategy';
  onCriteriaChange?: (criteria: Criteria[]) => void;
}

const CriteriaManager: React.FC<CriteriaManagerProps> = ({ moduleType, onCriteriaChange }) => {
  const { user } = useAuth();
  const { language } = useSettings();
  const { toast } = useToast();

  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<Criteria | null>(null);

  const [formData, setFormData] = useState({
    criteria_name: '',
    description: '',
    weight: 20,
    criteria_type: 'quantitative',
    min_value: '',
    max_value: ''
  });

  const translations = {
    en: {
      criteriaManagement: "Criteria Management",
      newCriteria: "New Criteria",
      criteriaName: "Criteria Name",
      description: "Description",
      weight: "Weight (%)",
      type: "Type",
      quantitative: "Quantitative",
      qualitative: "Qualitative",
      minValue: "Min Value",
      maxValue: "Max Value",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this criteria?",
      deleteDescription: "This action cannot be undone.",
      exportPDF: "Export PDF Report",
      criteriaReport: "Criteria Report"
    },
    es: {
      criteriaManagement: "Gestión de Criterios",
      newCriteria: "Nuevo Criterio",
      criteriaName: "Nombre del Criterio",
      description: "Descripción",
      weight: "Peso (%)",
      type: "Tipo",
      quantitative: "Cuantitativo",
      qualitative: "Cualitativo",
      minValue: "Valor Mínimo",
      maxValue: "Valor Máximo",
      save: "Guardar",
      cancel: "Cancelar",
      edit: "Editar",
      delete: "Eliminar",
      confirmDelete: "¿Está seguro de que desea eliminar este criterio?",
      deleteDescription: "Esta acción no se puede deshacer.",
      exportPDF: "Exportar Reporte PDF",
      criteriaReport: "Reporte de Criterios"
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (user) {
      loadCriteria();
    }
  }, [user, moduleType]);

  const loadCriteria = async () => {
    try {
      const { data, error } = await supabase
        .from('strategy_criteria')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_type', moduleType)
        .order('weight', { ascending: false });

      if (error) throw error;

      setCriteria(data || []);
      onCriteriaChange?.(data || []);
    } catch (error) {
      console.error('Error loading criteria:', error);
      toast({
        title: "Error",
        description: "Failed to load criteria",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      criteria_name: '',
      description: '',
      weight: 20,
      criteria_type: 'quantitative',
      min_value: '',
      max_value: ''
    });
    setEditingCriteria(null);
  };

  const handleSave = async () => {
    if (!formData.criteria_name.trim()) {
      toast({
        title: "Error",
        description: "Criteria name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const criteriaData = {
        criteria_name: formData.criteria_name,
        description: formData.description || null,
        weight: formData.weight,
        criteria_type: formData.criteria_type,
        min_value: formData.min_value ? parseFloat(formData.min_value) : null,
        max_value: formData.max_value ? parseFloat(formData.max_value) : null,
        module_type: moduleType,
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

      setIsDialogOpen(false);
      resetForm();
      loadCriteria();
    } catch (error) {
      console.error('Error saving criteria:', error);
      toast({
        title: "Error",
        description: "Failed to save criteria",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (criteriaItem: Criteria) => {
    setEditingCriteria(criteriaItem);
    setFormData({
      criteria_name: criteriaItem.criteria_name,
      description: criteriaItem.description || '',
      weight: criteriaItem.weight,
      criteria_type: criteriaItem.criteria_type,
      min_value: criteriaItem.min_value?.toString() || '',
      max_value: criteriaItem.max_value?.toString() || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
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

      loadCriteria();
    } catch (error) {
      console.error('Error deleting criteria:', error);
      toast({
        title: "Error",
        description: "Failed to delete criteria",
        variant: "destructive",
      });
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text(`${t.criteriaReport} - ${moduleType.toUpperCase()}`, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Table data
    const tableData = criteria.map(criteriaItem => [
      criteriaItem.criteria_name,
      criteriaItem.description || '-',
      `${criteriaItem.weight}%`,
      t[criteriaItem.criteria_type] || criteriaItem.criteria_type,
      criteriaItem.min_value || '-',
      criteriaItem.max_value || '-'
    ]);

    // @ts-ignore
    doc.autoTable({
      head: [['Criterio', 'Descripción', 'Peso', 'Tipo', 'Min', 'Max']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    doc.save(`criterios-${moduleType}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Weight className="h-5 w-5" />
              {t.criteriaManagement}
            </CardTitle>
            <CardDescription>
              Definir criterios y ponderaciones para evaluación
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={exportToPDF}>
              <Download className="h-4 w-4 mr-2" />
              {t.exportPDF}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={resetForm}>
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
                        value={formData.criteria_name}
                        onChange={(e) => setFormData({ ...formData, criteria_name: e.target.value })}
                        placeholder={t.criteriaName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="criteria_type">{t.type}</Label>
                      <Select value={formData.criteria_type} onValueChange={(value) => setFormData({ ...formData, criteria_type: value })}>
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
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder={t.description}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">{t.weight}: {formData.weight}%</Label>
                    <Slider
                      id="weight"
                      min={1}
                      max={100}
                      step={1}
                      value={[formData.weight]}
                      onValueChange={(value) => setFormData({ ...formData, weight: value[0] })}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min_value">{t.minValue}</Label>
                      <Input
                        id="min_value"
                        type="number"
                        value={formData.min_value}
                        onChange={(e) => setFormData({ ...formData, min_value: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max_value">{t.maxValue}</Label>
                      <Input
                        id="max_value"
                        type="number"
                        value={formData.max_value}
                        onChange={(e) => setFormData({ ...formData, max_value: e.target.value })}
                        placeholder="10"
                      />
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {criteria.map((criteriaItem) => (
            <div key={criteriaItem.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{criteriaItem.criteria_name}</span>
                  <Badge variant="outline">
                    <Weight className="h-3 w-3 mr-1" />
                    {criteriaItem.weight}%
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {t[criteriaItem.criteria_type] || criteriaItem.criteria_type}
                  </Badge>
                </div>
                {criteriaItem.description && (
                  <p className="text-sm text-muted-foreground">{criteriaItem.description}</p>
                )}
                {criteriaItem.min_value !== null && criteriaItem.max_value !== null && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Rango: {criteriaItem.min_value} - {criteriaItem.max_value}
                  </div>
                )}
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(criteriaItem)}
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
                      <AlertDialogAction onClick={() => handleDelete(criteriaItem.id)}>
                        {t.delete}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          {criteria.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Weight className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay criterios definidos</p>
              <p className="text-sm">Crea tu primer criterio para comenzar</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CriteriaManager;
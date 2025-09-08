import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  Target,
  Shield,
  Award,
  BarChart3,
  Download,
  Plus,
  Search,
  Filter,
  Settings,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Finding {
  id: string;
  finding_type: string;
  title: string;
  description: string;
  source: string;
  severity: string;
  status: string;
  identified_date: string;
  area_department: string;
  responsible_person: string;
  responsible_email: string;
  root_cause_analysis: string;
  closure_date: string;
  closure_verification: string;
}

interface ComplianceFramework {
  id: string;
  framework_name: string;
  version: string;
  status: string;
  certification_date: string;
  expiry_date: string;
  certifying_body: string;
  certificate_number: string;
  compliance_level: number;
  last_assessment_date: string;
  next_assessment_date: string;
}

interface KPIMetric {
  id: string;
  metric_name: string;
  metric_type: string;
  measurement_unit: string;
  target_value: number;
  current_value: number;
  measurement_period: string;
  measurement_date: string;
  trend: string;
  status: string;
  responsible_person: string;
}

interface ManagementReview {
  id: string;
  review_date: string;
  review_period_start: string;
  review_period_end: string;
  review_status: string;
  system_effectiveness_rating: number;
  objectives_achievement_percentage: number;
  incidents_count: number;
  tests_conducted: number;
  corrective_actions_closed: number;
  strengths: string;
  improvement_areas: string;
}

const MantenimientoMejora = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  
  // Data states
  const [findings, setFindings] = useState<Finding[]>([]);
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [kpiMetrics, setKPIMetrics] = useState<KPIMetric[]>([]);
  const [managementReviews, setManagementReviews] = useState<ManagementReview[]>([]);
  
  // Form states
  const [newFinding, setNewFinding] = useState({
    finding_type: 'non_conformity',
    title: '',
    description: '',
    source: '',
    severity: 'medium',
    area_department: '',
    responsible_person: '',
    responsible_email: ''
  });

  const [newKPI, setNewKPI] = useState({
    metric_name: '',
    metric_type: 'compliance',
    measurement_unit: 'percentage',
    target_value: 0,
    current_value: 0,
    measurement_period: 'monthly',
    responsible_person: ''
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [findingsRes, frameworksRes, kpiRes, reviewsRes] = await Promise.all([
        supabase.from('findings').select('*').eq('user_id', user?.id),
        supabase.from('compliance_framework').select('*').eq('user_id', user?.id),
        supabase.from('kpi_metrics').select('*').eq('user_id', user?.id),
        supabase.from('management_reviews').select('*').eq('user_id', user?.id)
      ]);

      if (findingsRes.data) setFindings(findingsRes.data);
      if (frameworksRes.data) setFrameworks(frameworksRes.data);
      if (kpiRes.data) setKPIMetrics(kpiRes.data);
      if (reviewsRes.data) setManagementReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createFinding = async () => {
    if (!newFinding.title || !newFinding.description) {
      toast({
        title: "Error",
        description: "Título y descripción son obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('findings')
        .insert([{ ...newFinding, user_id: user?.id }])
        .select();

      if (error) throw error;

      if (data) {
        setFindings([...findings, data[0]]);
        setNewFinding({
          finding_type: 'non_conformity',
          title: '',
          description: '',
          source: '',
          severity: 'medium',
          area_department: '',
          responsible_person: '',
          responsible_email: ''
        });
        toast({
          title: "Éxito",
          description: "Hallazgo registrado correctamente",
        });
      }
    } catch (error) {
      console.error('Error creating finding:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar el hallazgo",
        variant: "destructive",
      });
    }
  };

  const createKPI = async () => {
    if (!newKPI.metric_name) {
      toast({
        title: "Error",
        description: "El nombre de la métrica es obligatorio",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('kpi_metrics')
        .insert([{ ...newKPI, user_id: user?.id }])
        .select();

      if (error) throw error;

      if (data) {
        setKPIMetrics([...kpiMetrics, data[0]]);
        setNewKPI({
          metric_name: '',
          metric_type: 'compliance',
          measurement_unit: 'percentage',
          target_value: 0,
          current_value: 0,
          measurement_period: 'monthly',
          responsible_person: ''
        });
        toast({
          title: "Éxito",
          description: "KPI registrado correctamente",
        });
      }
    } catch (error) {
      console.error('Error creating KPI:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar el KPI",
        variant: "destructive",
      });
    }
  };

  const generateManagementReport = async () => {
    setIsLoading(true);
    try {
      // Calculate metrics for the report
      const openFindings = findings.filter(f => f.status === 'open').length;
      const closedFindings = findings.filter(f => f.status === 'closed').length;
      const avgCompliance = frameworks.reduce((acc, f) => acc + f.compliance_level, 0) / frameworks.length || 0;
      const kpiOnTrack = kpiMetrics.filter(k => k.status === 'on_track').length;

      const reviewData = {
        review_date: new Date().toISOString().split('T')[0],
        review_period_start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        review_period_end: new Date().toISOString().split('T')[0],
        review_status: 'completed',
        system_effectiveness_rating: Math.round(avgCompliance / 10),
        objectives_achievement_percentage: avgCompliance,
        incidents_count: openFindings,
        tests_conducted: 0, // From tests module
        corrective_actions_closed: closedFindings,
        strengths: 'Sistema de gestión implementado correctamente',
        improvement_areas: `${openFindings} hallazgos pendientes de resolución`,
        user_id: user?.id
      };

      const { data, error } = await supabase
        .from('management_reviews')
        .insert([reviewData])
        .select();

      if (error) throw error;

      if (data) {
        setManagementReviews([...managementReviews, data[0]]);
        toast({
          title: "Éxito",
          description: "Reporte de revisión por la dirección generado",
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el reporte",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in_progress': return 'secondary';
      case 'closed': return 'default';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    }
  };

  const filteredFindings = findings.filter(finding => {
    const matchesSearch = finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         finding.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || finding.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <AppHeader />
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-6 w-6" />
                    <h1 className="text-2xl font-bold">Mantenimiento y Mejora Continua</h1>
                  </div>
                  <Button onClick={generateManagementReport} disabled={isLoading}>
                    <FileText className="h-4 w-4 mr-2" />
                    Generar Reporte de Dirección
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="findings">Hallazgos</TabsTrigger>
          <TabsTrigger value="compliance">Cumplimiento</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="reviews">Revisiones</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hallazgos Abiertos</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {findings.filter(f => f.status === 'open').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {findings.filter(f => f.severity === 'critical').length} críticos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cumplimiento Promedio</CardTitle>
                <Shield className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {frameworks.length > 0 
                    ? `${Math.round(frameworks.reduce((acc, f) => acc + f.compliance_level, 0) / frameworks.length)}%`
                    : '0%'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  {frameworks.length} marcos normativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">KPIs En Meta</CardTitle>
                <Target className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {kpiMetrics.filter(k => k.status === 'on_track').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  de {kpiMetrics.length} métricas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revisiones Completadas</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {managementReviews.filter(r => r.review_status === 'completed').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  este año
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Acciones frecuentes del sistema de mejora continua</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Plus className="h-6 w-6" />
                    Registrar Hallazgo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Nuevo Hallazgo</DialogTitle>
                    <DialogDescription>
                      Registre un nuevo hallazgo, no conformidad u oportunidad de mejora
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="finding-type">Tipo</Label>
                        <Select value={newFinding.finding_type} onValueChange={(value) => setNewFinding({...newFinding, finding_type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="non_conformity">No Conformidad</SelectItem>
                            <SelectItem value="observation">Observación</SelectItem>
                            <SelectItem value="opportunity">Oportunidad de Mejora</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="severity">Severidad</Label>
                        <Select value={newFinding.severity} onValueChange={(value) => setNewFinding({...newFinding, severity: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="critical">Crítica</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                            <SelectItem value="medium">Media</SelectItem>
                            <SelectItem value="low">Baja</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input 
                        placeholder="Título del hallazgo"
                        value={newFinding.title}
                        onChange={(e) => setNewFinding({...newFinding, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea 
                        placeholder="Descripción detallada del hallazgo"
                        value={newFinding.description}
                        onChange={(e) => setNewFinding({...newFinding, description: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="area">Área/Departamento</Label>
                        <Input 
                          placeholder="Área afectada"
                          value={newFinding.area_department}
                          onChange={(e) => setNewFinding({...newFinding, area_department: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="responsible">Responsable</Label>
                        <Input 
                          placeholder="Persona responsable"
                          value={newFinding.responsible_person}
                          onChange={(e) => setNewFinding({...newFinding, responsible_person: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button onClick={createFinding} className="w-full">
                      Registrar Hallazgo
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <BarChart3 className="h-6 w-6" />
                    Agregar KPI
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo KPI</DialogTitle>
                    <DialogDescription>
                      Configure una nueva métrica de desempeño
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="metric-name">Nombre de la Métrica</Label>
                      <Input 
                        placeholder="Ej: Tiempo de Recuperación Promedio"
                        value={newKPI.metric_name}
                        onChange={(e) => setNewKPI({...newKPI, metric_name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="metric-type">Tipo</Label>
                        <Select value={newKPI.metric_type} onValueChange={(value) => setNewKPI({...newKPI, metric_type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="availability">Disponibilidad</SelectItem>
                            <SelectItem value="recovery_time">Tiempo de Recuperación</SelectItem>
                            <SelectItem value="test_success">Éxito de Pruebas</SelectItem>
                            <SelectItem value="compliance">Cumplimiento</SelectItem>
                            <SelectItem value="training">Entrenamiento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unidad</Label>
                        <Select value={newKPI.measurement_unit} onValueChange={(value) => setNewKPI({...newKPI, measurement_unit: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Porcentaje</SelectItem>
                            <SelectItem value="hours">Horas</SelectItem>
                            <SelectItem value="days">Días</SelectItem>
                            <SelectItem value="count">Cantidad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="target">Valor Meta</Label>
                        <Input 
                          type="number"
                          value={newKPI.target_value}
                          onChange={(e) => setNewKPI({...newKPI, target_value: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="current">Valor Actual</Label>
                        <Input 
                          type="number"
                          value={newKPI.current_value}
                          onChange={(e) => setNewKPI({...newKPI, current_value: parseFloat(e.target.value)})}
                        />
                      </div>
                    </div>
                    <Button onClick={createKPI} className="w-full">
                      Agregar KPI
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setActiveTab('reviews')}>
                <Calendar className="h-6 w-6" />
                Programar Revisión
              </Button>
            </CardContent>
          </Card>

          {/* KPI Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de KPIs</CardTitle>
              <CardDescription>Estado actual de las métricas clave de desempeño</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {kpiMetrics.slice(0, 5).map((kpi) => (
                  <div key={kpi.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTrendIcon(kpi.trend)}
                      <div>
                        <p className="font-medium">{kpi.metric_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {kpi.current_value} / {kpi.target_value} {kpi.measurement_unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(kpi.current_value / kpi.target_value) * 100} 
                        className="w-20"
                      />
                      <Badge variant={kpi.status === 'on_track' ? 'default' : 'destructive'}>
                        {kpi.status === 'on_track' ? 'En Meta' : 'Fuera de Meta'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Findings Tab */}
        <TabsContent value="findings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Hallazgos</CardTitle>
              <CardDescription>
                Registre y gestione hallazgos, no conformidades y oportunidades de mejora
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar hallazgos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="open">Abiertos</SelectItem>
                    <SelectItem value="in_progress">En Progreso</SelectItem>
                    <SelectItem value="closed">Cerrados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFindings.map((finding) => (
                    <TableRow key={finding.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {finding.finding_type === 'non_conformity' ? 'No Conformidad' :
                           finding.finding_type === 'observation' ? 'Observación' : 'Oportunidad'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{finding.title}</TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(finding.severity)}>
                          {finding.severity === 'critical' ? 'Crítica' :
                           finding.severity === 'high' ? 'Alta' :
                           finding.severity === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(finding.status)}>
                          {finding.status === 'open' ? 'Abierto' :
                           finding.status === 'in_progress' ? 'En Progreso' : 'Cerrado'}
                        </Badge>
                      </TableCell>
                      <TableCell>{finding.area_department}</TableCell>
                      <TableCell>{finding.responsible_person}</TableCell>
                      <TableCell>{new Date(finding.identified_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
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

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marco Normativo y Cumplimiento</CardTitle>
              <CardDescription>
                Gestione el cumplimiento de marcos normativos y certificaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {frameworks.map((framework) => (
                  <Card key={framework.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{framework.framework_name}</CardTitle>
                        <Badge variant={framework.status === 'active' ? 'default' : 'secondary'}>
                          {framework.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      <CardDescription>Versión {framework.version}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Cumplimiento</span>
                            <span className="text-sm">{framework.compliance_level}%</span>
                          </div>
                          <Progress value={framework.compliance_level} />
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Organismo:</span>
                            <span>{framework.certifying_body}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Certificado:</span>
                            <span>{framework.certificate_number}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Vencimiento:</span>
                            <span>{new Date(framework.expiry_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Award className="h-4 w-4 mr-2" />
                            Certificado
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Add New Framework Card */}
                <Card className="border-dashed">
                  <CardContent className="flex items-center justify-center h-full min-h-[300px]">
                    <Button variant="outline" className="flex flex-col gap-2 h-20 px-8">
                      <Plus className="h-6 w-6" />
                      Agregar Marco Normativo
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* KPIs Tab */}
        <TabsContent value="kpis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Indicadores Clave de Desempeño</CardTitle>
              <CardDescription>
                Monitoree y gestione las métricas de desempeño del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpiMetrics.map((kpi) => (
                  <Card key={kpi.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{kpi.metric_name}</CardTitle>
                        {getTrendIcon(kpi.trend)}
                      </div>
                      <CardDescription>{kpi.metric_type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Progreso</span>
                            <span className="text-sm">
                              {kpi.current_value} / {kpi.target_value} {kpi.measurement_unit}
                            </span>
                          </div>
                          <Progress value={(kpi.current_value / kpi.target_value) * 100} />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Badge variant={kpi.status === 'on_track' ? 'default' : 'destructive'}>
                            {kpi.status === 'on_track' ? 'En Meta' : 'Fuera de Meta'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {kpi.measurement_period}
                          </span>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          Responsable: {kpi.responsible_person}
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Actualizar Valor
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revisiones por la Dirección</CardTitle>
              <CardDescription>
                Programe y gestione las revisiones periódicas del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Efectividad</TableHead>
                    <TableHead>Cumplimiento</TableHead>
                    <TableHead>Incidentes</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {managementReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>{new Date(review.review_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {new Date(review.review_period_start).toLocaleDateString()} - {' '}
                        {new Date(review.review_period_end).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={review.review_status === 'completed' ? 'default' : 'secondary'}>
                          {review.review_status === 'completed' ? 'Completada' : 'Pendiente'}
                        </Badge>
                      </TableCell>
                      <TableCell>{review.system_effectiveness_rating}/10</TableCell>
                      <TableCell>{review.objectives_achievement_percentage}%</TableCell>
                      <TableCell>{review.incidents_count}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
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

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generación de Reportes</CardTitle>
              <CardDescription>
                Genere reportes automatizados del sistema de mejora continua
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reporte de Hallazgos</CardTitle>
                    <CardDescription>
                      Informe detallado de hallazgos y no conformidades
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generar PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reporte de Cumplimiento</CardTitle>
                    <CardDescription>
                      Estado de cumplimiento normativo y certificaciones
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generar PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dashboard Ejecutivo</CardTitle>
                    <CardDescription>
                      Resumen ejecutivo de métricas y KPIs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generar PDF
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
                </TabsContent>
              </Tabs>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MantenimientoMejora;
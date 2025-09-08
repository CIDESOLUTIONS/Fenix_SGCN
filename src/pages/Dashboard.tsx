import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Shield, 
  FileCheck, 
  TestTube,
  TrendingUp,
  AlertTriangle,
  Building,
  Users,
  Clock,
  CheckCircle,
  LogOut
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface UserProfile {
  full_name: string;
  company_name: string;
  position: string;
  phone: string;
}

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, company_name, position, phone')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setUserProfile(data);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Sample data for charts
  const criticalProcessData = [
    { name: 'Finanzas', hours: 120 },
    { name: 'IT', hours: 80 },
    { name: 'Operaciones', hours: 96 },
    { name: 'RRHH', hours: 72 },
    { name: 'Comercial', hours: 88 },
    { name: 'Legal', hours: 24 },
  ];

  const riskMatrixData = [
    { x: 2, y: 4, impact: 'Alto', probability: 'Media', risk: 'Sistemas IT' },
    { x: 4, y: 3, impact: 'Alto', probability: 'Alta', risk: 'Ciberseguridad' },
    { x: 1, y: 2, impact: 'Bajo', probability: 'Baja', risk: 'Personal' },
    { x: 3, y: 5, impact: 'Medio', probability: 'Alta', risk: 'Proveedores' },
  ];

  const chartConfig = {
    hours: {
      label: "Horas RTO",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4 lg:px-6">
              <SidebarTrigger className="mr-4" />
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold text-foreground">Fenix SGCN</h1>
                  <Badge variant="outline" className="text-xs">
                    Sistema Activo
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{userProfile?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{userProfile?.company_name}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              {/* Welcome Section */}
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Bienvenido, {userProfile?.full_name?.split(' ')[0]}
                </h2>
                <p className="text-muted-foreground">
                  Vista consolidada del estado del Sistema de Gestión de Continuidad del Negocio.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Procesos Críticos</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">12</div>
                    <p className="text-xs text-muted-foreground">
                      Identificados en el BIA
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Riesgos Altos/Críticos</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">5</div>
                    <p className="text-xs text-muted-foreground">
                      Antes de tratamiento
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Planes Desarrollados</CardTitle>
                    <FileCheck className="h-4 w-4 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-secondary">8</div>
                    <p className="text-xs text-muted-foreground">
                      Pendiente de aprobación
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Última Prueba</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">15/11/25</div>
                    <p className="text-xs text-muted-foreground">
                      Próxima: 28/02/26
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Criticidad de Procesos por RTO</CardTitle>
                    <CardDescription>
                      Tiempo objetivo de recuperación por área
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={criticalProcessData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="hours" fill="hsl(var(--primary))" radius={4} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Matriz de Riesgos (Residual)</CardTitle>
                    <CardDescription>
                      Probabilidad vs Impacto
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart data={riskMatrixData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            type="number" 
                            dataKey="x" 
                            domain={[0, 6]} 
                            ticks={[1, 2, 3, 4, 5]}
                            tick={{ fontSize: 12 }}
                            label={{ value: 'Probabilidad', position: 'insideBottom', offset: -5 }}
                          />
                          <YAxis 
                            type="number" 
                            dataKey="y" 
                            domain={[0, 6]} 
                            ticks={[1, 2, 3, 4, 5]}
                            tick={{ fontSize: 12 }}
                            label={{ value: 'Impacto', angle: -90, position: 'insideLeft' }}
                          />
                          <ChartTooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-background border rounded-lg p-3 shadow-lg">
                                    <p className="font-medium">{data.risk}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {data.impact} impacto, {data.probability} probabilidad
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Scatter dataKey="y">
                            {riskMatrixData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={
                                  entry.x * entry.y >= 12 ? "hsl(var(--destructive))" :
                                  entry.x * entry.y >= 6 ? "#f59e0b" : "hsl(var(--secondary))"
                                } 
                              />
                            ))}
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Modules Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Módulos del Sistema</CardTitle>
                  <CardDescription>
                    Acceso rápido a las funcionalidades principales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary/20"
                      onClick={() => navigate('/planeacion')}
                    >
                      <FileCheck className="h-6 w-6 text-primary" />
                      <div className="text-center">
                        <div className="font-medium text-sm">Planeación</div>
                        <div className="text-xs text-muted-foreground">RACI y Procesos Críticos</div>
                      </div>
                    </Button>

                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col gap-2 hover:bg-destructive/5 hover:border-destructive/20"
                      onClick={() => navigate('/risk-analysis')}
                    >
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                      <div className="text-center">
                        <div className="font-medium text-sm">Análisis de Riesgos</div>
                        <div className="text-xs text-muted-foreground">AR de Continuidad</div>
                      </div>
                    </Button>

                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col gap-2 hover:bg-accent/5 hover:border-accent/20"
                      onClick={() => navigate('/bia')}
                    >
                      <BarChart3 className="h-6 w-6 text-accent" />
                      <div className="text-center">
                        <div className="font-medium text-sm">BIA</div>
                        <div className="text-xs text-muted-foreground">Análisis de Impacto al Negocio</div>
                      </div>
                    </Button>

                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col gap-2 hover:bg-secondary/5 hover:border-secondary/20"
                      onClick={() => navigate('/estrategias')}
                    >
                      <TrendingUp className="h-6 w-6 text-secondary" />
                      <div className="text-center">
                        <div className="font-medium text-sm">Estrategias</div>
                        <div className="text-xs text-muted-foreground">Selección de Continuidad</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
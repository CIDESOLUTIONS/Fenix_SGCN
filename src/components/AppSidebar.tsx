import { 
  Home, 
  FileText, 
  AlertTriangle, 
  BarChart3, 
  TrendingUp,
  Target,
  Shield,
  Settings,
  TestTube,
  Users,
  Building,
  Clipboard
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useSettings();

  // Dashboard - Primera opción
  const dashboardItems = [
    { title: t('sidebar.dashboard'), url: "/dashboard", icon: Home },
  ];

  // Módulos SGCN - Basados en la landing page
  const sgcnModules = [
    { title: `1. ${t('sidebar.planeacion')}`, url: "/planeacion", icon: FileText },
    { title: `2. ${t('sidebar.risk_analysis')}`, url: "/risk-analysis", icon: AlertTriangle },
    { title: `3. ${t('sidebar.bia')}`, url: "/business-impact-analysis", icon: BarChart3 },
    { title: `4. ${t('sidebar.strategies')}`, url: "/continuity-strategies", icon: TrendingUp },
    { title: `5. ${t('sidebar.plans')}`, url: "/plans", icon: Shield },
    { title: `6. ${t('sidebar.tests')}`, url: "/pruebas", icon: TestTube },
    { title: `7. ${t('sidebar.maintenance')}`, url: "/mantenimiento-mejora", icon: Users },
  ];

  // Herramientas auxiliares
  const auxiliaryItems = [
    { title: t('sidebar.criteria'), url: "/strategy-criteria", icon: Target },
  ];

  // Configuración - Última opción
  const configItems = [
    { title: t('sidebar.settings'), url: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  const collapsed = state === "collapsed";

  const renderMenuItems = (items: typeof dashboardItems) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <NavLink to={item.url} end className={getNavCls}>
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-sidebar-foreground">SGCN</h2>
              <p className="text-xs text-sidebar-foreground/70">Sistema de Gestión</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Dashboard - Primera sección */}
        <SidebarGroup>
          <SidebarGroupContent>
            {renderMenuItems(dashboardItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Módulos SGCN - Sección principal */}
        <SidebarGroup>
          <SidebarGroupLabel>{t('dashboard.modules')}</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(sgcnModules)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Herramientas auxiliares */}
        <SidebarGroup>
          <SidebarGroupLabel>Herramientas</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(auxiliaryItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuración - Última sección */}
        <SidebarGroup>
          <SidebarGroupContent>
            {renderMenuItems(configItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
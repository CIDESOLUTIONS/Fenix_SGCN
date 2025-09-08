import { 
  Home, 
  FileText, 
  AlertTriangle, 
  BarChart3, 
  TrendingUp,
  Shield,
  Settings,
  TestTube,
  Users,
  Building,
  Clipboard
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

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

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
];

const gestionItems = [
  { title: "Planeación", url: "/planeacion", icon: FileText },
  { title: "Análisis de Riesgos", url: "/risk-analysis", icon: AlertTriangle },
  { title: "Análisis de Impacto (BIA)", url: "/business-impact-analysis", icon: BarChart3 },
  { title: "Estrategias de Continuidad", url: "/estrategias", icon: TrendingUp },
];

const planesItems = [
  { title: "Planes de Continuidad", url: "/planes-continuidad", icon: Shield },
  { title: "Planes IRP", url: "/planes-irp", icon: Building },
  { title: "Planes DRP", url: "/planes-drp", icon: Settings },
  { title: "Planes BCP", url: "/planes-bcp", icon: Clipboard },
];

const validacionItems = [
  { title: "Pruebas de Continuidad", url: "/pruebas", icon: TestTube },
  { title: "Configuración", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  const collapsed = state === "collapsed";

  const renderMenuItems = (items: typeof mainItems) => (
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
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(mainItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Gestión</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(gestionItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Planes</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(planesItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Validación</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(validacionItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
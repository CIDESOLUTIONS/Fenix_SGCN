import { SidebarTrigger } from "@/components/ui/sidebar";
import SettingsDropdown from "@/components/SettingsDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import phoenixLogo from "@/assets/phoenix-logo.png";

const AppHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center space-x-3">
            <img src={phoenixLogo} alt="Fenix" className="h-6 w-6" />
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                Fenix-SGCN
              </span>
              <span className="text-xs text-muted-foreground">by CIDE SAS</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SettingsDropdown />
          
          {user && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
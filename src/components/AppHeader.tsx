import { SidebarTrigger } from "@/components/ui/sidebar";
import SettingsDropdown from "@/components/SettingsDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import phoenixLogo from "@/assets/phoenix-logo.png";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  company_name: string;
  full_name: string;
}

const AppHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('company_name, full_name')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

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
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center space-x-3">
            <img src={phoenixLogo} alt="Fenix" className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                Fenix-SGCN
              </span>
              {userProfile?.company_name && (
                <span className="text-xs text-muted-foreground font-medium">
                  {userProfile.company_name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SettingsDropdown />
          
          {user && userProfile && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50 border">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{userProfile.full_name || user.email}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
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
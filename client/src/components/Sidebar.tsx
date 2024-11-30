import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, BarChart2, Settings, LogOut } from "lucide-react";
import { useUser } from "../hooks/use-user";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  currentView: "home" | "monthly" | "settings";
  onViewChange: (view: "home" | "monthly" | "settings") => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { logout } = useUser();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out",
      });
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-card border-r">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">Honor Gold</h1>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        <Button
          variant={currentView === "home" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("home")}
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>

        <Button
          variant={currentView === "monthly" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("monthly")}
        >
          <BarChart2 className="mr-2 h-4 w-4" />
          Monthly Stats
        </Button>

        <Button
          variant={currentView === "settings" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

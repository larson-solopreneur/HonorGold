import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Timer } from "../components/Timer";
import { Calendar } from "../components/Calendar";
import { Statistics } from "../components/Statistics";

export default function HomePage() {
  const [view, setView] = useState<"home" | "monthly" | "settings">("home");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentView={view} onViewChange={setView} />
      
      <main className="flex-1 p-6">
        {view === "home" && (
          <div className="space-y-8">
            <Timer />
            <Calendar />
          </div>
        )}
        
        {view === "monthly" && (
          <Statistics />
        )}
        
        {view === "settings" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Settings</h2>
            {/* Settings content here */}
          </div>
        )}
      </main>
    </div>
  );
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { Settings } from "./pages/Settings";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Navigation } from "./components/Navigation";

// ホームページのコンポーネント
function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Welcome to Honor Gold</h1>
    </div>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navigation />
          <main className="pt-4">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/settings" component={Settings} />
            </Switch>
          </main>
          <Toaster />
        </div>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
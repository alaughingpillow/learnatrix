import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreateTest } from "@/pages/admin/CreateTest";
import { Dashboard } from "@/pages/admin/Dashboard";
import { Test } from "@/pages/Test";
import { Tests } from "@/pages/Tests";
import { Results } from "@/pages/Results";
import { Login } from "@/pages/Login";
import { Profile } from "@/pages/Profile";
import { Learning } from "@/pages/Learning";
import { FAQ } from "@/pages/FAQ";
import { Privacy } from "@/pages/Privacy";
import Index from "@/pages/Index";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route
              path="/*"
              element={
                <>
                  <Navigation />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/tests" element={<Tests />} />
                    <Route path="/test/:id" element={<Test />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/learning" element={<Learning />} />
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/create-test" element={<CreateTest />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<Privacy />} />
                  </Routes>
                </>
              }
            />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
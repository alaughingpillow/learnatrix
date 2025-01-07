import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AdminLayout } from "@/components/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import { CreateTest } from "@/pages/admin/CreateTest";
import { Home } from "@/pages/Home";
import { Tests } from "@/pages/Tests";
import { Test } from "@/pages/Test";
import { Results } from "@/pages/Results";
import { Login } from "@/pages/Login";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/test/:id" element={<Test />} />
          <Route path="/results" element={<Results />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tests/new" element={<CreateTest />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
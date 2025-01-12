import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Login } from "@/pages/Login";
import { Tests } from "@/pages/Tests";
import { Profile } from "@/pages/Profile";
import { Home } from "@/pages/Home";
import { Test } from "@/pages/Test";
import { Results } from "@/pages/Results";
import { Learning } from "@/pages/Learning";
import { AdminLayout } from "@/components/AdminLayout";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/test/:id" element={<Test />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/results" element={<Results />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/admin/*" element={<AdminLayout />} />
          </Routes>
          <Toaster />
        </Router>
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
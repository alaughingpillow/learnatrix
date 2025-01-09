import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Login } from "@/pages/Login";
import { Tests } from "@/pages/Tests";
import { Profile } from "@/pages/Profile";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
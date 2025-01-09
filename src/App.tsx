import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Login } from "@/pages/Login";
import { Tests } from "@/pages/Tests";
import { Profile } from "@/pages/Profile";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
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
  );
}

export default App;
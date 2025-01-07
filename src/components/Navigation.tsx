import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        setIsAdmin(profile?.role === "admin");
      }
    };

    checkAdminStatus();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-[#3B82F6]">TestPro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link to="/tests" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
              Tests
            </Link>
            <Link to="/results" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
              Results
            </Link>
            {isAdmin && (
              <Link to="/admin/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Admin
              </Link>
            )}
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="text-white border-white hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/tests"
              className="block px-3 py-2 text-gray-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Tests
            </Link>
            <Link
              to="/results"
              className="block px-3 py-2 text-gray-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Results
            </Link>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="block px-3 py-2 text-gray-300 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
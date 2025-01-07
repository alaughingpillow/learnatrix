import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Brain, ChartBar, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const Home = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/tests");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-20">
          <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
            <span className="block">Welcome to</span>
            <span className="block text-[#3B82F6]">TestPro</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Hone your pentesting skills with cutting-edge AI-powered tools.
            Enhance your understanding, master advanced AI mathematics, and push the limits of your cybersecurity capabilities.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#3B82F6] hover:bg-[#2563EB]"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="p-6 rounded-lg bg-[#1E293B]">
              <div className="flex items-center mb-4">
                <Brain className="h-6 w-6 text-[#3B82F6] mr-2" />
                <h3 className="text-lg font-medium">AI-Driven Insights</h3>
              </div>
              <p className="text-gray-300">
                Your data is analyzed to train our AI systems, enhancing your learning experience with personalized feedback.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-[#1E293B]">
              <div className="flex items-center mb-4">
                <ChartBar className="h-6 w-6 text-[#3B82F6] mr-2" />
                <h3 className="text-lg font-medium">Advanced AI Mathematics</h3>
              </div>
              <p className="text-gray-300">
                Unlock the potential of AI with deep learning algorithms and advanced mathematical concepts.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-[#1E293B]">
              <div className="flex items-center mb-4">
                <Sparkles className="h-6 w-6 text-[#3B82F6] mr-2" />
                <h3 className="text-lg font-medium">Futuristic Learning</h3>
              </div>
              <p className="text-gray-300">
                Engage in a seamless blend of AI and hands-on practice, designed to prepare you for the future of cybersecurity.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="py-8 text-center">
          <div className="space-x-4">
            <Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link>
            <span className="text-gray-600">|</span>
            <Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </main>
    </div>
  );
};
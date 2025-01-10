import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Home = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <main className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Welcome to
            <span className="block text-[#4785FF] mt-2">TestPro</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            Hone your pentesting skills with cutting-edge AI-powered tools. Enhance your
            understanding, master advanced AI mathematics, and push the limits of your
            cybersecurity capabilities.
          </p>

          <Link to="/tests">
            <Button className="bg-[#4785FF] hover:bg-[#3366CC] text-white px-8 py-6 text-lg rounded-lg transition-colors">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-[#1E293B] p-8 rounded-xl">
            <div className="text-[#4785FF] text-4xl mb-4">
              <span role="img" aria-label="brain">🧠</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">AI-Driven Insights</h3>
            <p className="text-gray-400">
              Your data is analyzed to train our AI systems, providing personalized feedback
              and improvement suggestions.
            </p>
          </div>

          <div className="bg-[#1E293B] p-8 rounded-xl">
            <div className="text-[#4785FF] text-4xl mb-4">
              <span role="img" aria-label="math">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Advanced AI Mathematics</h3>
            <p className="text-gray-400">
              Unlock the potential of AI with deep learning algorithms and mathematical
              concepts.
            </p>
          </div>

          <div className="bg-[#1E293B] p-8 rounded-xl">
            <div className="text-[#4785FF] text-4xl mb-4">
              <span role="img" aria-label="future">🚀</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Futuristic Learning</h3>
            <p className="text-gray-400">
              Engage in a seamless blend of AI and hands-on practice to master complex
              security concepts.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
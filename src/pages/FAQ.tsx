import { Navigation } from "@/components/Navigation";

export const FAQ = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          <div className="bg-[#1E293B] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">What is TestPro?</h2>
            <p className="text-gray-300">
              TestPro is a specialized platform designed for a small group of users to practice and improve their typing and knowledge through various tests.
            </p>
          </div>

          <div className="bg-[#1E293B] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">How do I start taking tests?</h2>
            <p className="text-gray-300">
              Simply sign up, choose your preferred test category, and begin practicing. Our platform offers both typing tests and multiple-choice questions.
            </p>
          </div>

          <div className="bg-[#1E293B] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Is my data secure?</h2>
            <p className="text-gray-300">
              While we maintain basic security measures, this platform is designed for a small user base and primarily focuses on providing a seamless testing experience rather than extensive data protection.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
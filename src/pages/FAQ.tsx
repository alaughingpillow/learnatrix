export const FAQ = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="bg-[#1E293B] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-[#4785FF]">What is TestPro?</h2>
            <p className="text-gray-300">
              TestPro is an AI-powered platform designed to help users improve their typing skills and prepare for various exams through interactive tests and personalized feedback.
            </p>
          </div>

          <div className="bg-[#1E293B] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-[#4785FF]">How does the scoring system work?</h2>
            <p className="text-gray-300">
              Our scoring system takes into account both speed (WPM - Words Per Minute) and accuracy. The final score is calculated based on these metrics to give you a comprehensive assessment of your performance.
            </p>
          </div>

          <div className="bg-[#1E293B] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-[#4785FF]">Can I track my progress?</h2>
            <p className="text-gray-300">
              Yes! TestPro provides detailed analytics and progress tracking. You can view your performance history, identify areas for improvement, and track your progress over time through your results page.
            </p>
          </div>

          <div className="bg-[#1E293B] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-[#4785FF]">Is there an AI assistant available?</h2>
            <p className="text-gray-300">
              Yes, we have integrated an AI-powered chatbot using Google's Gemini API. You can access it through the Learning page to get help with your questions and receive personalized guidance.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
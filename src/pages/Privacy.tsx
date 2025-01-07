import { Navigation } from "@/components/Navigation";

export const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <div className="bg-[#1E293B] p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Simple Privacy Policy</h2>
            <p className="text-gray-300 mb-4">
              This is a small-scale testing platform designed for a limited user base. We keep things simple and straightforward.
            </p>
            <p className="text-gray-300 mb-4">
              We collect basic information like:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Your email (for login)</li>
              <li>Test results and progress</li>
              <li>Basic usage statistics</li>
            </ul>
            <p className="text-gray-300">
              This data is used solely for providing you with test results and tracking your progress. We don't share your data with third parties or use it for marketing purposes.
            </p>
          </div>

          <div className="bg-[#1E293B] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Contact</h2>
            <p className="text-gray-300">
              If you have any questions about this privacy policy or your data, please contact the administrator through the platform.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
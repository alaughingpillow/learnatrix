import { Navigation } from "@/components/Navigation";

export const Results = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Results</h1>
        <p className="text-gray-600">
          Your test results will appear here.
        </p>
      </main>
    </div>
  );
};
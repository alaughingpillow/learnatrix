import { Navigation } from "@/components/Navigation";
import { TestCard } from "@/components/TestCard";

export const Tests = () => {
  const SAMPLE_TESTS = [
    {
      id: "1",
      title: "Basic Mathematics",
      description: "Test your knowledge of basic mathematical concepts including arithmetic and algebra.",
      duration: 30,
      participants: 1500,
      category: "Mathematics",
    },
    {
      id: "2",
      title: "Advanced Typing",
      description: "Challenge your typing speed and accuracy with this comprehensive typing test.",
      duration: 15,
      participants: 2300,
      category: "Typing",
    },
    {
      id: "3",
      title: "English Grammar",
      description: "Evaluate your understanding of English grammar rules and usage.",
      duration: 45,
      participants: 1800,
      category: "English",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Tests</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_TESTS.map((test) => (
            <TestCard key={test.id} {...test} />
          ))}
        </div>
      </main>
    </div>
  );
};
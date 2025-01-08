import { Navigation } from "@/components/Navigation";
import { TestCard } from "@/components/TestCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const Tests = () => {
  const { data: tests, isLoading } = useQuery({
    queryKey: ["tests"],
    queryFn: async () => {
      console.log("Fetching tests...");
      const { data, error } = await supabase
        .from("tests")
        .select(`
          *,
          test_categories (
            name
          )
        `)
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tests:", error);
        throw error;
      }

      console.log("Fetched tests:", data);
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 to-blue-50/50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent mb-8 animate-fade-in">
          Available Tests
        </h1>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : tests && tests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div key={test.id} className="animate-fade-in">
                <TestCard
                  id={test.id}
                  title={test.title}
                  description={test.description || ""}
                  duration={test.duration}
                  participants={0}
                  category={test.test_categories?.name || "Uncategorized"}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8 animate-fade-in">
            No tests available at the moment.
          </p>
        )}
      </main>
    </div>
  );
};
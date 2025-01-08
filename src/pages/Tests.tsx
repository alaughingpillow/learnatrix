import { Navigation } from "@/components/Navigation";
import { TestCard } from "@/components/TestCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Tests = () => {
  // Fetch all categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      console.log("Fetching categories...");
      const { data, error } = await supabase
        .from("test_categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }

      console.log("Fetched categories:", data);
      return data;
    },
  });

  // Fetch all published tests with their categories
  const { data: tests, isLoading: testsLoading } = useQuery({
    queryKey: ["tests"],
    queryFn: async () => {
      console.log("Fetching tests...");
      const { data, error } = await supabase
        .from("tests")
        .select(`
          *,
          test_categories (
            name,
            id
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

  const isLoading = categoriesLoading || testsLoading;

  // Group tests by category
  const testsByCategory = tests?.reduce((acc, test) => {
    const categoryId = test.category_id || "uncategorized";
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(test);
    return acc;
  }, {} as Record<string, typeof tests>);

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
        ) : categories && categories.length > 0 ? (
          <Tabs defaultValue={categories[0]?.id} className="w-full">
            <TabsList className="w-full flex flex-wrap justify-start mb-6 bg-purple-50/50 p-1 rounded-lg">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="px-4 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm rounded-md"
                >
                  {category.name}
                </TabsTrigger>
              ))}
              <TabsTrigger
                value="uncategorized"
                className="px-4 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-sm rounded-md"
              >
                Uncategorized
              </TabsTrigger>
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testsByCategory?.[category.id]?.map((test) => (
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
                  {(!testsByCategory?.[category.id] || testsByCategory[category.id].length === 0) && (
                    <p className="col-span-full text-center text-gray-500 py-8">
                      No tests available in this category.
                    </p>
                  )}
                </div>
              </TabsContent>
            ))}

            <TabsContent value="uncategorized">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testsByCategory?.["uncategorized"]?.map((test) => (
                  <div key={test.id} className="animate-fade-in">
                    <TestCard
                      id={test.id}
                      title={test.title}
                      description={test.description || ""}
                      duration={test.duration}
                      participants={0}
                      category="Uncategorized"
                    />
                  </div>
                ))}
                {(!testsByCategory?.["uncategorized"] || testsByCategory["uncategorized"].length === 0) && (
                  <p className="col-span-full text-center text-gray-500 py-8">
                    No uncategorized tests available.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <p className="text-center text-gray-500 mt-8 animate-fade-in">
            No tests available at the moment.
          </p>
        )}
      </main>
    </div>
  );
};
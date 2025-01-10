import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TestCard } from "@/components/TestCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export const Tests = () => {
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("test_categories")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: tests, isLoading: loadingTests } = useQuery({
    queryKey: ["tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tests")
        .select(`
          *,
          test_categories (
            name
          )
        `)
        .eq("published", true);
      if (error) throw error;
      return data;
    },
  });

  if (loadingCategories || loadingTests) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Available Tests</h1>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-[200px] w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Available Tests</h1>
      
      <Tabs defaultValue={categories?.[0]?.name || "all"} className="w-full">
        <TabsList className="w-full justify-start mb-8 bg-background border-b rounded-none h-auto flex-wrap">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary/10">
            All Tests
          </TabsTrigger>
          {categories?.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.name}
              className="data-[state=active]:bg-primary/10"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests?.map((test) => (
              <TestCard
                key={test.id}
                id={test.id}
                title={test.title}
                description={test.description}
                duration={test.duration}
                test_type={test.test_type}
                test_categories={test.test_categories}
              />
            ))}
          </div>
        </TabsContent>

        {categories?.map((category) => (
          <TabsContent key={category.id} value={category.name} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests
                ?.filter((test) => test.test_categories?.name === category.name)
                .map((test) => (
                  <TestCard
                    key={test.id}
                    id={test.id}
                    title={test.title}
                    description={test.description}
                    duration={test.duration}
                    test_type={test.test_type}
                    test_categories={test.test_categories}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ResultCard } from "@/components/results/ResultCard";
import { ResultDetails } from "@/components/results/ResultDetails";
import { TestResult, Question } from "@/types/results";

export const Results = () => {
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("test_categories")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: results, isLoading } = useQuery({
    queryKey: ["test-results"],
    queryFn: async () => {
      console.log("Fetching test results...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No user found");
        return [];
      }

      const { data, error } = await supabase
        .from("test_results")
        .select(`
          *,
          test:tests (
            title,
            test_type,
            content,
            category_id
          )
        `)
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (error) {
        console.error("Error fetching results:", error);
        throw error;
      }

      console.log("Fetched results:", data);
      return data as TestResult[];
    },
  });

  const fetchQuestions = async (testId: string) => {
    const { data, error } = await supabase
      .from("questions")
      .select(`
        *,
        question_options (*)
      `)
      .eq("test_id", testId);

    if (error) {
      console.error("Error fetching questions:", error);
      return;
    }

    setQuestions(data);
  };

  const handleViewDetails = async (resultId: string, testId: string) => {
    if (selectedResult === resultId) {
      setSelectedResult(null);
      setQuestions([]);
    } else {
      setSelectedResult(resultId);
      await fetchQuestions(testId);
    }
  };

  const getSelectedResultData = () => {
    return results?.find(result => result.id === selectedResult);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Your Results</h1>
        
        {results && results.length > 0 ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full justify-start mb-8 bg-background border-b rounded-none h-auto flex-wrap">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary/10">
                All Results
              </TabsTrigger>
              {categories?.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-primary/10"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {results.map((result) => (
                    <ResultCard
                      key={result.id}
                      result={result}
                      isSelected={selectedResult === result.id}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
                {selectedResult && (
                  <div className="lg:sticky lg:top-8">
                    <ResultDetails
                      result={getSelectedResultData()!}
                      questions={questions}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            {categories?.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    {results
                      .filter((result) => result.test?.category_id === category.id)
                      .map((result) => (
                        <ResultCard
                          key={result.id}
                          result={result}
                          isSelected={selectedResult === result.id}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                  </div>
                  {selectedResult && (
                    <div className="lg:sticky lg:top-8">
                      <ResultDetails
                        result={getSelectedResultData()!}
                        questions={questions}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-muted-foreground">
                You haven't completed any tests yet.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};
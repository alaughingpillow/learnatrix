import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TestResult {
  id: string;
  test_id: string;
  wpm: number;
  accuracy: number;
  completed_at: string;
  raw_data: any;
  test: {
    title: string;
    test_type: string;
  };
}

export const Results = () => {
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
            test_type
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Results</h1>
        
        {results && results.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result) => (
              <Card key={result.id}>
                <CardHeader>
                  <CardTitle>{result.test?.title || "Untitled Test"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Completed: {new Date(result.completed_at).toLocaleDateString()}
                    </p>
                    {result.test?.test_type === "typing" ? (
                      <>
                        <p className="font-medium">WPM: {result.wpm}</p>
                        <p className="font-medium">
                          Accuracy: {result.accuracy.toFixed(2)}%
                        </p>
                      </>
                    ) : (
                      <p className="font-medium">
                        Score: {result.accuracy.toFixed(2)}%
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            You haven't completed any tests yet.
          </p>
        )}
      </main>
    </div>
  );
};
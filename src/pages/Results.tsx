import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    content?: string;
  };
}

interface Question {
  id: string;
  question_text: string;
  image_url?: string;
  question_options: {
    id: string;
    option_text: string;
    is_correct: boolean;
    explanation?: string;
  }[];
}

export const Results = () => {
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

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
            content
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
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((result) => (
                <Card key={result.id} className="transition-all duration-200 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">{result.test?.title || "Untitled Test"}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(result.completed_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.test?.test_type === "typing" ? (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">WPM</span>
                            <span className="font-medium">{result.wpm}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Accuracy</span>
                            <span className="font-medium">{result.accuracy.toFixed(2)}%</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Score</span>
                          <span className="font-medium">{result.accuracy.toFixed(2)}%</span>
                        </div>
                      )}
                      <Button 
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => handleViewDetails(result.id, result.test_id)}
                      >
                        {selectedResult === result.id ? (
                          <>
                            Hide Details
                            <ChevronUp className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            View Details
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedResult && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Detailed Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] rounded-md border p-4">
                    {(() => {
                      const result = results.find(r => r.id === selectedResult);
                      if (!result) return null;

                      return result.test?.test_type === "typing" ? (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Typing Test Results</h3>
                          <div className="bg-muted p-4 rounded-lg">
                            {result.test.content?.split("").map((char, index) => {
                              const typedChar = result.raw_data?.[index];
                              const isCorrect = typedChar === char;
                              const className = typedChar
                                ? isCorrect
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                                : "text-muted-foreground";
                              return (
                                <span key={index} className={className}>
                                  {char}
                                </span>
                              );
                            })}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted p-4 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">WPM</p>
                              <p className="text-2xl font-bold">{result.wpm}</p>
                            </div>
                            <div className="bg-muted p-4 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                              <p className="text-2xl font-bold">{result.accuracy.toFixed(2)}%</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        questions.map((question, index) => {
                          const selectedAnswer = result.raw_data?.[question.id];
                          const selectedOption = question.question_options.find(
                            opt => opt.id === selectedAnswer
                          );
                          const correctOption = question.question_options.find(
                            opt => opt.is_correct
                          );

                          return (
                            <div key={question.id} className="mb-6 p-4 border rounded-lg">
                              <h3 className="text-lg font-medium mb-2">
                                Question {index + 1}: {question.question_text}
                              </h3>
                              {question.image_url && (
                                <img
                                  src={question.image_url}
                                  alt="Question"
                                  className="mb-4 max-w-full h-auto rounded-lg"
                                />
                              )}
                              <div className="space-y-2">
                                {question.question_options.map((option) => (
                                  <div
                                    key={option.id}
                                    className={`p-3 rounded-lg ${
                                      option.is_correct
                                        ? "bg-green-100 dark:bg-green-900/20 border-green-500"
                                        : option.id === selectedAnswer && !option.is_correct
                                        ? "bg-red-100 dark:bg-red-900/20 border-red-500"
                                        : "bg-muted"
                                    } border`}
                                  >
                                    <div className="flex items-center">
                                      {option.is_correct ? (
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                      ) : option.id === selectedAnswer && !option.is_correct ? (
                                        <X className="h-5 w-5 text-red-500 mr-2" />
                                      ) : null}
                                      <span>{option.option_text}</span>
                                    </div>
                                    {option.is_correct && option.explanation && (
                                      <p className="text-sm text-green-600 dark:text-green-400 mt-2 pl-7">
                                        <strong>Explanation:</strong> {option.explanation}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      );
                    })()}
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
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
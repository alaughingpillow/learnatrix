import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

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
    setSelectedResult(resultId);
    await fetchQuestions(testId);
  };

  const getSelectedResultData = () => {
    return results?.find(result => result.id === selectedResult);
  };

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

  const renderTypingTestResult = (result: TestResult) => {
    if (!result.test?.content) return null;

    const originalText = result.test.content;
    const typedText = result.raw_data as string;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Typing Test Results</h3>
        <div className="bg-white p-4 rounded-lg">
          {originalText.split("").map((char, index) => {
            const typedChar = typedText[index];
            const isCorrect = typedChar === char;
            const className = typedChar
              ? isCorrect
                ? "text-green-600"
                : "text-red-600"
              : "text-gray-400";
            return (
              <span key={index} className={className}>
                {char}
              </span>
            );
          })}
        </div>
        <div className="mt-4">
          <p className="font-medium">WPM: {result.wpm}</p>
          <p className="font-medium">Accuracy: {result.accuracy.toFixed(2)}%</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Results</h1>
        
        {results && results.length > 0 ? (
          <div className="space-y-6">
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
                      <Button 
                        variant="outline"
                        onClick={() => handleViewDetails(result.id, result.test_id)}
                      >
                        View Details
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
                  {(() => {
                    const result = results.find(r => r.id === selectedResult);
                    if (!result) return null;

                    return result.test?.test_type === "typing"
                      ? renderTypingTestResult(result)
                      : questions.map((question, index) => {
                          const selectedAnswer = getSelectedResultData()?.raw_data[question.id];
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
                                        ? "bg-green-100 border-green-500"
                                        : option.id === selectedAnswer && !option.is_correct
                                        ? "bg-red-100 border-red-500"
                                        : "bg-gray-50"
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
                                    {option.is_correct && (
                                      <p className="text-sm text-green-600 mt-2">
                                        This is the correct answer
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        });
                  })()}
                </CardContent>
              </Card>
            )}
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

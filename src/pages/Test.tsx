import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { TypingInput } from "@/components/typing/TypingInput";

export const Test = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Fetch test data
  const { data: test, isLoading: testLoading } = useQuery({
    queryKey: ["test", id],
    queryFn: async () => {
      console.log("Fetching test with id:", id);
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching test:", error);
        throw error;
      }

      console.log("Fetched test:", data);
      return data;
    },
  });

  // Fetch questions for MCQ tests
  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ["questions", id],
    enabled: test?.test_type === "mcq",
    queryFn: async () => {
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select(`
          id,
          question_text,
          image_url,
          question_options (
            id,
            option_text,
            is_correct
          )
        `)
        .eq("test_id", id);

      if (questionsError) throw questionsError;
      console.log("Fetched questions:", questionsData);
      return questionsData;
    },
  });

  useEffect(() => {
    if (test && isStarted) {
      setTimeLeft(test.duration);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [test, isStarted]);

  const handleTestComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save test results",
        variant: "destructive",
      });
      return;
    }

    // Calculate results based on test type
    let accuracy = 0;
    let wpm = 0;

    if (test?.test_type === "typing") {
      const words = typedText.trim().split(/\s+/).length;
      const minutes = test.duration / 60;
      wpm = Math.round(words / minutes);
      
      // Simple accuracy calculation
      const originalWords = test.content.trim().split(/\s+/);
      const typedWords = typedText.trim().split(/\s+/);
      let correctWords = 0;
      
      for (let i = 0; i < Math.min(originalWords.length, typedWords.length); i++) {
        if (originalWords[i] === typedWords[i]) correctWords++;
      }
      
      accuracy = (correctWords / originalWords.length) * 100;
    } else if (test?.test_type === "mcq" && questions) {
      let correctAnswers = 0;
      questions.forEach((question) => {
        const selectedOption = question.question_options.find(
          (opt) => opt.id === selectedAnswers[question.id]
        );
        if (selectedOption?.is_correct) correctAnswers++;
      });
      accuracy = (correctAnswers / questions.length) * 100;
    }

    try {
      // Check if a result already exists for this test
      const { data: existingResult, error: fetchError } = await supabase
        .from("test_results")
        .select("id")
        .eq("test_id", id)
        .eq("user_id", user.id)
        .maybeSingle(); // Changed from .single() to .maybeSingle()

      if (fetchError) {
        console.error("Error fetching existing result:", fetchError);
        throw fetchError;
      }

      if (existingResult) {
        // Update existing result
        const { error: updateError } = await supabase
          .from("test_results")
          .update({
            wpm,
            accuracy,
            raw_data: test?.test_type === "mcq" ? selectedAnswers : typedText,
            completed_at: new Date().toISOString(),
          })
          .eq("id", existingResult.id);

        if (updateError) throw updateError;
      } else {
        // Insert new result
        const { error: insertError } = await supabase
          .from("test_results")
          .insert({
            test_id: id,
            user_id: user.id,
            wpm,
            accuracy,
            raw_data: test?.test_type === "mcq" ? selectedAnswers : typedText,
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Test results saved successfully",
      });
    } catch (error) {
      console.error("Error saving results:", error);
      toast({
        title: "Error",
        description: "Failed to save test results",
        variant: "destructive",
      });
    }

    navigate(`/results`);
  };

  if (testLoading || (test?.test_type === "mcq" && questionsLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">Test not found</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {test.title}
            </CardTitle>
            <p className="text-gray-600 mt-2">{test.description}</p>
          </CardHeader>
          <CardContent>
            {!isStarted ? (
              <div className="text-center space-y-4">
                <p className="text-lg text-gray-700">
                  Duration: {Math.ceil(test.duration / 60)} minutes
                </p>
                <Button
                  onClick={() => setIsStarted(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Start Test
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">
                    Time Left: {Math.floor(timeLeft / 60)}:
                    {String(timeLeft % 60).padStart(2, "0")}
                  </span>
                  <Progress value={(timeLeft / test.duration) * 100} className="w-64" />
                </div>
                {test.test_type === "typing" ? (
                  <TypingInput
                    originalText={test.content}
                    typedText={typedText}
                    onChange={setTypedText}
                    onComplete={handleTestComplete}
                  />
                ) : (
                  <div className="space-y-6">
                    {questions?.map((question, index) => (
                      <div key={question.id} className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-4">
                          Question {index + 1}: {question.question_text}
                        </h3>
                        {question.image_url && (
                          <img
                            src={question.image_url}
                            alt="Question"
                            className="mb-4 max-w-full h-auto rounded-lg"
                          />
                        )}
                        <RadioGroup
                          value={selectedAnswers[question.id]}
                          onValueChange={(value) =>
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [question.id]: value,
                            }))
                          }
                        >
                          <div className="space-y-2">
                            {question.question_options.map((option) => (
                              <div key={option.id} className="flex items-center">
                                <RadioGroupItem
                                  value={option.id}
                                  id={option.id}
                                  className="mr-2"
                                />
                                <Label htmlFor={option.id}>{option.option_text}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>
                    ))}
                    <Button
                      onClick={handleTestComplete}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      Submit Test
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
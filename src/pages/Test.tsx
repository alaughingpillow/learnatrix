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
import { calculateAccuracy } from "@/utils/testUtils";

export const Test = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const { data: test, isLoading: testLoading } = useQuery({
    queryKey: ["test", id],
    queryFn: async () => {
      console.log("Fetching test with id:", id);
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .eq("id", id)
        .maybeSingle();

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

  const calculateMCQAccuracy = (questions: any[], answers: Record<string, string>) => {
    if (!questions.length) return 0;
    
    let correctCount = 0;
    let totalAnswered = 0;
    
    questions.forEach(question => {
      const selectedAnswer = answers[question.id];
      if (selectedAnswer) {
        totalAnswered++;
        const correctOption = question.question_options.find((opt: any) => opt.is_correct);
        if (selectedAnswer === correctOption?.id) {
          correctCount++;
        }
      }
    });
    
    // Only calculate accuracy based on answered questions
    return totalAnswered > 0 ? (correctCount / totalAnswered) * 100 : 0;
  };

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

    try {
      console.log("Saving test results...");
      
      // Check if a result already exists for this test and user
      const { data: existingResult, error: fetchError } = await supabase
        .from("test_results")
        .select("id")
        .eq("test_id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching existing result:", fetchError);
        throw fetchError;
      }

      const accuracy = test?.test_type === "typing" 
        ? calculateAccuracy(test.content, typedText)
        : calculateMCQAccuracy(questions || [], selectedAnswers);

      const wpm = test?.test_type === "typing" 
        ? Math.round((typedText.length / 5) / (test.duration / 60))
        : 0;

      const resultData = {
        test_id: id,
        user_id: user.id,
        wpm,
        accuracy,
        raw_data: test?.test_type === "mcq" ? selectedAnswers : typedText,
      };

      console.log("Result data to save:", resultData);

      let error;
      if (existingResult) {
        console.log("Updating existing result with ID:", existingResult.id);
        const { error: updateError } = await supabase
          .from("test_results")
          .update(resultData)
          .eq("id", existingResult.id);
        error = updateError;
      } else {
        console.log("Creating new result...");
        const { error: insertError } = await supabase
          .from("test_results")
          .insert([resultData]);
        error = insertError;
      }

      if (error) {
        console.error("Error saving result:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Test results saved successfully",
      });
      
      navigate("/results");
    } catch (error) {
      console.error("Error saving test results:", error);
      toast({
        title: "Error",
        description: "Failed to save test results. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (testLoading || (test?.test_type === "mcq" && questionsLoading)) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-primary/20 rounded w-1/4"></div>
            <div className="h-32 bg-primary/20 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Test not found</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {test.title}
            </CardTitle>
            <p className="text-muted-foreground mt-2">{test.description}</p>
          </CardHeader>
          <CardContent>
            {!isStarted ? (
              <div className="text-center space-y-4">
                <p className="text-lg">
                  Duration: {Math.ceil(test.duration / 60)} minutes
                </p>
                <Button
                  onClick={() => setIsStarted(true)}
                  className="bg-primary hover:bg-primary-600 text-primary-foreground"
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
                      <div key={question.id} className="bg-card p-6 rounded-lg shadow-sm border border-primary-300">
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
                      className="w-full bg-primary hover:bg-primary-600 text-primary-foreground"
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

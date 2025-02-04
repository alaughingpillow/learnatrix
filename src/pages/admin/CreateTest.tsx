import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TestTypeSelector } from "@/components/admin/TestTypeSelector";
import { MCQQuestionForm } from "@/components/admin/MCQQuestionForm";
import { TestForm } from "@/components/admin/TestForm";
import { useQuery } from "@tanstack/react-query";

interface MCQQuestion {
  questionText: string;
  imageUrl?: string;
  options: Array<{ text: string; isCorrect: boolean }>;
}

export const CreateTest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [testType, setTestType] = useState<"typing" | "mcq">("typing");
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);

  // Fetch categories using React Query
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
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

      console.log("Categories fetched:", data);
      return data || [];
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Checking auth status:", user);
      
      if (!user) {
        console.log("No user found, redirecting to login");
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      console.log("User profile:", profile);

      if (profile?.role !== "admin") {
        console.log("User is not admin, redirecting to home");
        navigate("/");
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: any) => {
    console.log("Submitting form with values:", values);
    setIsLoading(true);

    try {
      if (testType === "mcq" && questions.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one question for MCQ test.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Insert the test
      const { data: test, error: testError } = await supabase
        .from("tests")
        .insert([
          {
            title: values.title,
            description: values.description,
            content: testType === "typing" ? values.content : "",
            duration: values.duration * 60,
            category_id: values.category_id,
            test_type: testType,
            published: true,
          },
        ])
        .select()
        .single();

      if (testError) throw testError;

      // If it's an MCQ test, insert questions and options
      if (testType === "mcq") {
        for (const question of questions) {
          const { data: questionData, error: questionError } = await supabase
            .from("questions")
            .insert([
              {
                test_id: test.id,
                question_text: question.questionText,
                image_url: question.imageUrl,
              },
            ])
            .select()
            .single();

          if (questionError) throw questionError;

          const optionsToInsert = question.options.map((option) => ({
            question_id: questionData.id,
            option_text: option.text,
            is_correct: option.isCorrect,
          }));

          const { error: optionsError } = await supabase
            .from("question_options")
            .insert(optionsToInsert);

          if (optionsError) throw optionsError;
        }
      }

      toast({
        title: "Success",
        description: "Test created successfully.",
      });
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error creating test:", error);
      toast({
        title: "Error",
        description: "Failed to create test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (categoriesLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-red-500">Error loading categories. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Test</CardTitle>
          <CardDescription>
            Create a new {testType.toUpperCase()} test for students to practice
            with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TestTypeSelector
            selectedType={testType}
            onTypeSelect={setTestType}
          />

          <TestForm
            testType={testType}
            categories={categories}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />

          {testType === "mcq" && (
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Questions</h3>
                <Button
                  type="button"
                  onClick={addQuestion}
                  disabled={questions.length >= 30}
                >
                  Add Question
                </Button>
              </div>
              {questions.map((question, index) => (
                <MCQQuestionForm
                  key={index}
                  index={index}
                  question={question}
                  onQuestionChange={handleQuestionChange}
                  onRemoveQuestion={removeQuestion}
                />
              ))}
              {questions.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Click "Add Question" to start creating your MCQ test.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { TestTypeSelector } from "@/components/admin/TestTypeSelector";
import { TestForm } from "@/components/admin/TestForm";
import { TestHeader } from "@/components/admin/test-creation/TestHeader";
import { MCQSection } from "@/components/admin/test-creation/MCQSection";
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
    const checkAdmin = async () => {
      console.log("Checking admin status...");
      const { data: { user } } = await supabase.auth.getUser();
      
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

    checkAdmin();
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
        <TestHeader testType={testType} />
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
            <MCQSection
              questions={questions}
              onQuestionChange={handleQuestionChange}
              onRemoveQuestion={removeQuestion}
              onAddQuestion={addQuestion}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
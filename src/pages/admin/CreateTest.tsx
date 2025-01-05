import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { TestTypeSelector } from "@/components/admin/TestTypeSelector";
import { MCQQuestionForm } from "@/components/admin/MCQQuestionForm";

interface MCQQuestion {
  questionText: string;
  imageUrl?: string;
  options: Array<{ text: string; isCorrect: boolean }>;
}

export const CreateTest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [testType, setTestType] = useState<"typing" | "mcq">("typing");
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      content: "",
      duration: 60,
      category_id: "",
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

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("test_categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to load test categories.",
          variant: "destructive",
        });
      } else {
        console.log("Fetched categories:", data);
        setCategories(data || []);
      }
    };

    checkAuth();
    fetchCategories();
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
      // Insert the test
      const { data: test, error: testError } = await supabase
        .from("tests")
        .insert([
          {
            title: values.title,
            description: values.description,
            content: testType === "typing" ? values.content : null,
            duration: parseInt(values.duration),
            category_id: values.category_id,
            test_type: testType,
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter test title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter test description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {testType === "typing" ? (
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the text content for the typing test"
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="space-y-4">
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

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (seconds)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="30"
                        placeholder="Enter test duration"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        {...field}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category: any) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Test"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";

export const Test = () => {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const { data: test, isLoading } = useQuery({
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

  useEffect(() => {
    if (test && isStarted) {
      setTimeLeft(test.duration);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [test, isStarted]);

  if (isLoading) {
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
                </div>
                {test.test_type === "typing" ? (
                  <div className="bg-white p-6 rounded-lg shadow-inner">
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {test.content}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* MCQ questions will be implemented here */}
                    <p className="text-center text-gray-500">
                      MCQ questions loading...
                    </p>
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
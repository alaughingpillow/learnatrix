import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserResult {
  user: {
    id: string;
    email: string;
    profile: {
      username: string;
    };
  };
  results: {
    test: {
      title: string;
      test_type: string;
    };
    accuracy: number;
    wpm: number;
    completed_at: string;
  }[];
}

export const UserResults = () => {
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const { data: userResults, isLoading } = useQuery({
    queryKey: ["admin-user-results"],
    queryFn: async () => {
      console.log("Fetching user results for admin...");
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        console.error("Error fetching users:", usersError);
        throw usersError;
      }

      const results: UserResult[] = [];

      for (const user of users.users) {
        const { data: testResults, error: resultsError } = await supabase
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

        if (resultsError) {
          console.error("Error fetching results for user:", resultsError);
          continue;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        results.push({
          user: {
            id: user.id,
            email: user.email || "",
            profile: {
              username: profile?.username || "Anonymous",
            },
          },
          results: testResults || [],
        });
      }

      console.log("Fetched user results:", results);
      return results;
    },
  });

  const handleAnalyzeResults = async (userId: string) => {
    setSelectedUserId(userId);
    const user = userResults?.find((u) => u.user.id === userId);
    
    if (!user) return;

    try {
      const response = await fetch("/api/analyze-user-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ results: user.results }),
      });

      if (!response.ok) throw new Error("Failed to analyze results");

      const data = await response.json();
      setAiSuggestion(data.suggestion);
    } catch (error) {
      console.error("Error analyzing results:", error);
      toast({
        title: "Error",
        description: "Failed to analyze results. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>User Results Analysis</CardTitle>
          <CardDescription>
            View all user results and get AI-powered suggestions for improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Tests Taken</TableHead>
                  <TableHead>Average Accuracy</TableHead>
                  <TableHead>Average WPM</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userResults?.map((user) => {
                  const avgAccuracy = user.results.length
                    ? user.results.reduce((acc, curr) => acc + curr.accuracy, 0) /
                      user.results.length
                    : 0;
                  const avgWpm = user.results.length
                    ? user.results.reduce((acc, curr) => acc + curr.wpm, 0) /
                      user.results.length
                    : 0;

                  return (
                    <TableRow key={user.user.id}>
                      <TableCell>
                        <div className="font-medium">{user.user.profile.username}</div>
                        <div className="text-sm text-gray-500">{user.user.email}</div>
                      </TableCell>
                      <TableCell>{user.results.length}</TableCell>
                      <TableCell>{avgAccuracy.toFixed(2)}%</TableCell>
                      <TableCell>{avgWpm.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAnalyzeResults(user.user.id)}
                        >
                          <Brain className="h-4 w-4 mr-2" />
                          Analyze
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {selectedUserId && aiSuggestion && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{aiSuggestion}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
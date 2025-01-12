import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserResultsTable } from "./UserResultsTable";
import { UserResult } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

export const UserResults = () => {
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const { data: userResults, isLoading } = useQuery({
    queryKey: ["admin-user-results"],
    queryFn: async () => {
      console.log("Fetching user results for admin...");
      
      // First, get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      // Then get test results
      const { data: results, error: resultsError } = await supabase
        .from("test_results")
        .select(`
          *,
          test:tests (
            title,
            test_type
          )
        `)
        .order("completed_at", { ascending: false });

      if (resultsError) {
        console.error("Error fetching results:", resultsError);
        throw resultsError;
      }

      // Create a map of profiles by ID for easy lookup
      const profileMap = new Map(
        profiles.map(profile => [profile.id, profile])
      );

      // Group results by user
      const userMap = new Map<string, UserResult>();
      
      results?.forEach((result) => {
        const userId = result.user_id;
        if (!userId) return;
        
        const profile = profileMap.get(userId);
        if (!profile) return;
        
        if (!userMap.has(userId)) {
          userMap.set(userId, {
            profile: {
              id: userId,
              email: profile.username || "No username",
            },
            results: [],
          });
        }
        
        const userResult = userMap.get(userId);
        if (userResult && result.test) {
          userResult.results.push({
            test: result.test,
            accuracy: result.accuracy,
            wpm: result.wpm,
            completed_at: result.completed_at,
          });
        }
      });

      console.log("Fetched user results:", Array.from(userMap.values()));
      return Array.from(userMap.values());
    },
  });

  const handleAnalyzeResults = async (userId: string) => {
    setSelectedUserId(userId);
    const user = userResults?.find((u) => u.profile.id === userId);
    
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('analyze-user-results', {
        body: { results: user.results }
      });

      if (error) throw error;

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
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-64 w-full" />
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
            <UserResultsTable 
              userResults={userResults || []} 
              onAnalyze={handleAnalyzeResults}
            />
          </div>

          {selectedUserId && aiSuggestion && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{aiSuggestion}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { results } = await req.json();
    console.log("Analyzing results:", results);

    // Group results by test type
    const typingTests = results.filter((r: any) => r.test.test_type === 'typing');
    const mcqTests = results.filter((r: any) => r.test.test_type === 'mcq');

    // Analyze typing test performance
    let suggestion = '';
    
    if (typingTests.length > 0) {
      const avgWpm = typingTests.reduce((acc: number, curr: any) => acc + curr.wpm, 0) / typingTests.length;
      const avgAccuracy = typingTests.reduce((acc: number, curr: any) => acc + curr.accuracy, 0) / typingTests.length;
      
      suggestion += `For typing tests: Your average speed is ${avgWpm.toFixed(1)} WPM with ${avgAccuracy.toFixed(1)}% accuracy. `;
      
      if (avgWpm < 30) {
        suggestion += "Consider practicing basic typing exercises to improve speed. Focus on accuracy first, then gradually increase your speed. ";
      } else if (avgWpm < 50) {
        suggestion += "Your typing speed is improving! Try challenging yourself with longer texts and maintain your accuracy. ";
      } else {
        suggestion += "Great typing speed! Keep practicing to maintain your skills. ";
      }

      if (avgAccuracy < 90) {
        suggestion += "Try to slow down slightly and focus on accuracy - it's better to type slower but more accurately. ";
      }
    }

    // Analyze MCQ test performance
    if (mcqTests.length > 0) {
      const avgAccuracy = mcqTests.reduce((acc: number, curr: any) => acc + curr.accuracy, 0) / mcqTests.length;
      
      suggestion += `\n\nFor MCQ tests: Your average score is ${avgAccuracy.toFixed(1)}%. `;
      
      if (avgAccuracy < 60) {
        suggestion += "Review the topics you're struggling with and try taking practice tests to improve your understanding. ";
      } else if (avgAccuracy < 80) {
        suggestion += "You're doing well! Focus on the questions you got wrong to identify any knowledge gaps. ";
      } else {
        suggestion += "Excellent performance! Consider trying more challenging tests to continue improving. ";
      }
    }

    if (!typingTests.length && !mcqTests.length) {
      suggestion = "No test results available yet. Take some tests to get personalized recommendations for improvement!";
    }

    console.log("Generated suggestion:", suggestion);

    return new Response(
      JSON.stringify({ suggestion }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-user-results function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
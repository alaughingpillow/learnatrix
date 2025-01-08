import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { results } = await req.json();

    // Analyze the results
    const typingTests = results.filter((r: any) => r.test.test_type === 'typing');
    const mcqTests = results.filter((r: any) => r.test.test_type === 'mcq');

    const avgTypingAccuracy = typingTests.length
      ? typingTests.reduce((acc: number, curr: any) => acc + curr.accuracy, 0) / typingTests.length
      : 0;

    const avgTypingWpm = typingTests.length
      ? typingTests.reduce((acc: number, curr: any) => acc + curr.wpm, 0) / typingTests.length
      : 0;

    const avgMcqAccuracy = mcqTests.length
      ? mcqTests.reduce((acc: number, curr: any) => acc + curr.accuracy, 0) / mcqTests.length
      : 0;

    // Generate suggestions based on performance
    let suggestion = '';

    if (typingTests.length > 0) {
      suggestion += `For typing tests: Average speed is ${avgTypingWpm.toFixed(2)} WPM with ${avgTypingAccuracy.toFixed(2)}% accuracy. `;
      if (avgTypingWpm < 30) {
        suggestion += "Consider practicing basic typing exercises to improve speed. ";
      } else if (avgTypingAccuracy < 90) {
        suggestion += "Focus on accuracy over speed initially. ";
      }
    }

    if (mcqTests.length > 0) {
      suggestion += `\n\nFor MCQ tests: Average accuracy is ${avgMcqAccuracy.toFixed(2)}%. `;
      if (avgMcqAccuracy < 70) {
        suggestion += "Recommend reviewing test categories with lower scores and practicing more in those areas.";
      } else {
        suggestion += "Good performance! Consider trying more challenging tests to continue improving.";
      }
    }

    if (!typingTests.length && !mcqTests.length) {
      suggestion = "No test results available yet. Encourage the user to take some tests to get personalized recommendations.";
    }

    return new Response(
      JSON.stringify({ suggestion }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
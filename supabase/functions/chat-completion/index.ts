import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const HUGGINGFACE_API_KEY = Deno.env.get('HUGGINGFACE_API_KEY');
const SPACE_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill"; // We'll use this as a fallback model

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
    const { input } = await req.json();
    console.log('Received input:', input);

    // Make request to Hugging Face API
    const response = await fetch(SPACE_URL, {
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: input,
        parameters: {
          max_length: 500,
          temperature: 0.7,
          top_p: 0.9,
          repetition_penalty: 1.2,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Hugging Face response:', result);

    return new Response(
      JSON.stringify({ 
        generated_text: Array.isArray(result) ? result[0].generated_text : result.generated_text 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in chat-completion function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { match, teams, history, currentForm } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    const systemPrompt = `You are a sports betting AI expert specializing in match predictions and analysis. 
    Provide detailed predictions with confidence scores (0-100), focusing on:
    - Team form and history
    - Head-to-head statistics
    - Key player availability
    - Recent performance trends
    Format your response as a JSON object with prediction, confidence, analysis, and trend fields.`;

    const userPrompt = `Analyze this match: ${match}
    Teams: ${teams}
    Historical Data: ${history}
    Current Form: ${currentForm}
    
    Provide a detailed prediction with reasoning.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const prediction = data.choices[0].message.content;

    // Save prediction to database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabaseClient
      .from('ai_predictions')
      .insert([
        {
          match: match,
          prediction: prediction.prediction,
          confidence: prediction.confidence,
          analysis: prediction.analysis,
          trend: prediction.trend,
          odds: prediction.odds || "TBD"
        }
      ]);

    return new Response(
      JSON.stringify(prediction),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate prediction' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

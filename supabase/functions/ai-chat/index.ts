import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Classify the issue using AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const classificationPrompt = `You are an IT helpdesk classifier for POWERGRID. Analyze the following user message and determine:
1. Category (network/account/email/hardware/software/printer/other)
2. Priority (low/medium/high/urgent)
3. Whether this is a common issue that can be resolved with KB article (true/false)
4. Suggested solution if it's a common issue

User message: "${message}"

Respond in JSON format:
{
  "category": "category_name",
  "priority": "priority_level",
  "isCommon": true/false,
  "solution": "step-by-step solution if common, empty string otherwise",
  "kbQuery": "search query for knowledge base"
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a helpful IT support AI assistant for POWERGRID employees.' },
          { role: 'user', content: classificationPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service temporarily unavailable. Please create a ticket directly.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI service error: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    let classification;
    
    try {
      const content = aiData.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      classification = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      classification = {
        category: 'other',
        priority: 'medium',
        isCommon: false,
        solution: '',
        kbQuery: message
      };
    }

    // Search knowledge base
    const { data: kbArticles } = await supabaseClient
      .from('knowledge_base')
      .select('*')
      .eq('category', classification.category)
      .limit(3);

    let response = {
      classification,
      kbArticles: kbArticles || [],
      suggestedAction: classification.isCommon ? 'show_solution' : 'create_ticket',
      solution: classification.solution
    };

    // Log the chat message
    await supabaseClient
      .from('chat_messages')
      .insert({
        user_id: userId,
        message: message,
        response: JSON.stringify(response)
      });

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error?.message || 'Unknown error',
        classification: {
          category: 'other',
          priority: 'medium',
          isCommon: false
        },
        suggestedAction: 'create_ticket'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
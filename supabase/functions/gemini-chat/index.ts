import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

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
    // Validate API key
    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(JSON.stringify({ 
        error: 'API configuration error. Please contact support.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { messages, code } = await req.json();
    
    console.log('Received chat request:', { messageCount: messages.length, hasCode: !!code });

    // Build system prompt with code context
    const systemPrompt = `You are an expert AI coding mentor and assistant with advanced reasoning capabilities. You help developers learn, understand, and improve their code through thoughtful analysis and step-by-step reasoning.

${code ? `Current code context:\n\`\`\`\n${code}\n\`\`\`\n` : ''}

Guidelines for your responses:
- Think through problems step by step before providing solutions
- Provide clear, detailed explanations with reasoning
- Suggest specific, actionable improvements with examples
- Point out potential bugs, security issues, or performance problems
- Explain programming concepts when needed
- Be encouraging and supportive while being thorough
- Use code examples to illustrate your points
- Consider edge cases and best practices
- Provide multiple approaches when relevant`;

    // Call Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    const data = await response.json();
    
    console.log('Lovable AI response status:', response.status);
    
    if (!response.ok) {
      console.error('Lovable AI error:', data);
      
      // Handle rate limiting
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait a moment and try again.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Handle payment required
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Payment required. Please add credits to your Lovable AI workspace.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Handle unauthorized
      if (response.status === 401) {
        return new Response(JSON.stringify({ 
          error: 'Authentication error. Please contact support.' 
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(data.error?.message || 'Lovable AI error');
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected Lovable AI response format:', data);
      throw new Error('Invalid response format from Lovable AI');
    }

    const aiResponse = data.choices[0].message.content;
    console.log('Lovable AI response generated successfully');

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    
    // Provide user-friendly error messages
    const errorMessage = error.message?.includes('fetch') 
      ? 'Network error. Please check your connection and try again.'
      : error.message || 'An unexpected error occurred. Please try again.';
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
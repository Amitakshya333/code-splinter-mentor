import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

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
    console.log('AI Fix Code function called');
    
    // Check if API key is configured
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { code, language } = await req.json();
    console.log('Processing code fix request for language:', language);

    const systemPrompt = `You are an expert code reviewer and fixer. Analyze the provided code and:

1. Identify and fix any bugs or errors
2. Improve code quality and best practices
3. Add proper error handling where needed
4. Optimize performance if possible
5. Add meaningful comments where helpful

Return your response in JSON format with:
{
  "fixedCode": "the improved code",
  "changes": ["list of changes made"],
  "suggestions": ["additional suggestions for improvement"]
}

Language: ${language}
Focus on making the code production-ready while maintaining its original functionality.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nPlease analyze and fix this code:\n\n\`\`\`${language}\n${code}\n\`\`\``
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000,
        }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API error');
    }

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // Try to parse JSON response, fallback to text if needed
    let result;
    try {
      result = JSON.parse(aiResponse);
    } catch {
      result = {
        fixedCode: code,
        changes: ["AI response parsing failed"],
        suggestions: [aiResponse]
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-fix-code function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { code, language } = await req.json();

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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please analyze and fix this code:\n\n\`\`\`${language}\n${code}\n\`\`\`` }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    const aiResponse = data.choices[0].message.content;
    
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
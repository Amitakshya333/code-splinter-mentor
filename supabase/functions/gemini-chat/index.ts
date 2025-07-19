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
    const { messages, code } = await req.json();
    
    console.log('Received chat request:', { messageCount: messages.length, hasCode: !!code });

    // Convert messages to Gemini format
    const lastUserMessage = messages[messages.length - 1];
    const conversationHistory = messages.slice(0, -1).map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');

    const systemPrompt = `You are an expert AI coding mentor and assistant with advanced reasoning capabilities. You help developers learn, understand, and improve their code through thoughtful analysis and step-by-step reasoning.

Current code context:
\`\`\`
${code || 'No code provided'}
\`\`\`

Previous conversation:
${conversationHistory}

Guidelines for your responses:
- Think through problems step by step before providing solutions
- Provide clear, detailed explanations with reasoning
- Suggest specific, actionable improvements with examples
- Point out potential bugs, security issues, or performance problems
- Explain programming concepts when needed
- Be encouraging and supportive while being thorough
- Use code examples to illustrate your points
- Consider edge cases and best practices
- Provide multiple approaches when relevant

Current user question: ${lastUserMessage.content}

Please provide a thoughtful, well-reasoned response that demonstrates your thinking process.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    const data = await response.json();
    
    console.log('Gemini API response status:', response.status);
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      throw new Error(data.error?.message || 'Gemini API error');
    }

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Unexpected Gemini response format:', data);
      throw new Error('Invalid response format from Gemini API');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    console.log('Gemini response generated successfully');

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
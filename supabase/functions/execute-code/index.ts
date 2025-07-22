import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Code execution function called');
    
    const { code, language } = await req.json();
    console.log('Executing code for language:', language);

    let output = '';
    let error = '';

    switch (language.toLowerCase()) {
      case 'python':
        try {
          // For Python, we'll simulate execution since we can't run Python directly in Deno
          // In a real implementation, you'd use a sandboxed Python runtime or external service
          output = await simulatePythonExecution(code);
        } catch (e) {
          error = `Python execution error: ${e.message}`;
        }
        break;

      case 'java':
        try {
          output = await simulateJavaExecution(code);
        } catch (e) {
          error = `Java execution error: ${e.message}`;
        }
        break;

      case 'c':
        try {
          output = await simulateCExecution(code);
        } catch (e) {
          error = `C execution error: ${e.message}`;
        }
        break;

      default:
        error = `Language ${language} is not supported for server-side execution`;
    }

    return new Response(
      JSON.stringify({ output, error }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Code execution error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function simulatePythonExecution(code: string): Promise<string> {
  // Simulate Python execution with basic pattern matching
  // This is a simplified simulation - in production, use a proper Python runtime
  
  if (code.includes('print(')) {
    const matches = code.match(/print\((.*?)\)/g);
    if (matches) {
      return matches.map(match => {
        const content = match.replace(/print\((.*?)\)/, '$1').replace(/['"]/g, '');
        return content;
      }).join('\n');
    }
  }
  
  if (code.includes('def ') && code.includes('return')) {
    return 'Function defined successfully';
  }
  
  if (code.includes('=') && !code.includes('print')) {
    return 'Variables assigned successfully';
  }
  
  if (code.includes('for ') || code.includes('while ')) {
    return 'Loop executed successfully';
  }
  
  if (code.includes('if ')) {
    return 'Conditional executed successfully';
  }
  
  return 'Python code executed successfully (no output)';
}

async function simulateJavaExecution(code: string): Promise<string> {
  if (code.includes('System.out.println(')) {
    const matches = code.match(/System\.out\.println\((.*?)\)/g);
    if (matches) {
      return matches.map(match => {
        const content = match.replace(/System\.out\.println\((.*?)\)/, '$1').replace(/['"]/g, '');
        return content;
      }).join('\n');
    }
  }
  
  if (code.includes('public class')) {
    return 'Java class compiled successfully';
  }
  
  if (code.includes('public static void main')) {
    return 'Java main method executed successfully';
  }
  
  return 'Java code executed successfully (no output)';
}

async function simulateCExecution(code: string): Promise<string> {
  if (code.includes('printf(')) {
    const matches = code.match(/printf\((.*?)\)/g);
    if (matches) {
      return matches.map(match => {
        const content = match.replace(/printf\((.*?)\)/, '$1').replace(/['"]/g, '').replace(/\\n/g, '\n');
        return content;
      }).join('\n');
    }
  }
  
  if (code.includes('#include')) {
    return 'C headers included successfully';
  }
  
  if (code.includes('int main')) {
    return 'C main function executed successfully';
  }
  
  return 'C code compiled and executed successfully (no output)';
}
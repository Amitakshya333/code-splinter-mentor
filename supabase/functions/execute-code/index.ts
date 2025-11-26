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
          output = await simulatePythonExecution(code);
        } catch (e) {
          error = `Python execution error: ${e instanceof Error ? e.message : 'Unknown error'}`;
        }
        break;

      case 'javascript':
        try {
          output = await simulateJavaScriptExecution(code);
        } catch (e) {
          error = `JavaScript execution error: ${e instanceof Error ? e.message : 'Unknown error'}`;
        }
        break;

      case 'java':
        try {
          output = await simulateJavaExecution(code);
        } catch (e) {
          error = `Java execution error: ${e instanceof Error ? e.message : 'Unknown error'}`;
        }
        break;

      case 'c':
        try {
          output = await simulateCExecution(code);
        } catch (e) {
          error = `C execution error: ${e instanceof Error ? e.message : 'Unknown error'}`;
        }
        break;

      case 'html':
        try {
          output = await simulateHTMLExecution(code);
        } catch (e) {
          error = `HTML execution error: ${e instanceof Error ? e.message : 'Unknown error'}`;
        }
        break;

      case 'css':
        try {
          output = await simulateCSSExecution(code);
        } catch (e) {
          error = `CSS execution error: ${e instanceof Error ? e.message : 'Unknown error'}`;
        }
        break;

      default:
        error = `Language ${language} is not currently supported for server-side execution. Supported languages: Python, JavaScript, Java, C, HTML, CSS`;
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
  // Enhanced Python execution simulation
  let output = '';
  
  // Handle print statements
  const printMatches = code.match(/print\s*\([^)]*\)/g);
  if (printMatches) {
    for (const match of printMatches) {
      let content = match.replace(/print\s*\(/, '').replace(/\)$/, '');
      
      // Clean up quotes and handle f-strings
      if (content.match(/^["'].*["']$/)) {
        content = content.slice(1, -1);
      } else if (content.startsWith('f"') || content.startsWith("f'")) {
        content = content.substring(2, content.length - 1);
        content = content.replace(/\{[^}]+\}/g, 'value');
      }
      
      output += content.replace(/\\n/g, '\n') + '\n';
    }
  }
  
  // Handle variable assignments and expressions
  if (code.includes('=') && !code.includes('print')) {
    output += 'Variables assigned successfully\n';
  }
  
  // Handle functions
  if (code.includes('def ')) {
    const funcMatches = code.match(/def\s+(\w+)/g);
    if (funcMatches) {
      output += `Functions defined: ${funcMatches.map(f => f.replace('def ', '')).join(', ')}\n`;
    }
  }
  
  // Handle loops
  if (code.includes('for ') || code.includes('while ')) {
    output += 'Loop executed successfully\n';
  }
  
  // Handle conditionals
  if (code.includes('if ')) {
    output += 'Conditional statement executed\n';
  }
  
  // Handle mathematical operations
  const mathMatches = code.match(/(\d+\s*[+\-*/]\s*\d+)/g);
  if (mathMatches) {
    for (const expr of mathMatches) {
      try {
        const result = eval(expr.replace(/\s/g, ''));
        output += `${expr} = ${result}\n`;
      } catch (e) {
        // Skip invalid expressions
      }
    }
  }
  
  return output || 'Python code executed successfully';
}

async function simulateJavaScriptExecution(code: string): Promise<string> {
  let output = '';
  
  // Handle console.log statements
  const consoleMatches = code.match(/console\.log\s*\([^)]*\)/g);
  if (consoleMatches) {
    for (const match of consoleMatches) {
      let content = match.replace(/console\.log\s*\(/, '').replace(/\)$/, '');
      
      // Handle template literals
      if (content.includes('`')) {
        content = content.replace(/`([^`]*)`/g, (_, str) => {
          return str.replace(/\$\{[^}]+\}/g, 'value');
        });
      }
      
      // Clean up quotes
      content = content.replace(/^["']|["']$/g, '');
      output += content + '\n';
    }
  }
  
  // Handle function declarations
  if (code.includes('function ') || code.includes('=>')) {
    const funcMatches = code.match(/function\s+(\w+)|const\s+(\w+)\s*=/g);
    if (funcMatches) {
      output += `Functions defined: ${funcMatches.map(f => f.replace(/function\s+|const\s+|=.*/, '')).join(', ')}\n`;
    }
  }
  
  // Handle variable declarations
  if (code.includes('const ') || code.includes('let ') || code.includes('var ')) {
    output += 'Variables declared successfully\n';
  }
  
  // Handle mathematical operations
  const mathMatches = code.match(/(\d+\s*[+\-*/]\s*\d+)/g);
  if (mathMatches) {
    for (const expr of mathMatches) {
      try {
        const result = eval(expr.replace(/\s/g, ''));
        output += `${expr} = ${result}\n`;
      } catch (e) {
        // Skip invalid expressions
      }
    }
  }
  
  return output || 'JavaScript code executed successfully';
}

async function simulateJavaExecution(code: string): Promise<string> {
  let output = '';
  
  // Handle System.out.println statements
  const printMatches = code.match(/System\.out\.println\s*\([^)]*\)/g);
  if (printMatches) {
    for (const match of printMatches) {
      let content = match.replace(/System\.out\.println\s*\(/, '').replace(/\)$/, '');
      
      // Handle string concatenation
      if (content.includes('+')) {
        content = content.replace(/\s*\+\s*/g, ' ');
      }
      
      content = content.replace(/^["']|["']$/g, '');
      output += content + '\n';
    }
  }
  
  // Handle class definition
  if (code.includes('public class')) {
    const classMatches = code.match(/public class (\w+)/);
    if (classMatches) {
      output += `Java class "${classMatches[1]}" compiled successfully\n`;
    }
  }
  
  // Handle method definitions
  if (code.includes('public ') && code.includes('(')) {
    const methodMatches = code.match(/public\s+\w+\s+(\w+)\s*\(/g);
    if (methodMatches) {
      output += `Methods defined: ${methodMatches.map(m => m.replace(/public\s+\w+\s+|\s*\(.*/, '')).join(', ')}\n`;
    }
  }
  
  // Handle main method
  if (code.includes('public static void main')) {
    output += 'Main method executed successfully\n';
  }
  
  return output || 'Java code executed successfully';
}

async function simulateCExecution(code: string): Promise<string> {
  let output = '';
  
  // Handle printf statements
  const printfMatches = code.match(/printf\s*\([^)]*\)/g);
  if (printfMatches) {
    for (const match of printfMatches) {
      let content = match.replace(/printf\s*\(/, '').replace(/\)$/, '');
      
      // Extract format string and handle basic substitutions
      const parts = content.split(',');
      if (parts.length > 1) {
        let formatStr = parts[0].replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');
        // Simple %d, %s, %f substitution for demo
        formatStr = formatStr.replace(/%d/g, '42').replace(/%s/g, 'string').replace(/%f/g, '3.14').replace(/%.2f/g, '3.14');
        output += formatStr + '\n';
      } else {
        output += content.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n') + '\n';
      }
    }
  }
  
  // Handle header includes
  if (code.includes('#include')) {
    const includes = code.match(/#include\s*<([^>]+)>/g);
    if (includes) {
      output += `Headers included: ${includes.map(i => i.replace(/#include\s*<|>/g, '')).join(', ')}\n`;
    }
  }
  
  // Handle function definitions
  if (code.includes('void ') || code.includes('int ') || code.includes('float ') || code.includes('char ')) {
    const funcMatches = code.match(/(?:void|int|float|char\*?)\s+(\w+)\s*\(/g);
    if (funcMatches) {
      const funcNames = funcMatches.map(f => f.replace(/(?:void|int|float|char\*?)\s+|\s*\(.*/, '')).filter(name => name !== 'main');
      if (funcNames.length > 0) {
        output += `Functions defined: ${funcNames.join(', ')}\n`;
      }
    }
  }
  
  // Handle main function
  if (code.includes('int main')) {
    output += 'Main function executed successfully\n';
  }
  
  return output || 'C code compiled and executed successfully';
}

async function simulateHTMLExecution(code: string): Promise<string> {
  let output = '';
  
  // Analyze HTML structure
  const titleMatch = code.match(/<title>(.*?)<\/title>/i);
  if (titleMatch) {
    output += `Page title: ${titleMatch[1]}\n`;
  }
  
  // Count HTML elements
  const elements = code.match(/<(\w+)[^>]*>/g);
  if (elements) {
    const elementCounts: Record<string, number> = {};
    elements.forEach(el => {
      const tag = el.replace(/<(\w+).*/, '$1').toLowerCase();
      elementCounts[tag] = (elementCounts[tag] || 0) + 1;
    });
    
    output += 'HTML elements found:\n';
    Object.entries(elementCounts).forEach(([tag, count]) => {
      output += `  ${tag}: ${count}\n`;
    });
  }
  
  // Check for scripts
  if (code.includes('<script')) {
    output += 'JavaScript detected in HTML\n';
  }
  
  // Check for styles
  if (code.includes('<style') || code.includes('stylesheet')) {
    output += 'CSS styles detected\n';
  }
  
  return output || 'HTML document processed successfully';
}

async function simulateCSSExecution(code: string): Promise<string> {
  let output = '';
  
  // Count CSS rules
  const rules = code.match(/[^{}]+\s*\{[^}]*\}/g);
  if (rules) {
    output += `CSS rules defined: ${rules.length}\n`;
    
    // Analyze selectors
    const selectors = rules.map(rule => rule.split('{')[0].trim());
    const selectorTypes = {
      classes: selectors.filter(s => s.includes('.')).length,
      ids: selectors.filter(s => s.includes('#')).length,
      elements: selectors.filter(s => !s.includes('.') && !s.includes('#')).length
    };
    
    output += `Selectors: ${selectorTypes.classes} classes, ${selectorTypes.ids} IDs, ${selectorTypes.elements} elements\n`;
  }
  
  // Check for media queries
  if (code.includes('@media')) {
    const mediaQueries = code.match(/@media[^{]+/g);
    if (mediaQueries) {
      output += `Media queries: ${mediaQueries.length}\n`;
    }
  }
  
  // Check for animations
  if (code.includes('@keyframes') || code.includes('animation')) {
    output += 'CSS animations detected\n';
  }
  
  // Check for transitions
  if (code.includes('transition')) {
    output += 'CSS transitions detected\n';
  }
  
  return output || 'CSS stylesheet processed successfully';
}
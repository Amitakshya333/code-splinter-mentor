import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserTypeScript from 'prettier/parser-typescript';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';

export const formatCode = async (code: string, language: string): Promise<string> => {
  try {
    let parser: string;
    let plugins: any[] = [];

    switch (language.toLowerCase()) {
      case 'javascript':
      case 'jsx':
        parser = 'babel';
        plugins = [parserBabel];
        break;
      case 'typescript':
      case 'tsx':
        parser = 'typescript';
        plugins = [parserTypeScript];
        break;
      case 'html':
        parser = 'html';
        plugins = [parserHtml];
        break;
      case 'css':
      case 'scss':
        parser = 'css';
        plugins = [parserCss];
        break;
      case 'json':
        return JSON.stringify(JSON.parse(code), null, 2);
      case 'python':
        // Python formatting would require a backend service
        return code;
      default:
        return code;
    }

    const formatted = await prettier.format(code, {
      parser,
      plugins,
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'es5',
      printWidth: 80,
      arrowParens: 'avoid',
    });

    return formatted;
  } catch (error) {
    console.error('Format error:', error);
    throw new Error(`Failed to format ${language} code`);
  }
};

export const lintCode = (code: string, language: string): { line: number; message: string; severity: 'error' | 'warning' }[] => {
  const issues: { line: number; message: string; severity: 'error' | 'warning' }[] = [];

  // Basic linting checks
  const lines = code.split('\n');
  lines.forEach((line, index) => {
    // Check for console.log in production code
    if (line.includes('console.log')) {
      issues.push({
        line: index + 1,
        message: 'Avoid using console.log in production code',
        severity: 'warning',
      });
    }

    // Check for trailing spaces
    if (line.endsWith(' ')) {
      issues.push({
        line: index + 1,
        message: 'Trailing whitespace',
        severity: 'warning',
      });
    }

    // Language-specific checks
    if (language === 'javascript' || language === 'typescript') {
      if (line.includes('var ')) {
        issues.push({
          line: index + 1,
          message: 'Use const or let instead of var',
          severity: 'warning',
        });
      }
    }
  });

  return issues;
};

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useChallenges, Challenge } from '@/hooks/useChallenges';
import { 
  Code, 
  Trophy, 
  Target, 
  Lightbulb, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  Star,
  Play
} from 'lucide-react';

const mockChallenges: Challenge[] = [
  {
    id: 'reverse-string',
    title: 'Reverse a String',
    description: 'Write a function that reverses a string without using built-in reverse methods.',
    difficulty: 'easy',
    language: 'python',
    starterCode: 'def reverse_string(s):\n    # Your code here\n    pass\n\n# Test\nresult = reverse_string("hello")\nprint(result)',
    solution: 'def reverse_string(s):\n    return s[::-1]',
    testCases: [
      { input: '"hello"', expectedOutput: '"olleh"', description: 'Basic string reversal' },
      { input: '"python"', expectedOutput: '"nohtyp"', description: 'Another string' },
      { input: '""', expectedOutput: '""', description: 'Empty string' }
    ],
    hints: [
      'You can use string slicing with negative step',
      'Think about s[::-1] syntax',
      'Alternative: use a loop to build the reversed string'
    ],
    tags: ['strings', 'basic'],
    points: 10
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Sequence',
    description: 'Generate the first n numbers in the Fibonacci sequence.',
    difficulty: 'medium',
    language: 'python',
    starterCode: 'def fibonacci(n):\n    # Your code here\n    pass\n\n# Test\nresult = fibonacci(7)\nprint(result)',
    solution: 'def fibonacci(n):\n    if n <= 0: return []\n    if n == 1: return [0]\n    fib = [0, 1]\n    for i in range(2, n):\n        fib.append(fib[i-1] + fib[i-2])\n    return fib',
    testCases: [
      { input: '5', expectedOutput: '[0, 1, 1, 2, 3]', description: 'First 5 Fibonacci numbers' },
      { input: '1', expectedOutput: '[0]', description: 'Single number' },
      { input: '0', expectedOutput: '[]', description: 'Zero numbers' }
    ],
    hints: [
      'Start with base cases: n=0 and n=1',
      'Each number is the sum of the two preceding ones',
      'Use a loop to build the sequence iteratively'
    ],
    tags: ['algorithms', 'sequences'],
    points: 25
  },
  {
    id: 'palindrome',
    title: 'Palindrome Checker',
    description: 'Check if a string reads the same forwards and backwards.',
    difficulty: 'easy',
    language: 'javascript',
    starterCode: 'function isPalindrome(str) {\n    // Your code here\n}\n\n// Test\nconsole.log(isPalindrome("racecar"));',
    solution: 'function isPalindrome(str) {\n    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");\n    return cleaned === cleaned.split("").reverse().join("");\n}',
    testCases: [
      { input: '"racecar"', expectedOutput: 'true', description: 'Simple palindrome' },
      { input: '"hello"', expectedOutput: 'false', description: 'Not a palindrome' },
      { input: '"A man a plan a canal Panama"', expectedOutput: 'true', description: 'Complex palindrome' }
    ],
    hints: [
      'Consider removing spaces and converting to lowercase',
      'Compare the string with its reverse',
      'You can use array methods to reverse a string'
    ],
    tags: ['strings', 'algorithms'],
    points: 15
  }
];

interface ChallengeModeProps {
  onCodeUpdate?: (code: string, language: string) => void;
}

export const ChallengeMode: React.FC<ChallengeModeProps> = ({ onCodeUpdate }) => {
  const {
    currentChallenge,
    userCode,
    showHints,
    challengeResults,
    totalScore,
    completedChallenges,
    startChallenge,
    updateCode,
    showHint,
    submitSolution,
    resetChallenge
  } = useChallenges();

  const [showSolution, setShowSolution] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = () => {
    const result = submitSolution(userCode);
    if (onCodeUpdate) {
      onCodeUpdate(userCode, currentChallenge?.language || 'python');
    }
  };

  const handleBackToChallenges = () => {
    startChallenge(null as any);
    setShowSolution(false);
  };

  if (!currentChallenge) {
    return (
      <div className="h-full">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Code Challenges</h3>
            <div className="flex items-center gap-1 text-sm">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">{totalScore}</span>
              <span className="text-muted-foreground">points</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Practice coding with interactive challenges
          </p>
        </div>

        <ScrollArea className="h-[calc(100%-5rem)]">
          <div className="space-y-3">
            {mockChallenges.map((challenge) => {
              const isCompleted = completedChallenges.has(challenge.id);
              const result = challengeResults[challenge.id];
              
              return (
                <Card key={challenge.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{challenge.title}</h4>
                        {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {challenge.points}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {challenge.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                      <Code className="w-3 h-3" />
                      {challenge.language}
                      <span>•</span>
                      <Target className="w-3 h-3" />
                      {challenge.testCases.length} test cases
                    </div>

                    {result && (
                      <div className="mb-3 p-2 rounded bg-muted">
                        <div className="flex items-center justify-between text-xs">
                          <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                            {result.passed ? 'Passed' : 'Failed'}: {result.passedTests}/{result.totalTests} tests
                          </span>
                          <span className="font-medium">{result.score} points</span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mb-3">
                      {challenge.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => startChallenge(challenge)}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      {isCompleted ? 'Retry Challenge' : 'Start Challenge'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  }

  const result = challengeResults[currentChallenge.id];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{currentChallenge.title}</h3>
          <Button variant="ghost" size="sm" onClick={handleBackToChallenges}>
            ← Back
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge className={getDifficultyColor(currentChallenge.difficulty)}>
            {currentChallenge.difficulty}
          </Badge>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 text-yellow-500" />
            {currentChallenge.points} points
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-4">
          {/* Problem Description */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Problem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{currentChallenge.description}</p>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Test Cases</h5>
                <div className="space-y-2">
                  {currentChallenge.testCases.map((testCase, index) => (
                    <div key={index} className="bg-muted p-2 rounded text-xs">
                      <div className="font-medium">{testCase.description}</div>
                      <div>Input: {testCase.input} → Output: {testCase.expectedOutput}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Editor */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                Your Solution
                <Button variant="outline" size="sm" onClick={resetChallenge}>
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={userCode}
                onChange={(e) => updateCode(e.target.value)}
                className="font-mono text-sm min-h-[120px] resize-none"
                placeholder="Write your solution here..."
              />
              
              <div className="flex gap-2 mt-3">
                <Button onClick={handleSubmit} className="flex-1">
                  <Play className="w-3 h-3 mr-1" />
                  Run & Test
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSolution(!showSolution)}
                >
                  {showSolution ? 'Hide Solution' : 'Show Solution'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Result */}
          {result && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {result.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`font-medium ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {result.passed ? 'All Tests Passed!' : 'Some Tests Failed'}
                  </span>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  Score: {result.score}/{currentChallenge.points} points
                </div>
                
                <Progress 
                  value={(result.passedTests / result.totalTests) * 100} 
                  className="h-2"
                />
                
                <div className="text-xs text-muted-foreground mt-1">
                  {result.passedTests}/{result.totalTests} tests passed
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hints */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Hints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentChallenge.hints.map((hint, index) => (
                  <div key={index}>
                    {showHints[index] ? (
                      <div className="bg-blue-50 border border-blue-200 rounded p-3">
                        <p className="text-sm text-blue-800">{hint}</p>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => showHint(index)}
                        className="w-full justify-start"
                      >
                        <Lightbulb className="w-3 h-3 mr-2" />
                        Show Hint {index + 1}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Solution */}
          {showSolution && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-orange-600">Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  <code>{currentChallenge.solution}</code>
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
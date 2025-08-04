import { useState, useCallback } from 'react';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  starterCode: string;
  solution: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
    description: string;
  }>;
  hints: string[];
  tags: string[];
  points: number;
}

export interface ChallengeResult {
  passed: boolean;
  score: number;
  totalTests: number;
  passedTests: number;
  errors?: string[];
}

export const useChallenges = () => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [showHints, setShowHints] = useState<boolean[]>([]);
  const [challengeResults, setChallengeResults] = useState<Record<string, ChallengeResult>>({});
  const [totalScore, setTotalScore] = useState<number>(0);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());

  const startChallenge = useCallback((challenge: Challenge) => {
    setCurrentChallenge(challenge);
    setUserCode(challenge.starterCode);
    setShowHints(new Array(challenge.hints.length).fill(false));
  }, []);

  const updateCode = useCallback((code: string) => {
    setUserCode(code);
  }, []);

  const showHint = useCallback((index: number) => {
    setShowHints(prev => {
      const newHints = [...prev];
      newHints[index] = true;
      return newHints;
    });
  }, []);

  const submitSolution = useCallback((code: string): ChallengeResult => {
    if (!currentChallenge) {
      return { passed: false, score: 0, totalTests: 0, passedTests: 0 };
    }

    // Simple mock testing - in a real app, you'd run actual tests
    const isCorrect = code.trim().includes(currentChallenge.solution.trim().split('\n')[0]);
    const passedTests = isCorrect ? currentChallenge.testCases.length : 0;
    const score = Math.round((passedTests / currentChallenge.testCases.length) * currentChallenge.points);

    const result: ChallengeResult = {
      passed: isCorrect,
      score,
      totalTests: currentChallenge.testCases.length,
      passedTests,
      errors: isCorrect ? [] : ['Solution does not match expected output']
    };

    setChallengeResults(prev => ({
      ...prev,
      [currentChallenge.id]: result
    }));

    if (isCorrect) {
      setCompletedChallenges(prev => new Set([...prev, currentChallenge.id]));
      setTotalScore(prev => prev + score);
    }

    return result;
  }, [currentChallenge]);

  const resetChallenge = useCallback(() => {
    if (currentChallenge) {
      setUserCode(currentChallenge.starterCode);
      setShowHints(new Array(currentChallenge.hints.length).fill(false));
    }
  }, [currentChallenge]);

  return {
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
  };
};
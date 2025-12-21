import { useState } from "react";
import { X, CheckCircle2, XCircle, Award, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface NavigatorQuizProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
  onComplete: (passed: boolean, score: number) => void;
}

const getQuizQuestions = (moduleName: string): QuizQuestion[] => {
  const quizzes: Record<string, QuizQuestion[]> = {
    'EC2 Management': [
      {
        id: '1',
        question: 'Which instance type is eligible for AWS Free Tier?',
        options: ['t2.small', 't2.micro', 't3.medium', 'm5.large'],
        correctIndex: 1,
        explanation: 't2.micro is included in AWS Free Tier with 750 hours/month for 12 months.',
      },
      {
        id: '2',
        question: 'What file format is used for EC2 key pairs on Linux?',
        options: ['.pub', '.pem', '.key', '.ssh'],
        correctIndex: 1,
        explanation: 'AWS uses .pem format for private key files used in SSH connections.',
      },
      {
        id: '3',
        question: 'Which port should you open in security groups for SSH access?',
        options: ['80', '443', '22', '3389'],
        correctIndex: 2,
        explanation: 'Port 22 is the default port for SSH (Secure Shell) connections.',
      },
      {
        id: '4',
        question: 'What is an AMI?',
        options: [
          'Amazon Machine Interface',
          'Amazon Machine Image',
          'AWS Managed Instance',
          'Automatic Machine Installation'
        ],
        correctIndex: 1,
        explanation: 'AMI (Amazon Machine Image) is a template that contains the software configuration needed to launch an instance.',
      },
      {
        id: '5',
        question: 'What happens to your data when you stop an EC2 instance?',
        options: [
          'All data is deleted',
          'Only EBS data is preserved',
          'All data is preserved',
          'Only instance store data is preserved'
        ],
        correctIndex: 1,
        explanation: 'EBS volumes persist when an instance is stopped. Instance store data is lost when the instance stops.',
      },
    ],
    'VPC Setup': [
      {
        id: '1',
        question: 'What CIDR block gives you 65,536 IP addresses?',
        options: ['/8', '/16', '/24', '/32'],
        correctIndex: 1,
        explanation: 'A /16 CIDR block provides 2^16 = 65,536 IP addresses.',
      },
      {
        id: '2',
        question: 'What is required for instances in a private subnet to access the internet?',
        options: ['Internet Gateway', 'NAT Gateway', 'VPN Connection', 'Direct Connect'],
        correctIndex: 1,
        explanation: 'NAT Gateway allows instances in private subnets to initiate outbound connections to the internet.',
      },
      {
        id: '3',
        question: 'Which component must be attached to a VPC for public internet access?',
        options: ['NAT Gateway', 'Internet Gateway', 'Virtual Private Gateway', 'Transit Gateway'],
        correctIndex: 1,
        explanation: 'An Internet Gateway enables communication between your VPC and the internet.',
      },
    ],
    'default': [
      {
        id: '1',
        question: 'What is the primary benefit of cloud computing?',
        options: ['Higher costs', 'Less security', 'Scalability and flexibility', 'Slower deployment'],
        correctIndex: 2,
        explanation: 'Cloud computing provides on-demand scalability and flexibility, allowing you to adjust resources as needed.',
      },
      {
        id: '2',
        question: 'What does DevOps aim to achieve?',
        options: [
          'Slower releases',
          'Separation of development and operations',
          'Faster, more reliable software delivery',
          'Manual deployment processes'
        ],
        correctIndex: 2,
        explanation: 'DevOps practices aim to shorten the development lifecycle and provide continuous delivery with high quality.',
      },
      {
        id: '3',
        question: 'What is Infrastructure as Code (IaC)?',
        options: [
          'Writing code for applications',
          'Managing infrastructure through code and automation',
          'Manual server configuration',
          'Database programming'
        ],
        correctIndex: 1,
        explanation: 'IaC is the practice of managing and provisioning infrastructure through machine-readable configuration files.',
      },
    ],
  };
  
  return quizzes[moduleName] || quizzes['default'];
};

export const NavigatorQuiz = ({ 
  isOpen, 
  onClose, 
  moduleName,
  onComplete,
}: NavigatorQuizProps) => {
  const questions = getQuizQuestions(moduleName);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  if (!isOpen) return null;

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctIndex;
  const score = answers.filter(a => a).length;
  const passed = score >= Math.ceil(questions.length * 0.7);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    setAnswers([...answers, index === currentQuestion.correctIndex]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
      onComplete(passed, score);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
    setQuizComplete(false);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden w-full max-w-lg animate-in zoom-in-95">
          {/* Header */}
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Knowledge Check</h2>
              <p className="text-sm text-muted-foreground">{moduleName}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {quizComplete ? (
            /* Quiz Complete Screen */
            <div className="p-8 text-center">
              <div className={cn(
                "w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center",
                passed ? "bg-green-500/10" : "bg-amber-500/10"
              )}>
                <Award className={cn(
                  "w-10 h-10",
                  passed ? "text-green-500" : "text-amber-500"
                )} />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {passed ? "Congratulations!" : "Keep Learning!"}
              </h3>
              <p className="text-muted-foreground mb-4">
                You scored {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleRestart} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button onClick={onClose}>
                  Continue
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="px-6 pt-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Question {currentIndex + 1} of {questions.length}</span>
                  <span>{score} correct</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Question */}
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                      className={cn(
                        "w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3",
                        showResult
                          ? index === currentQuestion.correctIndex
                            ? "border-green-500 bg-green-500/5"
                            : index === selectedAnswer
                              ? "border-red-500 bg-red-500/5"
                              : "border-border/50 opacity-50"
                          : selectedAnswer === index
                            ? "border-primary bg-primary/5"
                            : "border-border/50 hover:border-primary/50 hover:bg-secondary/50"
                      )}
                    >
                      <span className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                        showResult && index === currentQuestion.correctIndex
                          ? "bg-green-500 text-white"
                          : showResult && index === selectedAnswer
                            ? "bg-red-500 text-white"
                            : "bg-secondary"
                      )}>
                        {showResult && index === currentQuestion.correctIndex ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : showResult && index === selectedAnswer ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </span>
                      <span>{option}</span>
                    </button>
                  ))}
                </div>
                
                {/* Explanation */}
                {showResult && (
                  <div className={cn(
                    "mt-4 p-4 rounded-xl",
                    isCorrect ? "bg-green-500/5 border border-green-500/20" : "bg-amber-500/5 border border-amber-500/20"
                  )}>
                    <p className="text-sm">
                      <span className="font-medium">{isCorrect ? "Correct!" : "Not quite."}</span>{" "}
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              {showResult && (
                <div className="px-6 pb-6">
                  <Button onClick={handleNext} className="w-full">
                    {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

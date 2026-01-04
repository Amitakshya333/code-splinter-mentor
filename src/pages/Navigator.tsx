import { useState, useEffect } from "react";
import { useNavigatorState } from "@/hooks/useNavigatorState";
import { useNavigatorProgress } from "@/hooks/useNavigatorProgress";
import { NavigatorHeader } from "@/components/navigator/NavigatorHeader";
import { NavigatorHero } from "@/components/navigator/NavigatorHero";
import { NavigatorSteps } from "@/components/navigator/NavigatorSteps";
import { NavigatorWorkspace } from "@/components/navigator/NavigatorWorkspace";
import { NavigatorCategoryNav } from "@/components/navigator/NavigatorCategoryNav";
import { NavigatorAIMentor } from "@/components/navigator/NavigatorAIMentor";
import { NavigatorSimulator } from "@/components/navigator/NavigatorSimulator";
import { NavigatorQuiz } from "@/components/navigator/NavigatorQuiz";
import { RouteVisualization } from "@/components/navigator/RouteVisualization";
import { UpgradeModal } from "@/components/freemium/UpgradeModal";
import { CheckoutButton } from "@/components/stripe/CheckoutButton";
import { Button } from "@/components/ui/button";
import { Monitor, Award, AlertTriangle, MessageCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { checkWorkflowLimit, recordWorkflowCompletion } from "@/lib/freemium";
import { getWorkflowIdFromModuleId } from "@/lib/workflows";
import { markWorkflowComplete } from "@/lib/workflowProgress";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const Navigator = () => {
  const {
    platform,
    steps,
    mentorMessages,
    completeAction,
    getCurrentStep,
    getCurrentStepIndex,
    goToStep,
    categories,
    currentCategory,
    currentModule,
    changeCategory,
    changeModule,
    categoryId,
    moduleId,
  } = useNavigatorState();

  const { getCurrentProgress, saveProgress, saveQuizResult } = useNavigatorProgress(categoryId, moduleId);

  const [showMentor, setShowMentor] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [canStartWorkflow, setCanStartWorkflow] = useState(true);
  
  const currentStep = getCurrentStep();
  const currentStepIndex = getCurrentStepIndex();
  const completedCount = steps.filter(s => s.completed).length;
  const progress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;
  const goal = currentModule?.name || "Explore";
  const isComplete = completedCount === steps.length && steps.length > 0;

  // Load saved progress
  useEffect(() => {
    const saved = getCurrentProgress();
    if (saved && saved.currentStepIndex > 0) {
      goToStep(saved.currentStepIndex);
      toast.info("Resumed from where you left off");
    }
  }, [moduleId]);

  // Save progress on step change
  useEffect(() => {
    const completedStepIds = steps.filter(s => s.completed).map(s => s.id);
    if (completedStepIds.length > 0 || currentStepIndex > 0) {
      saveProgress(completedStepIds, currentStepIndex);
    }
  }, [currentStepIndex, steps]);

  // Check freemium limit on mount and when module changes
  useEffect(() => {
    const checkLimit = async () => {
      const canStart = await checkWorkflowLimit();
      setCanStartWorkflow(canStart);
      if (!canStart) {
        setShowUpgradeModal(true);
      }
    };
    checkLimit();
  }, [moduleId]);

  // Show quiz when module complete and record completion
  useEffect(() => {
    if (completedCount === steps.length && steps.length > 0) {
      const recordCompletion = async () => {
        try {
          const user = await getCurrentUser();
          if (!user) return;

          const workflowId = await getWorkflowIdFromModuleId(moduleId);
          if (!workflowId) return;

          await markWorkflowComplete(user.id, workflowId);
          await recordWorkflowCompletion(workflowId);

          const canStart = await checkWorkflowLimit();
          setCanStartWorkflow(canStart);
          
          if (!canStart) {
            setShowUpgradeModal(true);
          }
        } catch (error) {
          console.error("Error recording workflow completion:", error);
        }
      };

      recordCompletion();

      setTimeout(() => {
        toast.success("Module complete! Take a quiz to test your knowledge.", {
          action: {
            label: "Take Quiz",
            onClick: () => setShowQuiz(true),
          },
        });
      }, 1000);
    }
  }, [completedCount, steps.length, moduleId]);

  const handleQuizComplete = (passed: boolean, score: number) => {
    saveQuizResult(moduleId, passed, score);
    if (passed) {
      toast.success(`Great job! You passed with ${score} correct answers.`);
    }
  };

  const handleContinue = () => {
    // Scroll to current step
    document.getElementById('workspace-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-glow opacity-50" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-tl from-success/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative">
        <NavigatorHeader 
          onMentorToggle={() => setShowMentor(!showMentor)}
          showMentor={showMentor}
        />

        <NavigatorCategoryNav
          categories={categories}
          currentCategory={currentCategory}
          currentModule={currentModule}
          onCategoryChange={changeCategory}
          onModuleChange={changeModule}
        />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Hero Section */}
          <NavigatorHero 
            goal={goal} 
            platform={platform}
            progress={progress}
            completedCount={completedCount}
            totalSteps={steps.length}
            onContinue={handleContinue}
          />

          {/* Route Visualization */}
          <RouteVisualization
            steps={steps.map(s => ({ id: s.id, title: s.title, completed: s.completed }))}
            currentStepIndex={currentStepIndex}
            onStepClick={goToStep}
          />

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button 
              variant="outline" 
              onClick={() => setShowSimulator(true)}
              className="gap-2 bg-card hover:bg-card/80 shadow-sm hover:shadow-md transition-all"
              disabled={!canStartWorkflow}
            >
              <Monitor className="w-4 h-4" />
              Open Simulator
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowMentor(true)}
              className="gap-2 bg-card hover:bg-card/80 shadow-sm hover:shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Ask AI Mentor
            </Button>
            {isComplete && (
              <Button 
                variant="outline"
                onClick={() => setShowQuiz(true)}
                className="gap-2 bg-success/10 border-success/30 text-success hover:bg-success/20 hover:text-success"
              >
                <Award className="w-4 h-4" />
                Take Quiz
              </Button>
            )}
          </div>

          {/* Freemium warning */}
          {!canStartWorkflow && (
            <div className="mb-8 p-4 rounded-xl border border-destructive/30 bg-destructive/5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-destructive mb-1">Workflow Limit Reached</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    You've completed your free workflow. Upgrade to Pro to access unlimited workflows and advanced features.
                  </p>
                  <CheckoutButton size="sm">
                    Upgrade to Pro
                  </CheckoutButton>
                </div>
              </div>
            </div>
          )}

          {/* Workspace Section */}
          <section id="workspace-section" className="scroll-mt-24">
            <NavigatorWorkspace
              steps={steps}
              currentStep={currentStep}
              currentStepIndex={currentStepIndex}
              onAction={completeAction}
              onStepClick={goToStep}
            />
          </section>
        </main>

        {/* Floating AI Mentor Button */}
        <button
          onClick={() => setShowMentor(!showMentor)}
          className={cn(
            "fab bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground flex items-center justify-center",
            showMentor && "bg-primary/80"
          )}
        >
          <Sparkles className="w-6 h-6" />
        </button>

        {/* Modals and panels */}
        <NavigatorAIMentor 
          isOpen={showMentor}
          onClose={() => setShowMentor(false)}
          currentStep={currentStep}
          stepIndex={currentStepIndex}
          totalSteps={steps.length}
          completedSteps={steps.filter(s => s.completed).map(s => s.title)}
          platform={platform}
          moduleName={currentModule?.name || 'Navigator'}
        />

        <NavigatorSimulator
          isOpen={showSimulator}
          onClose={() => setShowSimulator(false)}
          currentStep={currentStep}
          onStepComplete={completeAction}
          platform={categoryId}
        />

        <NavigatorQuiz
          isOpen={showQuiz}
          onClose={() => setShowQuiz(false)}
          moduleName={currentModule?.name || 'General'}
          onComplete={handleQuizComplete}
        />

        <UpgradeModal
          open={showUpgradeModal}
          onOpenChange={setShowUpgradeModal}
          onUpgrade={() => {}}
        />
      </div>
    </div>
  );
};

export default Navigator;

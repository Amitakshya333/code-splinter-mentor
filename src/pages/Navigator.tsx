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
import { UpgradeModal } from "@/components/freemium/UpgradeModal";
import { CheckoutButton } from "@/components/stripe/CheckoutButton";
import { Button } from "@/components/ui/button";
import { Monitor, Award, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { checkWorkflowLimit, recordWorkflowCompletion } from "@/lib/freemium";
import { getWorkflowIdFromModuleId } from "@/lib/workflows";
import { markWorkflowComplete } from "@/lib/workflowProgress";
import { getCurrentUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const Navigator = () => {
  const navigate = useNavigate();
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
      // Record workflow completion for freemium tracking
      const recordCompletion = async () => {
        try {
          const user = await getCurrentUser();
          if (!user) return;

          const workflowId = await getWorkflowIdFromModuleId(moduleId);
          if (!workflowId) return;

          // Mark workflow as complete in user_progress
          await markWorkflowComplete(user.id, workflowId);
          
          // Record completion for freemium tracking
          await recordWorkflowCompletion(workflowId);

          // Check if user needs to upgrade
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

  const handleUpgrade = () => {
    // Checkout will be handled by CheckoutButton in UpgradeModal
    // Just close modal, button will handle redirect
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl" />
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

        <main className="max-w-4xl mx-auto px-6 py-8">
          <NavigatorHero 
            goal={goal} 
            platform={platform}
            progress={progress}
            completedCount={completedCount}
            totalSteps={steps.length}
          />

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowSimulator(true)}
              className="gap-2"
              disabled={!canStartWorkflow}
            >
              <Monitor className="w-4 h-4" />
              Open Simulator
            </Button>
            {completedCount === steps.length && steps.length > 0 && (
              <Button 
                variant="outline"
                onClick={() => setShowQuiz(true)}
                className="gap-2"
              >
                <Award className="w-4 h-4" />
                Take Quiz
              </Button>
            )}
          </div>

          {!canStartWorkflow && (
            <div className="mb-6 p-4 border border-destructive/50 bg-destructive/10 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-destructive">Workflow Limit Reached</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You've completed your free workflow. Upgrade to Pro to access unlimited workflows.
                  </p>
                  <CheckoutButton
                    size="sm"
                    className="mt-3"
                  >
                    Upgrade to Pro
                  </CheckoutButton>
                </div>
              </div>
            </div>
          )}

          <NavigatorSteps 
            steps={steps} 
            currentStep={currentStep}
          />

          <NavigatorWorkspace
            steps={steps}
            currentStep={currentStep}
            currentStepIndex={currentStepIndex}
            onAction={completeAction}
            onStepClick={goToStep}
          />
        </main>

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
          onUpgrade={handleUpgrade}
        />
      </div>
    </div>
  );
};

export default Navigator;

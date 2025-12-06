import { useState } from "react";
import { useNavigatorState } from "@/hooks/useNavigatorState";
import { NavigatorHeader } from "@/components/navigator/NavigatorHeader";
import { NavigatorHero } from "@/components/navigator/NavigatorHero";
import { NavigatorSteps } from "@/components/navigator/NavigatorSteps";
import { NavigatorMentor } from "@/components/navigator/NavigatorMentor";
import { NavigatorWorkspace } from "@/components/navigator/NavigatorWorkspace";
import { NavigatorCategoryNav } from "@/components/navigator/NavigatorCategoryNav";

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
  } = useNavigatorState();

  const [showMentor, setShowMentor] = useState(false);
  const currentStep = getCurrentStep();
  const currentStepIndex = getCurrentStepIndex();
  const completedCount = steps.filter(s => s.completed).length;
  const progress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  const goal = currentModule?.name || "Explore";

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

        <NavigatorMentor 
          messages={mentorMessages}
          currentHint={currentStep?.description}
          isOpen={showMentor}
          onClose={() => setShowMentor(false)}
        />
      </div>
    </div>
  );
};

export default Navigator;

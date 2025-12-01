import { useState } from "react";
import { useNavigatorState } from "@/hooks/useNavigatorState";
import { NavigatorHeader } from "@/components/navigator/NavigatorHeader";
import { NavigatorHero } from "@/components/navigator/NavigatorHero";
import { NavigatorSteps } from "@/components/navigator/NavigatorSteps";
import { NavigatorMentor } from "@/components/navigator/NavigatorMentor";
import { NavigatorWorkspace } from "@/components/navigator/NavigatorWorkspace";

const Navigator = () => {
  const {
    platform,
    steps,
    mentorMessages,
    currentView,
    setCurrentView,
    changePlatform,
    completeAction,
    getCurrentStep,
  } = useNavigatorState();

  const [showMentor, setShowMentor] = useState(false);
  const currentStep = getCurrentStep();
  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  const goals = {
    aws: "Deploy an EC2 Instance",
    docker: "Run Your First Container",
    github: "Create a Repository Workflow",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-gradient-to-t from-primary/3 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative">
        <NavigatorHeader 
          platform={platform} 
          onPlatformChange={changePlatform}
          onMentorToggle={() => setShowMentor(!showMentor)}
          showMentor={showMentor}
        />

        <main className="max-w-4xl mx-auto px-6 py-12">
          <NavigatorHero 
            goal={goals[platform]} 
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
            platform={platform}
            currentStep={currentStep}
            onAction={completeAction}
            view={currentView}
            onViewChange={setCurrentView}
          />
        </main>

        {/* Floating AI Mentor */}
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

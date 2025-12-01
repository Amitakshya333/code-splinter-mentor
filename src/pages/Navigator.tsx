import { useEffect } from "react";
import { NavigatorNavbar } from "@/components/navigator/NavigatorNavbar";
import { AIMentorPanel } from "@/components/navigator/AIMentorPanel";
import { SimulatedPlatform } from "@/components/navigator/SimulatedPlatform";
import { NavigatorGuide } from "@/components/navigator/NavigatorGuide";
import { useNavigatorState } from "@/hooks/useNavigatorState";

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

  const currentStep = getCurrentStep();

  const goals = {
    aws: "Deploy an EC2 Instance on AWS",
    docker: "Run a Container with Docker",
    github: "Create a GitHub Repository Workflow",
  };

  // Update view based on completed steps
  useEffect(() => {
    const completedCount = steps.filter(s => s.completed).length;
    
    if (platform === 'aws') {
      if (completedCount === 0) setCurrentView('dashboard');
      else if (completedCount >= 1) setCurrentView('ec2');
      if (completedCount >= 2) setCurrentView('launch');
    } else if (platform === 'github') {
      if (completedCount === 0) setCurrentView('dashboard');
      else if (completedCount >= 1) setCurrentView('repo');
    }
  }, [steps, platform, setCurrentView]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Layout */}
      <div className="relative h-full flex flex-col">
        <NavigatorNavbar platform={platform} onPlatformChange={changePlatform} />

        <div className="flex-1 flex overflow-hidden p-4 gap-4">
          {/* Left Panel - AI Mentor */}
          <div className="w-80 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
            <AIMentorPanel 
              messages={mentorMessages} 
              currentStepHint={currentStep?.description}
            />
          </div>

          {/* Center Panel - Simulated Platform */}
          <div className="flex-1 min-w-0">
            <SimulatedPlatform
              platform={platform}
              currentStep={currentStep}
              onAction={completeAction}
              view={currentView}
              onViewChange={setCurrentView}
            />
          </div>

          {/* Right Panel - Navigator Guide */}
          <div className="w-80 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
            <NavigatorGuide steps={steps} goal={goals[platform]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigator;

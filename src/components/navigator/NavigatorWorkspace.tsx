import { Platform, NavigatorStep } from "@/hooks/useNavigatorState";
import { cn } from "@/lib/utils";
import { 
  Cloud, Server, Shield, Play, 
  Container, Terminal, FileCode,
  GitBranch, FileText, GitPullRequest,
  ChevronRight, Sparkles
} from "lucide-react";

interface NavigatorWorkspaceProps {
  platform: Platform;
  currentStep?: NavigatorStep;
  onAction: (action: string) => void;
  view: string;
  onViewChange: (view: string) => void;
}

export const NavigatorWorkspace = ({ 
  platform, 
  currentStep, 
  onAction,
  view,
  onViewChange 
}: NavigatorWorkspaceProps) => {
  const isHighlighted = (action: string) => currentStep?.action === action;

  const ActionCard = ({ 
    action, 
    icon: Icon, 
    title, 
    description,
    onClick
  }: { 
    action: string; 
    icon: any; 
    title: string; 
    description: string;
    onClick?: () => void;
  }) => {
    const highlighted = isHighlighted(action);
    
    return (
      <button
        onClick={() => {
          onClick?.();
          onAction(action);
        }}
        className={cn(
          "group relative w-full p-6 rounded-3xl text-left transition-all duration-300",
          "bg-card border hover:shadow-lg",
          highlighted 
            ? "border-primary/30 shadow-lg shadow-primary/10 ring-2 ring-primary/20" 
            : "border-border/50 hover:border-border"
        )}
      >
        {highlighted && (
          <div className="absolute -top-2 -right-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Click here
          </div>
        )}
        
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors",
          highlighted ? "bg-primary/10" : "bg-secondary"
        )}>
          <Icon className={cn(
            "w-6 h-6 transition-colors",
            highlighted ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        
        <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
          {title}
          <ChevronRight className={cn(
            "w-4 h-4 transition-all",
            highlighted ? "text-primary translate-x-0" : "text-muted-foreground -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
          )} />
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </button>
    );
  };

  // AWS Platform
  if (platform === 'aws') {
    if (view === 'dashboard') {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center mb-6">Select a service to continue</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <ActionCard 
              action="click-ec2" 
              icon={Server} 
              title="EC2" 
              description="Virtual servers in the cloud"
              onClick={() => onViewChange('ec2')}
            />
            <ActionCard 
              action="" 
              icon={Cloud} 
              title="S3" 
              description="Scalable storage in the cloud"
            />
            <ActionCard 
              action="" 
              icon={Shield} 
              title="IAM" 
              description="Identity and access management"
            />
            <ActionCard 
              action="" 
              icon={Terminal} 
              title="Lambda" 
              description="Run code without servers"
            />
          </div>
        </div>
      );
    }

    if (view === 'ec2') {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center mb-6">EC2 Dashboard</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <ActionCard 
              action="click-launch" 
              icon={Play} 
              title="Launch Instance" 
              description="Create a new virtual server"
              onClick={() => onViewChange('launch')}
            />
            <ActionCard 
              action="" 
              icon={Server} 
              title="Running Instances" 
              description="View active servers"
            />
          </div>
        </div>
      );
    }

    if (view === 'launch') {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center mb-6">Configure your instance</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <ActionCard 
              action="select-ami" 
              icon={FileCode} 
              title="Amazon Linux 2" 
              description="Free tier eligible AMI"
            />
            <ActionCard 
              action="select-type" 
              icon={Server} 
              title="t2.micro" 
              description="1 vCPU, 1 GiB memory"
            />
            <ActionCard 
              action="configure-security" 
              icon={Shield} 
              title="Security Group" 
              description="Configure firewall rules"
            />
            <ActionCard 
              action="review-launch" 
              icon={Play} 
              title="Review & Launch" 
              description="Finalize and deploy"
            />
          </div>
        </div>
      );
    }
  }

  // Docker Platform
  if (platform === 'docker') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground text-center mb-6">Docker commands</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <ActionCard 
            action="open-terminal" 
            icon={Terminal} 
            title="Open Terminal" 
            description="Access Docker CLI"
          />
          <ActionCard 
            action="pull-image" 
            icon={Container} 
            title="Pull Image" 
            description="Download nginx:latest"
          />
          <ActionCard 
            action="create-container" 
            icon={Play} 
            title="Run Container" 
            description="Start with port mapping"
          />
          <ActionCard 
            action="verify-status" 
            icon={Server} 
            title="Check Status" 
            description="View running containers"
          />
          <ActionCard 
            action="view-logs" 
            icon={FileText} 
            title="View Logs" 
            description="Inspect container output"
          />
        </div>
      </div>
    );
  }

  // GitHub Platform
  if (platform === 'github') {
    if (view === 'dashboard') {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center mb-6">Repository actions</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <ActionCard 
              action="create-repo" 
              icon={FileCode} 
              title="Create Repository" 
              description="Initialize a new repo"
              onClick={() => onViewChange('repo')}
            />
            <ActionCard 
              action="" 
              icon={GitBranch} 
              title="Your Repositories" 
              description="View existing repos"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground text-center mb-6">Repository setup</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <ActionCard 
            action="add-readme" 
            icon={FileText} 
            title="Add README" 
            description="Create documentation"
          />
          <ActionCard 
            action="create-branch" 
            icon={GitBranch} 
            title="Create Branch" 
            description="Start a feature branch"
          />
          <ActionCard 
            action="make-changes" 
            icon={FileCode} 
            title="Edit Files" 
            description="Make code changes"
          />
          <ActionCard 
            action="open-pr" 
            icon={GitPullRequest} 
            title="Pull Request" 
            description="Submit for review"
          />
        </div>
      </div>
    );
  }

  return null;
};

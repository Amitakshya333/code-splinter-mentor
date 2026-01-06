import { useState } from "react";
import { 
  X, Monitor, Terminal, Search, ChevronRight, 
  Server, Cloud, Database, Shield, Settings,
  Play, CheckCircle2, AlertCircle, Info, DollarSign,
  ExternalLink, Maximize2, Minimize2, HelpCircle,
  Key, Network, HardDrive, Lock, Activity, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { NavigatorStep } from "@/hooks/useNavigatorState";
import { EnhancedPlatformSimulator, getAWSDeepLink } from "./PlatformSimulators";

interface NavigatorSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep?: NavigatorStep;
  onStepComplete: (action: string) => void;
  platform: string;
  onNeedHelp?: () => void;
}

interface SimulatedElement {
  id: string;
  label: string;
  type: 'button' | 'input' | 'select' | 'checkbox' | 'panel';
  action?: string;
  highlighted?: boolean;
  value?: string;
  options?: string[];
}

// AWS Sidebar navigation items
const AWS_SIDEBAR_ITEMS = [
  { id: 'ec2', label: 'EC2', icon: Server, path: 'Compute' },
  { id: 's3', label: 'S3', icon: Database, path: 'Storage' },
  { id: 'rds', label: 'RDS', icon: Database, path: 'Database' },
  { id: 'lambda', label: 'Lambda', icon: Activity, path: 'Compute' },
  { id: 'vpc', label: 'VPC', icon: Network, path: 'Networking' },
  { id: 'iam', label: 'IAM', icon: Lock, path: 'Security' },
  { id: 'cloudwatch', label: 'CloudWatch', icon: Activity, path: 'Monitoring' },
  { id: 'secrets', label: 'Secrets Manager', icon: Key, path: 'Security' },
];

const getSimulatedUI = (step: NavigatorStep | undefined, platform: string): SimulatedElement[] => {
  if (!step) return [];
  
  const action = step.action.toLowerCase();
  
  // AWS Console Simulations
  if (platform === 'aws') {
    if (action.includes('console') || action.includes('open')) {
      return [
        { id: 'search', label: 'Search services...', type: 'input' },
        { id: 'ec2', label: 'EC2', type: 'button', action: step.action, highlighted: true },
        { id: 's3', label: 'S3', type: 'button' },
        { id: 'rds', label: 'RDS', type: 'button' },
        { id: 'lambda', label: 'Lambda', type: 'button' },
      ];
    }
    if (action.includes('launch')) {
      return [
        { id: 'launch', label: 'Launch Instance', type: 'button', action: step.action, highlighted: true },
        { id: 'instances', label: 'Instances (0)', type: 'panel' },
        { id: 'volumes', label: 'Volumes', type: 'button' },
        { id: 'snapshots', label: 'Snapshots', type: 'button' },
      ];
    }
    if (action.includes('name')) {
      return [
        { id: 'name-input', label: 'my-first-instance', type: 'input', action: step.action, highlighted: true },
        { id: 'tags', label: 'Add additional tags', type: 'button' },
      ];
    }
    if (action.includes('ami') || action.includes('select-ami')) {
      return [
        { id: 'amazon-linux', label: 'Amazon Linux 2023 AMI (Free tier eligible)', type: 'button', action: step.action, highlighted: true },
        { id: 'ubuntu', label: 'Ubuntu Server 22.04 LTS', type: 'button' },
        { id: 'windows', label: 'Windows Server 2022', type: 'button' },
        { id: 'redhat', label: 'Red Hat Enterprise Linux 9', type: 'button' },
      ];
    }
    if (action.includes('type') || action.includes('instance-type')) {
      return [
        { id: 't2-micro', label: 't2.micro (Free tier eligible) - 1 vCPU, 1 GiB', type: 'button', action: step.action, highlighted: true },
        { id: 't2-small', label: 't2.small - 1 vCPU, 2 GiB ($0.023/hr)', type: 'button' },
        { id: 't2-medium', label: 't2.medium - 2 vCPU, 4 GiB ($0.046/hr)', type: 'button' },
        { id: 't3-micro', label: 't3.micro - 2 vCPU, 1 GiB ($0.0104/hr)', type: 'button' },
      ];
    }
    if (action.includes('keypair') || action.includes('key')) {
      return [
        { id: 'create-key', label: 'Create new key pair', type: 'button', action: step.action, highlighted: true },
        { id: 'existing-key', label: 'Select existing key pair', type: 'select', options: ['None', 'my-keypair'] },
        { id: 'proceed-without', label: 'Proceed without a key pair (Not recommended)', type: 'checkbox' },
      ];
    }
    if (action.includes('security')) {
      return [
        { id: 'create-sg', label: 'Create security group', type: 'button', action: step.action, highlighted: true },
        { id: 'ssh-rule', label: 'Allow SSH traffic from My IP', type: 'checkbox' },
        { id: 'http-rule', label: 'Allow HTTP traffic from the internet', type: 'checkbox' },
        { id: 'https-rule', label: 'Allow HTTPS traffic from the internet', type: 'checkbox' },
      ];
    }
    if (action.includes('storage')) {
      return [
        { id: 'root-vol', label: '8 GiB gp3 Root volume (Free tier eligible)', type: 'input', value: '8', action: step.action, highlighted: true },
        { id: 'add-vol', label: 'Add new volume', type: 'button' },
        { id: 'delete-on-term', label: 'Delete on termination', type: 'checkbox' },
      ];
    }
    if (action.includes('review') || action.includes('launch')) {
      return [
        { id: 'review-btn', label: 'Launch instance', type: 'button', action: step.action, highlighted: true },
        { id: 'summary', label: 'Instance Summary', type: 'panel' },
      ];
    }
    if (action.includes('connect')) {
      return [
        { id: 'connect-btn', label: 'Connect', type: 'button', action: step.action, highlighted: true },
        { id: 'ec2-connect', label: 'EC2 Instance Connect', type: 'button' },
        { id: 'ssh-client', label: 'SSH client', type: 'button' },
        { id: 'session-mgr', label: 'Session Manager', type: 'button' },
      ];
    }
  }
  
  // Default
  return [
    { id: 'action-btn', label: step.title, type: 'button', action: step.action, highlighted: true },
  ];
};

const getCostEstimate = (step: NavigatorStep | undefined): { cost: string; note: string } | null => {
  if (!step) return null;
  
  const action = step.action.toLowerCase();
  
  if (action.includes('t2.micro') || action.includes('select-type')) {
    return { cost: '$0.00/month', note: 'Free tier eligible (750 hrs/month for 12 months)' };
  }
  if (action.includes('storage') || action.includes('configure-storage')) {
    return { cost: '$0.00/month', note: 'Free tier includes 30 GB of EBS storage' };
  }
  if (action.includes('nat')) {
    return { cost: '~$32/month', note: 'NAT Gateway: $0.045/hr + data processing' };
  }
  if (action.includes('rds') || action.includes('database')) {
    return { cost: '$0.00/month', note: 'Free tier: db.t3.micro, 750 hrs/month' };
  }
  
  return null;
};

export const NavigatorSimulator = ({ 
  isOpen, 
  onClose, 
  currentStep,
  onStepComplete,
  platform,
  onNeedHelp,
}: NavigatorSimulatorProps) => {
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState('ec2');
  
  // Use enhanced simulators for Docker, GitHub, Git, Kubernetes
  if (['docker', 'containers', 'github', 'git', 'kubernetes', 'devops'].includes(platform)) {
    return (
      <EnhancedPlatformSimulator
        isOpen={isOpen}
        onClose={onClose}
        currentStep={currentStep}
        onStepComplete={onStepComplete}
        platform={platform}
        onNeedHelp={onNeedHelp}
      />
    );
  }
  
  if (!isOpen) return null;
  
  const elements = getSimulatedUI(currentStep, platform);
  const costInfo = getCostEstimate(currentStep);
  
  const handleElementClick = (element: SimulatedElement) => {
    if (element.action) {
      onStepComplete(element.action);
      onClose();
    } else {
      setSelectedElements(prev => 
        prev.includes(element.id) 
          ? prev.filter(id => id !== element.id)
          : [...prev, element.id]
      );
    }
  };

  const handleOpenRealConsole = () => {
    if (currentStep) {
      const url = getAWSDeepLink(currentStep.action);
      window.open(url, '_blank');
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      <div className={cn(
        "fixed z-50 animate-in zoom-in-95 duration-300",
        isFullScreen ? "inset-0" : "inset-4 md:inset-10 lg:inset-20"
      )}>
        <div className="bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden h-full flex flex-col">
          {/* Browser-like header */}
          <div className="bg-secondary/50 px-4 py-3 flex items-center gap-3 border-b border-border/50">
            <div className="flex gap-1.5">
              <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 flex items-center gap-2 bg-background/50 rounded-lg px-3 py-1.5">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">console.aws.amazon.com</span>
            </div>
            
            {/* Full screen toggle */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="gap-2"
            >
              {isFullScreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleOpenRealConsole}
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open Real AWS Console
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Main Content with Sidebar */}
          <div className="flex-1 flex overflow-hidden">
            {/* AWS-style Sidebar */}
            <div className="w-48 bg-[#232f3e] border-r border-[#1a2433] overflow-y-auto hidden md:block">
              <div className="p-3">
                <div className="flex items-center gap-2 text-white mb-4">
                  <Cloud className="w-5 h-5 text-[#ff9900]" />
                  <span className="font-semibold text-sm">Services</span>
                </div>
                
                <div className="space-y-0.5">
                  {AWS_SIDEBAR_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSidebarItem(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors text-left",
                        activeSidebarItem === item.id
                          ? "bg-[#1a2433] text-white"
                          : "text-gray-400 hover:text-white hover:bg-[#1a2433]/50"
                      )}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-[#1a2433]">
                  <p className="text-2xs text-gray-500 px-2 mb-2">Recent</p>
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 text-gray-400 text-xs hover:text-white hover:bg-[#1a2433]/50 rounded">
                    <Server className="w-3.5 h-3.5" />
                    EC2
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main Simulator Content */}
            <div className="flex-1 overflow-auto p-6 bg-background">
              {/* AWS-style header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Cloud className="w-8 h-8 text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold">
                      AWS Console Simulator
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Practice mode - No real resources will be created
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-sm rounded-full flex items-center gap-1.5">
                  <Monitor className="w-4 h-4" />
                  Simulation Mode
                </span>
              </div>
              
              {/* Current Step Indicator */}
              {currentStep && (
                <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Info className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{currentStep.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{currentStep.description}</p>
                      {currentStep.tip && (
                        <p className="text-xs text-primary mt-2">💡 {currentStep.tip}</p>
                      )}
                    </div>
                    
                    {/* I'm Stuck Button */}
                    {onNeedHelp && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onNeedHelp}
                        className="gap-2 border-warning/30 text-warning hover:bg-warning/10 hover:text-warning shrink-0"
                      >
                        <HelpCircle className="w-4 h-4" />
                        I'm Stuck
                      </Button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Cost Estimate */}
              {costInfo && (
                <div className="mb-6 p-3 bg-green-500/5 border border-green-500/20 rounded-xl flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <span className="font-medium text-green-600">{costInfo.cost}</span>
                    <span className="text-sm text-muted-foreground ml-2">{costInfo.note}</span>
                  </div>
                </div>
              )}
              
              {/* Simulated UI Elements */}
              <div className="grid gap-3">
                {elements.map((element) => (
                  <div key={element.id}>
                    {element.type === 'button' && (
                      <button
                        onClick={() => handleElementClick(element)}
                        className={cn(
                          "w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3",
                          element.highlighted
                            ? "border-primary bg-primary/5 hover:bg-primary/10 ring-2 ring-primary/30"
                            : "border-border/50 bg-secondary/30 hover:bg-secondary/50"
                        )}
                      >
                        {element.highlighted && (
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        )}
                        <span className={element.highlighted ? "font-medium" : ""}>{element.label}</span>
                        {element.highlighted && (
                          <ChevronRight className="w-4 h-4 ml-auto text-primary" />
                        )}
                      </button>
                    )}
                    {element.type === 'input' && (
                      <div className={cn(
                        "p-3 rounded-xl border",
                        element.highlighted 
                          ? "border-primary ring-2 ring-primary/30" 
                          : "border-border/50"
                      )}>
                        <Input
                          value={inputValues[element.id] || element.value || ''}
                          onChange={(e) => setInputValues(prev => ({ ...prev, [element.id]: e.target.value }))}
                          placeholder={element.label}
                          className="bg-transparent border-0 focus-visible:ring-0"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && element.action) {
                              handleElementClick(element);
                            }
                          }}
                        />
                        {element.highlighted && (
                          <p className="text-xs text-primary mt-2">Press Enter or click to continue</p>
                        )}
                      </div>
                    )}
                    {element.type === 'checkbox' && (
                      <label className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer",
                        selectedElements.includes(element.id)
                          ? "border-primary/50 bg-primary/5"
                          : "border-border/50 hover:bg-secondary/30"
                      )}>
                        <input
                          type="checkbox"
                          checked={selectedElements.includes(element.id)}
                          onChange={() => handleElementClick(element)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm">{element.label}</span>
                      </label>
                    )}
                    {element.type === 'panel' && (
                      <div className="p-4 rounded-xl border border-border/50 bg-secondary/20">
                        <span className="text-sm text-muted-foreground">{element.label}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Help Text */}
              <p className="text-center text-sm text-muted-foreground mt-8">
                Click the highlighted option to progress, or use "Open Real AWS Console" to practice on AWS
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

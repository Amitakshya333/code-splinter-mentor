import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, Server, Database, Shield, Globe, HardDrive, 
  Container, Play, Terminal, Layers, Box,
  GitBranch, FileText, GitPullRequest, Plus, FolderOpen, Github
} from "lucide-react";
import { Platform, NavigatorStep } from "@/hooks/useNavigatorState";
import { cn } from "@/lib/utils";

interface SimulatedPlatformProps {
  platform: Platform;
  currentStep: NavigatorStep | undefined;
  onAction: (action: string) => void;
  view: string;
  onViewChange: (view: string) => void;
}

export const SimulatedPlatform = ({ 
  platform, 
  currentStep, 
  onAction, 
  view,
  onViewChange 
}: SimulatedPlatformProps) => {
  const isHighlighted = (action: string) => currentStep?.action === action;

  // AWS Simulation
  const AWSSimulation = () => (
    <div className="h-full flex flex-col">
      {/* AWS Top Bar */}
      <div className="h-12 bg-[#232f3e] flex items-center px-4 gap-4">
        <Cloud className="w-6 h-6 text-[#ff9900]" />
        <span className="text-white font-medium">AWS Console</span>
        <div className="ml-auto flex items-center gap-2">
          <Badge className="bg-[#ff9900]/20 text-[#ff9900] border-[#ff9900]/30">us-east-1</Badge>
        </div>
      </div>

      {/* AWS Sidebar */}
      <div className="flex-1 flex">
        <div className="w-56 bg-[#1a242f] border-r border-white/10 p-3">
          <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">Services</p>
          <div className="space-y-1">
            {[
              { icon: Server, label: 'EC2', action: 'click-ec2' },
              { icon: Database, label: 'RDS', action: '' },
              { icon: HardDrive, label: 'S3', action: '' },
              { icon: Shield, label: 'IAM', action: '' },
              { icon: Globe, label: 'CloudFront', action: '' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => item.action && onAction(item.action)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                  isHighlighted(item.action) 
                    ? "bg-[#ff9900] text-black font-medium animate-pulse" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {isHighlighted(item.action) && (
                  <span className="ml-auto text-xs">👆 Click!</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* AWS Main Content */}
        <div className="flex-1 bg-[#0f1419] p-6">
          {view === 'dashboard' && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">AWS Console Home</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Running Instances', value: '3', color: 'emerald' },
                  { label: 'Volumes', value: '5', color: 'sky' },
                  { label: 'Security Groups', value: '2', color: 'violet' },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-white/50">{stat.label}</p>
                    <p className={`text-2xl font-bold text-${stat.color}-400 mt-1`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'ec2' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">EC2 Dashboard</h2>
                <Button
                  onClick={() => onAction('click-launch')}
                  className={cn(
                    "transition-all",
                    isHighlighted('click-launch') 
                      ? "bg-[#ff9900] hover:bg-[#ff9900]/90 text-black animate-pulse ring-4 ring-[#ff9900]/30" 
                      : "bg-[#ff9900]/20 text-[#ff9900] hover:bg-[#ff9900]/30"
                  )}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Launch Instance
                  {isHighlighted('click-launch') && <span className="ml-2">👆</span>}
                </Button>
              </div>

              <div className="rounded-xl border border-white/10 overflow-hidden">
                <div className="bg-white/5 px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium text-white">Instances (3)</p>
                </div>
                <div className="divide-y divide-white/5">
                  {['web-server-1', 'api-server', 'db-server'].map((name) => (
                    <div key={name} className="px-4 py-3 flex items-center gap-4">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-sm text-white">{name}</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">Running</Badge>
                      <span className="text-xs text-white/40 ml-auto">t2.micro</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'launch' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Launch Instance</h2>
              
              <div className="space-y-4">
                <div className={cn(
                  "p-4 rounded-xl border transition-all",
                  isHighlighted('select-ami') 
                    ? "bg-[#ff9900]/10 border-[#ff9900]/50 ring-2 ring-[#ff9900]/30" 
                    : "bg-white/5 border-white/10"
                )}>
                  <p className="text-sm font-medium text-white mb-3">Step 1: Choose AMI</p>
                  <div className="space-y-2">
                    {['Amazon Linux 2 AMI', 'Ubuntu Server 22.04', 'Windows Server 2022'].map((ami, i) => (
                      <button
                        key={ami}
                        onClick={() => i === 0 && onAction('select-ami')}
                        className={cn(
                          "w-full p-3 rounded-lg text-left text-sm transition-all",
                          i === 0 && isHighlighted('select-ami')
                            ? "bg-[#ff9900] text-black font-medium animate-pulse"
                            : "bg-white/5 text-white/70 hover:bg-white/10"
                        )}
                      >
                        {ami}
                        {i === 0 && isHighlighted('select-ami') && <span className="float-right">👆 Select!</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={cn(
                  "p-4 rounded-xl border transition-all",
                  isHighlighted('select-type') 
                    ? "bg-[#ff9900]/10 border-[#ff9900]/50 ring-2 ring-[#ff9900]/30" 
                    : "bg-white/5 border-white/10"
                )}>
                  <p className="text-sm font-medium text-white mb-3">Step 2: Instance Type</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['t2.micro (Free)', 't2.small', 't2.medium', 't2.large'].map((type, i) => (
                      <button
                        key={type}
                        onClick={() => i === 0 && onAction('select-type')}
                        className={cn(
                          "p-3 rounded-lg text-sm transition-all",
                          i === 0 && isHighlighted('select-type')
                            ? "bg-[#ff9900] text-black font-medium animate-pulse"
                            : "bg-white/5 text-white/70 hover:bg-white/10"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={cn(
                  "p-4 rounded-xl border transition-all",
                  isHighlighted('configure-security') 
                    ? "bg-[#ff9900]/10 border-[#ff9900]/50 ring-2 ring-[#ff9900]/30" 
                    : "bg-white/5 border-white/10"
                )}>
                  <p className="text-sm font-medium text-white mb-3">Step 3: Security Group</p>
                  <Button
                    onClick={() => onAction('configure-security')}
                    variant="outline"
                    className={cn(
                      "w-full",
                      isHighlighted('configure-security')
                        ? "bg-[#ff9900] text-black border-[#ff9900] animate-pulse"
                        : "border-white/20 text-white/70"
                    )}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Configure Security Group
                  </Button>
                </div>

                <Button
                  onClick={() => onAction('review-launch')}
                  className={cn(
                    "w-full",
                    isHighlighted('review-launch')
                      ? "bg-[#ff9900] hover:bg-[#ff9900]/90 text-black animate-pulse ring-4 ring-[#ff9900]/30"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  )}
                >
                  Review and Launch
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Docker Simulation
  const DockerSimulation = () => (
    <div className="h-full flex flex-col bg-[#0d1117]">
      <div className="h-12 bg-[#161b22] flex items-center px-4 gap-4 border-b border-white/10">
        <Container className="w-6 h-6 text-[#2496ed]" />
        <span className="text-white font-medium">Docker Desktop</span>
      </div>

      <div className="flex-1 flex">
        <div className="w-48 bg-[#0d1117] border-r border-white/10 p-3">
          <div className="space-y-1">
            {[
              { icon: Box, label: 'Containers', action: 'open-terminal' },
              { icon: Layers, label: 'Images', action: '' },
              { icon: HardDrive, label: 'Volumes', action: '' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => item.action && onAction(item.action)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                  isHighlighted(item.action) 
                    ? "bg-[#2496ed] text-white font-medium animate-pulse" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="h-full rounded-xl bg-[#1a1f2e] border border-white/10 overflow-hidden">
            <div className="h-8 bg-[#252b3b] flex items-center px-3 gap-2">
              <Terminal className="w-4 h-4 text-white/50" />
              <span className="text-xs text-white/70">Terminal</span>
            </div>
            <div className="p-4 font-mono text-sm space-y-2">
              <p className="text-white/50">$ docker --version</p>
              <p className="text-emerald-400">Docker version 24.0.7</p>
              
              {currentStep?.action === 'pull-image' && (
                <div className="mt-4">
                  <p className="text-white/50">$ <span className="text-white animate-pulse">docker pull nginx:latest</span> 👆 Run this!</p>
                  <Button
                    onClick={() => onAction('pull-image')}
                    size="sm"
                    className="mt-2 bg-[#2496ed] hover:bg-[#2496ed]/90 animate-pulse"
                  >
                    <Play className="w-3 h-3 mr-1" /> Execute
                  </Button>
                </div>
              )}

              {currentStep?.action === 'create-container' && (
                <div className="mt-4">
                  <p className="text-emerald-400">✓ nginx:latest pulled successfully</p>
                  <p className="text-white/50 mt-2">$ <span className="text-white animate-pulse">docker run -d -p 80:80 nginx</span></p>
                  <Button
                    onClick={() => onAction('create-container')}
                    size="sm"
                    className="mt-2 bg-[#2496ed] hover:bg-[#2496ed]/90 animate-pulse"
                  >
                    <Play className="w-3 h-3 mr-1" /> Execute
                  </Button>
                </div>
              )}

              {currentStep?.action === 'verify-status' && (
                <div className="mt-4">
                  <p className="text-emerald-400">✓ Container started: a1b2c3d4e5f6</p>
                  <p className="text-white/50 mt-2">$ <span className="text-white animate-pulse">docker ps</span></p>
                  <Button
                    onClick={() => onAction('verify-status')}
                    size="sm"
                    className="mt-2 bg-[#2496ed] hover:bg-[#2496ed]/90 animate-pulse"
                  >
                    <Play className="w-3 h-3 mr-1" /> Execute
                  </Button>
                </div>
              )}

              {currentStep?.action === 'view-logs' && (
                <div className="mt-4">
                  <p className="text-emerald-400">CONTAINER ID   IMAGE   STATUS       PORTS</p>
                  <p className="text-white/70">a1b2c3d4e5f6   nginx   Up 2 min     0.0.0.0:80-{'>'}80/tcp</p>
                  <p className="text-white/50 mt-2">$ <span className="text-white animate-pulse">docker logs a1b2c3</span></p>
                  <Button
                    onClick={() => onAction('view-logs')}
                    size="sm"
                    className="mt-2 bg-[#2496ed] hover:bg-[#2496ed]/90 animate-pulse"
                  >
                    <Play className="w-3 h-3 mr-1" /> Execute
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // GitHub Simulation
  const GitHubSimulation = () => (
    <div className="h-full flex flex-col bg-[#0d1117]">
      <div className="h-14 bg-[#161b22] flex items-center px-6 gap-4 border-b border-white/10">
        <Github className="w-8 h-8 text-white" />
        <span className="text-white/50">/</span>
        <span className="text-white font-medium">your-username</span>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {view === 'dashboard' && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Repositories</h2>
              <Button
                onClick={() => onAction('create-repo')}
                className={cn(
                  "transition-all",
                  isHighlighted('create-repo')
                    ? "bg-emerald-500 hover:bg-emerald-600 animate-pulse ring-4 ring-emerald-500/30"
                    : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                )}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Repository
              </Button>
            </div>

            <div className="space-y-3">
              {['my-project', 'portfolio', 'dotfiles'].map((repo) => (
                <div key={repo} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <FolderOpen className="w-5 h-5 text-white/50" />
                  <span className="text-white">{repo}</span>
                  <Badge className="bg-white/10 text-white/50 text-xs">Public</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'repo' && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <FolderOpen className="w-5 h-5 text-white/50" />
              <span className="text-white font-medium">my-new-project</span>
              <Badge className="bg-white/10 text-white/50 text-xs">Public</Badge>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  onClick={() => onAction('add-readme')}
                  variant="outline"
                  className={cn(
                    "transition-all",
                    isHighlighted('add-readme')
                      ? "bg-emerald-500 text-white border-emerald-500 animate-pulse ring-2 ring-emerald-500/30"
                      : "border-white/20 text-white/70"
                  )}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Add README
                </Button>
                <Button
                  onClick={() => onAction('create-branch')}
                  variant="outline"
                  className={cn(
                    "transition-all",
                    isHighlighted('create-branch')
                      ? "bg-emerald-500 text-white border-emerald-500 animate-pulse ring-2 ring-emerald-500/30"
                      : "border-white/20 text-white/70"
                  )}
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  New Branch
                </Button>
              </div>

              <div className="rounded-xl border border-white/10 overflow-hidden">
                <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center gap-3">
                  <GitBranch className="w-4 h-4 text-white/50" />
                  <span className="text-sm text-white">main</span>
                </div>
                <div className="divide-y divide-white/5">
                  <div className="px-4 py-3 flex items-center gap-3">
                    <FileText className="w-4 h-4 text-white/50" />
                    <span className="text-sm text-white">README.md</span>
                    <span className="text-xs text-white/40 ml-auto">Initial commit</span>
                  </div>
                </div>
              </div>

              {isHighlighted('make-changes') && (
                <Button
                  onClick={() => onAction('make-changes')}
                  className="bg-emerald-500 hover:bg-emerald-600 animate-pulse"
                >
                  Edit Files
                </Button>
              )}

              {isHighlighted('open-pr') && (
                <Button
                  onClick={() => onAction('open-pr')}
                  className="bg-emerald-500 hover:bg-emerald-600 animate-pulse"
                >
                  <GitPullRequest className="w-4 h-4 mr-2" />
                  Open Pull Request
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {platform === 'aws' && <AWSSimulation />}
      {platform === 'docker' && <DockerSimulation />}
      {platform === 'github' && <GitHubSimulation />}
    </div>
  );
};

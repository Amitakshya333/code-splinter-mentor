import { useState, useRef, useEffect } from "react";
import { 
  X, Terminal, Search, Play, CheckCircle2, Folder, 
  File, GitBranch, GitCommit, GitPullRequest, Star,
  Box, Layers, Server, RefreshCw, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavigatorStep } from "@/hooks/useNavigatorState";

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success';
  content: string;
  delay?: number;
}

interface PlatformSimulatorsProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep?: NavigatorStep;
  onStepComplete: (action: string) => void;
  platform: string;
}

// Docker Terminal Simulator
export const DockerTerminal = ({ 
  currentStep, 
  onStepComplete 
}: { 
  currentStep?: NavigatorStep; 
  onStepComplete: (action: string) => void;
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Docker Desktop 4.25.0 (126437)' },
    { type: 'output', content: 'Docker Engine v24.0.6' },
    { type: 'output', content: '' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  const getExpectedCommand = () => {
    if (!currentStep) return '';
    const action = currentStep.action.toLowerCase();
    if (action.includes('pull')) return 'docker pull nginx:latest';
    if (action.includes('run')) return 'docker run -d -p 80:80 nginx';
    if (action.includes('build')) return 'docker build -t myapp .';
    if (action.includes('ps')) return 'docker ps';
    if (action.includes('images')) return 'docker images';
    if (action.includes('stop')) return 'docker stop container_id';
    if (action.includes('compose')) return 'docker-compose up -d';
    return 'docker --help';
  };

  const getCommandOutput = (cmd: string): TerminalLine[] => {
    if (cmd.includes('pull nginx')) {
      return [
        { type: 'output', content: 'latest: Pulling from library/nginx', delay: 200 },
        { type: 'output', content: 'a2abf6c4d29d: Pull complete', delay: 400 },
        { type: 'output', content: '7f87dd8a1b2c: Pull complete', delay: 600 },
        { type: 'output', content: 'Digest: sha256:0d17b565c37bc...', delay: 800 },
        { type: 'success', content: 'Status: Downloaded newer image for nginx:latest', delay: 1000 },
      ];
    }
    if (cmd.includes('run') && cmd.includes('nginx')) {
      return [
        { type: 'success', content: '8f3c4e2a1b9d7e6f5a4b3c2d1e0f9a8b7c6d5e4f', delay: 300 },
        { type: 'output', content: '✓ Container started successfully', delay: 500 },
      ];
    }
    if (cmd.includes('build')) {
      return [
        { type: 'output', content: '[+] Building 2.3s (8/8) FINISHED', delay: 200 },
        { type: 'output', content: ' => [internal] load build definition from Dockerfile', delay: 300 },
        { type: 'output', content: ' => [1/3] FROM node:18-alpine', delay: 400 },
        { type: 'output', content: ' => [2/3] COPY package*.json ./', delay: 500 },
        { type: 'output', content: ' => [3/3] RUN npm install', delay: 600 },
        { type: 'success', content: ' => exporting to image myapp:latest', delay: 800 },
      ];
    }
    if (cmd === 'docker ps') {
      return [
        { type: 'output', content: 'CONTAINER ID   IMAGE   COMMAND                  STATUS          PORTS' },
        { type: 'output', content: '8f3c4e2a1b9d   nginx   "/docker-entrypoint.…"   Up 2 minutes    0.0.0.0:80->80/tcp' },
      ];
    }
    if (cmd === 'docker images') {
      return [
        { type: 'output', content: 'REPOSITORY   TAG       IMAGE ID       CREATED       SIZE' },
        { type: 'output', content: 'nginx        latest    a2abf6c4d29d   2 days ago    142MB' },
        { type: 'output', content: 'myapp        latest    5d7e6f4a3b2c   5 minutes     487MB' },
      ];
    }
    if (cmd.includes('compose')) {
      return [
        { type: 'output', content: '[+] Running 3/3', delay: 200 },
        { type: 'output', content: ' ✔ Network app_default Created', delay: 400 },
        { type: 'output', content: ' ✔ Container app-db-1 Started', delay: 600 },
        { type: 'success', content: ' ✔ Container app-web-1 Started', delay: 800 },
      ];
    }
    return [{ type: 'error', content: `Command not found: ${cmd}` }];
  };

  const executeCommand = async () => {
    if (!currentInput.trim() || isRunning) return;
    
    setIsRunning(true);
    setLines(prev => [...prev, { type: 'input', content: `$ ${currentInput}` }]);
    
    const outputs = getCommandOutput(currentInput);
    for (const output of outputs) {
      await new Promise(resolve => setTimeout(resolve, output.delay || 100));
      setLines(prev => [...prev, output]);
    }
    
    setIsRunning(false);
    setCurrentInput('');
    
    if (currentStep && currentInput.includes(getExpectedCommand().split(' ')[1])) {
      setTimeout(() => onStepComplete(currentStep.action), 500);
    }
  };

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [lines]);

  const expectedCmd = getExpectedCommand();

  return (
    <div className="bg-[#1e1e1e] rounded-xl overflow-hidden font-mono text-sm">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-b border-[#3d3d3d]">
        <Terminal className="w-4 h-4 text-blue-400" />
        <span className="text-gray-300">Docker Terminal</span>
        <div className="ml-auto flex gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
      </div>
      
      <div ref={terminalRef} className="h-64 overflow-auto p-4 space-y-1">
        {lines.map((line, i) => (
          <div key={i} className={cn(
            line.type === 'input' && "text-green-400",
            line.type === 'output' && "text-gray-300",
            line.type === 'error' && "text-red-400",
            line.type === 'success' && "text-green-400"
          )}>
            {line.content}
          </div>
        ))}
        
        <div className="flex items-center gap-2">
          <span className="text-green-400">$</span>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeCommand()}
            className="flex-1 bg-transparent text-white outline-none"
            placeholder="Type Docker command..."
            disabled={isRunning}
          />
          {isRunning && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
        </div>
      </div>
      
      {currentStep && (
        <div className="px-4 py-3 bg-blue-500/10 border-t border-blue-500/20">
          <p className="text-xs text-blue-400 mb-2">💡 Expected command:</p>
          <button 
            onClick={() => setCurrentInput(expectedCmd)}
            className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
          >
            {expectedCmd}
          </button>
        </div>
      )}
    </div>
  );
};

// GitHub UI Simulator
export const GitHubSimulator = ({ 
  currentStep, 
  onStepComplete 
}: { 
  currentStep?: NavigatorStep; 
  onStepComplete: (action: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'issues' | 'pr' | 'actions'>('code');
  
  const handleAction = (action: string) => {
    if (currentStep) {
      onStepComplete(action);
    }
  };

  const isActionHighlighted = (action: string) => {
    return currentStep?.action.toLowerCase().includes(action.toLowerCase());
  };

  return (
    <div className="bg-[#0d1117] rounded-xl overflow-hidden text-sm">
      {/* GitHub Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
        <GitBranch className="w-5 h-5 text-gray-400" />
        <span className="text-gray-300 font-semibold">my-awesome-project</span>
        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-1 text-gray-400 hover:text-white">
            <Star className="w-4 h-4" />
            <span>Star</span>
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-[#30363d]">
        {[
          { id: 'code', label: 'Code', icon: Folder },
          { id: 'issues', label: 'Issues', icon: File },
          { id: 'pr', label: 'Pull requests', icon: GitPullRequest },
          { id: 'actions', label: 'Actions', icon: Play },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
              activeTab === tab.id 
                ? "text-white border-b-2 border-orange-500" 
                : "text-gray-400 hover:text-white"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="p-4 min-h-[200px]">
        {activeTab === 'code' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 rounded bg-[#161b22]">
              <GitBranch className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">main</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400 text-xs">3 branches</span>
            </div>
            
            <div className="space-y-1">
              {['src/', 'docs/', 'README.md', 'package.json'].map(file => (
                <div key={file} className="flex items-center gap-2 p-2 rounded hover:bg-[#161b22] cursor-pointer">
                  {file.includes('/') ? <Folder className="w-4 h-4 text-blue-400" /> : <File className="w-4 h-4 text-gray-400" />}
                  <span className="text-gray-300">{file}</span>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => handleAction('clone')}
              className={cn(
                "mt-4 px-4 py-2 rounded-lg flex items-center gap-2 transition-all",
                isActionHighlighted('clone')
                  ? "bg-green-600 text-white ring-2 ring-green-400/50 animate-pulse"
                  : "bg-[#238636] text-white hover:bg-[#2ea043]"
              )}
            >
              <GitBranch className="w-4 h-4" />
              Clone Repository
            </button>
          </div>
        )}
        
        {activeTab === 'pr' && (
          <div className="space-y-3">
            <button
              onClick={() => handleAction('pull-request')}
              className={cn(
                "w-full p-3 rounded-lg flex items-center gap-3 transition-all text-left",
                isActionHighlighted('pull-request')
                  ? "bg-green-600/20 border border-green-500 ring-2 ring-green-400/30"
                  : "bg-[#161b22] hover:bg-[#1f242b]"
              )}
            >
              <GitPullRequest className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-medium">New Pull Request</p>
                <p className="text-gray-400 text-xs">Create a new pull request</p>
              </div>
            </button>
            
            <div className="p-3 rounded-lg bg-[#161b22]">
              <div className="flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Add new feature #42</span>
              </div>
              <p className="text-gray-500 text-xs mt-1">Opened 2 hours ago by developer</p>
            </div>
          </div>
        )}
        
        {activeTab === 'actions' && (
          <div className="space-y-3">
            <button
              onClick={() => handleAction('workflow')}
              className={cn(
                "w-full p-3 rounded-lg flex items-center gap-3 transition-all text-left",
                isActionHighlighted('workflow')
                  ? "bg-blue-600/20 border border-blue-500 ring-2 ring-blue-400/30"
                  : "bg-[#161b22] hover:bg-[#1f242b]"
              )}
            >
              <Play className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">Run Workflow</p>
                <p className="text-gray-400 text-xs">Trigger CI/CD pipeline</p>
              </div>
            </button>
            
            <div className="p-3 rounded-lg bg-[#161b22] flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-gray-300">CI Build</p>
                <p className="text-gray-500 text-xs">Completed in 2m 34s</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'issues' && (
          <div className="space-y-3">
            <button
              onClick={() => handleAction('issue')}
              className={cn(
                "w-full p-3 rounded-lg flex items-center gap-3 transition-all text-left",
                isActionHighlighted('issue')
                  ? "bg-green-600/20 border border-green-500 ring-2 ring-green-400/30"
                  : "bg-[#161b22] hover:bg-[#1f242b]"
              )}
            >
              <File className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-medium">New Issue</p>
                <p className="text-gray-400 text-xs">Report a bug or request a feature</p>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Kubernetes Terminal Simulator
export const KubernetesTerminal = ({ 
  currentStep, 
  onStepComplete 
}: { 
  currentStep?: NavigatorStep; 
  onStepComplete: (action: string) => void;
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'kubectl version: v1.28.0' },
    { type: 'output', content: 'Connected to: minikube' },
    { type: 'output', content: '' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const getExpectedCommand = () => {
    if (!currentStep) return '';
    const action = currentStep.action.toLowerCase();
    if (action.includes('get pods')) return 'kubectl get pods';
    if (action.includes('apply')) return 'kubectl apply -f deployment.yaml';
    if (action.includes('deploy')) return 'kubectl create deployment nginx --image=nginx';
    if (action.includes('service')) return 'kubectl expose deployment nginx --port=80';
    if (action.includes('logs')) return 'kubectl logs pod-name';
    if (action.includes('scale')) return 'kubectl scale deployment nginx --replicas=3';
    if (action.includes('describe')) return 'kubectl describe pod pod-name';
    return 'kubectl --help';
  };

  const getCommandOutput = (cmd: string): TerminalLine[] => {
    if (cmd.includes('get pods')) {
      return [
        { type: 'output', content: 'NAME                     READY   STATUS    RESTARTS   AGE' },
        { type: 'output', content: 'nginx-7854ff8877-x2bvz   1/1     Running   0          5m' },
        { type: 'output', content: 'nginx-7854ff8877-k9mjx   1/1     Running   0          5m' },
      ];
    }
    if (cmd.includes('apply')) {
      return [
        { type: 'success', content: 'deployment.apps/nginx created', delay: 300 },
        { type: 'success', content: 'service/nginx created', delay: 500 },
      ];
    }
    if (cmd.includes('create deployment')) {
      return [
        { type: 'success', content: 'deployment.apps/nginx created', delay: 400 },
      ];
    }
    if (cmd.includes('expose')) {
      return [
        { type: 'success', content: 'service/nginx exposed', delay: 300 },
      ];
    }
    if (cmd.includes('scale')) {
      return [
        { type: 'success', content: 'deployment.apps/nginx scaled', delay: 300 },
      ];
    }
    if (cmd.includes('get nodes')) {
      return [
        { type: 'output', content: 'NAME       STATUS   ROLES           AGE   VERSION' },
        { type: 'output', content: 'minikube   Ready    control-plane   10d   v1.28.0' },
      ];
    }
    if (cmd.includes('get svc') || cmd.includes('get services')) {
      return [
        { type: 'output', content: 'NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE' },
        { type: 'output', content: 'kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP   10d' },
        { type: 'output', content: 'nginx        ClusterIP   10.96.123.45    <none>        80/TCP    5m' },
      ];
    }
    if (cmd.includes('describe')) {
      return [
        { type: 'output', content: 'Name:         nginx-7854ff8877-x2bvz' },
        { type: 'output', content: 'Namespace:    default' },
        { type: 'output', content: 'Status:       Running' },
        { type: 'output', content: 'IP:           172.17.0.4' },
        { type: 'output', content: 'Containers:   nginx (running)' },
      ];
    }
    return [{ type: 'error', content: `Error: ${cmd.split(' ')[0]}: command not found` }];
  };

  const executeCommand = async () => {
    if (!currentInput.trim() || isRunning) return;
    
    setIsRunning(true);
    setLines(prev => [...prev, { type: 'input', content: `$ ${currentInput}` }]);
    
    const outputs = getCommandOutput(currentInput);
    for (const output of outputs) {
      await new Promise(resolve => setTimeout(resolve, output.delay || 100));
      setLines(prev => [...prev, output]);
    }
    
    setIsRunning(false);
    setCurrentInput('');
    
    if (currentStep) {
      setTimeout(() => onStepComplete(currentStep.action), 500);
    }
  };

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [lines]);

  const expectedCmd = getExpectedCommand();

  return (
    <div className="bg-[#1a1a2e] rounded-xl overflow-hidden font-mono text-sm">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#16213e] border-b border-[#0f3460]">
        <Box className="w-4 h-4 text-blue-400" />
        <span className="text-gray-300">Kubernetes Terminal</span>
        <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">kubectl</span>
      </div>
      
      <div ref={terminalRef} className="h-64 overflow-auto p-4 space-y-1">
        {lines.map((line, i) => (
          <div key={i} className={cn(
            line.type === 'input' && "text-cyan-400",
            line.type === 'output' && "text-gray-300",
            line.type === 'error' && "text-red-400",
            line.type === 'success' && "text-green-400"
          )}>
            {line.content}
          </div>
        ))}
        
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">$</span>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeCommand()}
            className="flex-1 bg-transparent text-white outline-none"
            placeholder="Type kubectl command..."
            disabled={isRunning}
          />
          {isRunning && <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />}
        </div>
      </div>
      
      {currentStep && (
        <div className="px-4 py-3 bg-cyan-500/10 border-t border-cyan-500/20">
          <p className="text-xs text-cyan-400 mb-2">💡 Expected command:</p>
          <button 
            onClick={() => setCurrentInput(expectedCmd)}
            className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
          >
            {expectedCmd}
          </button>
        </div>
      )}
    </div>
  );
};

// Git Terminal Simulator
export const GitTerminal = ({ 
  currentStep, 
  onStepComplete 
}: { 
  currentStep?: NavigatorStep; 
  onStepComplete: (action: string) => void;
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'git version 2.42.0' },
    { type: 'output', content: '' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const getExpectedCommand = () => {
    if (!currentStep) return '';
    const action = currentStep.action.toLowerCase();
    if (action.includes('clone')) return 'git clone https://github.com/user/repo.git';
    if (action.includes('commit')) return 'git commit -m "Initial commit"';
    if (action.includes('push')) return 'git push origin main';
    if (action.includes('pull')) return 'git pull origin main';
    if (action.includes('branch')) return 'git checkout -b feature-branch';
    if (action.includes('merge')) return 'git merge feature-branch';
    if (action.includes('init')) return 'git init';
    if (action.includes('add')) return 'git add .';
    return 'git status';
  };

  const getCommandOutput = (cmd: string): TerminalLine[] => {
    if (cmd.includes('clone')) {
      return [
        { type: 'output', content: 'Cloning into \'repo\'...', delay: 200 },
        { type: 'output', content: 'remote: Enumerating objects: 156, done.', delay: 400 },
        { type: 'output', content: 'remote: Counting objects: 100% (156/156), done.', delay: 600 },
        { type: 'success', content: 'Receiving objects: 100% (156/156), 1.24 MiB | 2.48 MiB/s, done.', delay: 800 },
      ];
    }
    if (cmd.includes('commit')) {
      return [
        { type: 'success', content: '[main 8f3c4e2] Initial commit', delay: 200 },
        { type: 'output', content: ' 5 files changed, 234 insertions(+)', delay: 300 },
      ];
    }
    if (cmd.includes('push')) {
      return [
        { type: 'output', content: 'Enumerating objects: 5, done.', delay: 200 },
        { type: 'output', content: 'Counting objects: 100% (5/5), done.', delay: 400 },
        { type: 'success', content: 'To https://github.com/user/repo.git', delay: 600 },
        { type: 'success', content: '   abc1234..8f3c4e2  main -> main', delay: 700 },
      ];
    }
    if (cmd.includes('status')) {
      return [
        { type: 'output', content: 'On branch main' },
        { type: 'output', content: 'Your branch is up to date with \'origin/main\'.' },
        { type: 'success', content: 'nothing to commit, working tree clean' },
      ];
    }
    if (cmd.includes('checkout -b')) {
      return [
        { type: 'success', content: 'Switched to a new branch \'feature-branch\'', delay: 200 },
      ];
    }
    if (cmd.includes('add')) {
      return [
        { type: 'success', content: 'Changes staged for commit', delay: 200 },
      ];
    }
    if (cmd.includes('init')) {
      return [
        { type: 'success', content: 'Initialized empty Git repository in /project/.git/', delay: 200 },
      ];
    }
    return [{ type: 'error', content: `git: '${cmd.split(' ')[1]}' is not a git command` }];
  };

  const executeCommand = async () => {
    if (!currentInput.trim() || isRunning) return;
    
    setIsRunning(true);
    setLines(prev => [...prev, { type: 'input', content: `$ ${currentInput}` }]);
    
    const outputs = getCommandOutput(currentInput);
    for (const output of outputs) {
      await new Promise(resolve => setTimeout(resolve, output.delay || 100));
      setLines(prev => [...prev, output]);
    }
    
    setIsRunning(false);
    setCurrentInput('');
    
    if (currentStep) {
      setTimeout(() => onStepComplete(currentStep.action), 500);
    }
  };

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [lines]);

  const expectedCmd = getExpectedCommand();

  return (
    <div className="bg-[#1c1c1c] rounded-xl overflow-hidden font-mono text-sm">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-b border-[#404040]">
        <GitCommit className="w-4 h-4 text-orange-400" />
        <span className="text-gray-300">Git Terminal</span>
      </div>
      
      <div ref={terminalRef} className="h-64 overflow-auto p-4 space-y-1">
        {lines.map((line, i) => (
          <div key={i} className={cn(
            line.type === 'input' && "text-yellow-400",
            line.type === 'output' && "text-gray-300",
            line.type === 'error' && "text-red-400",
            line.type === 'success' && "text-green-400"
          )}>
            {line.content}
          </div>
        ))}
        
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">$</span>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeCommand()}
            className="flex-1 bg-transparent text-white outline-none"
            placeholder="Type git command..."
            disabled={isRunning}
          />
          {isRunning && <RefreshCw className="w-4 h-4 text-orange-400 animate-spin" />}
        </div>
      </div>
      
      {currentStep && (
        <div className="px-4 py-3 bg-orange-500/10 border-t border-orange-500/20">
          <p className="text-xs text-orange-400 mb-2">💡 Expected command:</p>
          <button 
            onClick={() => setCurrentInput(expectedCmd)}
            className="px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-lg text-sm hover:bg-orange-500/30 transition-colors"
          >
            {expectedCmd}
          </button>
        </div>
      )}
    </div>
  );
};

// AWS Deep Links helper
export const getAWSDeepLink = (action: string): string => {
  const links: Record<string, string> = {
    'open-console': 'https://console.aws.amazon.com/ec2/home#Instances:',
    'click-launch': 'https://console.aws.amazon.com/ec2/home#LaunchInstances:',
    'open-lambda': 'https://console.aws.amazon.com/lambda/home#/functions',
    'open-s3': 'https://s3.console.aws.amazon.com/s3/home',
    'open-rds': 'https://console.aws.amazon.com/rds/home#databases:',
    'open-vpc': 'https://console.aws.amazon.com/vpc/home#vpcs:',
    'open-iam': 'https://console.aws.amazon.com/iam/home#/home',
    'open-cloudwatch': 'https://console.aws.amazon.com/cloudwatch/home',
    'open-dynamodb': 'https://console.aws.amazon.com/dynamodb/home#tables',
    'open-ecs': 'https://console.aws.amazon.com/ecs/home#/clusters',
    'open-eks': 'https://console.aws.amazon.com/eks/home#/clusters',
  };
  
  return links[action] || 'https://console.aws.amazon.com';
};

// Main Platform Simulator wrapper with deep linking
export const EnhancedPlatformSimulator = ({
  isOpen,
  onClose,
  currentStep,
  onStepComplete,
  platform,
}: PlatformSimulatorsProps) => {
  if (!isOpen) return null;

  const handleOpenRealConsole = () => {
    if (platform === 'aws' && currentStep) {
      const url = getAWSDeepLink(currentStep.action);
      window.open(url, '_blank');
    } else if (platform === 'github') {
      window.open('https://github.com', '_blank');
    } else if (platform === 'docker') {
      window.open('https://hub.docker.com', '_blank');
    }
  };

  const renderSimulator = () => {
    switch (platform) {
      case 'docker':
      case 'containers':
        return <DockerTerminal currentStep={currentStep} onStepComplete={onStepComplete} />;
      case 'github':
        return <GitHubSimulator currentStep={currentStep} onStepComplete={onStepComplete} />;
      case 'git':
        return <GitTerminal currentStep={currentStep} onStepComplete={onStepComplete} />;
      case 'kubernetes':
      case 'devops':
        return <KubernetesTerminal currentStep={currentStep} onStepComplete={onStepComplete} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      <div className="fixed inset-4 md:inset-10 lg:inset-20 z-50 animate-in zoom-in-95 duration-300">
        <div className="bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden h-full flex flex-col">
          {/* Header */}
          <div className="bg-secondary/50 px-4 py-3 flex items-center gap-3 border-b border-border/50">
            <div className="flex gap-1.5">
              <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 flex items-center gap-2 bg-background/50 rounded-lg px-3 py-1.5">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {platform === 'docker' && 'Docker Terminal'}
                {platform === 'github' && 'github.com'}
                {platform === 'git' && 'Git Terminal'}
                {(platform === 'kubernetes' || platform === 'devops') && 'Kubernetes Terminal'}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleOpenRealConsole}
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open Real Console
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-auto p-6 bg-background">
            {/* Current Step */}
            {currentStep && (
              <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <h3 className="font-medium text-foreground">{currentStep.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{currentStep.description}</p>
                {currentStep.tip && (
                  <p className="text-xs text-primary mt-2">💡 {currentStep.tip}</p>
                )}
              </div>
            )}
            
            {/* Platform-specific simulator */}
            {renderSimulator()}
            
            <p className="text-center text-sm text-muted-foreground mt-8">
              Use the terminal to practice commands. Click "Open Real Console" to use the actual platform.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

import { useState, useRef, useEffect } from "react";
import { 
  X, Terminal, Search, Play, CheckCircle2, Folder, 
  File, GitBranch, GitCommit, GitPullRequest, Star,
  Box, Layers, Server, RefreshCw, ExternalLink, Database,
  Network, Package, FileCode, Eye, EyeOff, AlertCircle
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

// Docker Compose Visualization
interface DockerService {
  name: string;
  image: string;
  status: 'stopped' | 'starting' | 'running' | 'error';
  ports?: string[];
  volumes?: string[];
  depends_on?: string[];
}

const DockerComposeVisualization = ({
  services,
  onServiceAction
}: {
  services: DockerService[];
  onServiceAction: (service: string, action: string) => void;
}) => {
  const getStatusColor = (status: DockerService['status']) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'starting': return 'bg-yellow-500 animate-pulse';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-[#1a1a2e] rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-purple-400" />
        <span className="text-white font-medium">docker-compose.yml</span>
        <span className="ml-auto text-xs text-gray-400">{services.length} services</span>
      </div>
      
      <div className="space-y-3">
        {services.map((service, idx) => (
          <div key={service.name} className="relative">
            {/* Connection lines to dependencies */}
            {service.depends_on && service.depends_on.length > 0 && (
              <div className="absolute -left-2 top-1/2 w-2 h-px bg-gray-600" />
            )}
            
            <div className="bg-[#16213e] rounded-lg p-3 border border-[#0f3460]">
              <div className="flex items-center gap-3">
                <div className={cn("w-2.5 h-2.5 rounded-full", getStatusColor(service.status))} />
                <Box className="w-4 h-4 text-blue-400" />
                <span className="text-white font-medium">{service.name}</span>
                <span className="text-xs text-gray-400">{service.image}</span>
                
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => onServiceAction(service.name, 'start')}
                    className="p-1 rounded bg-green-500/20 hover:bg-green-500/30 text-green-400"
                    disabled={service.status === 'running'}
                  >
                    <Play className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onServiceAction(service.name, 'logs')}
                    className="p-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                  >
                    <FileCode className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              {/* Ports */}
              {service.ports && service.ports.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {service.ports.map(port => (
                    <span key={port} className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded">
                      {port}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Volumes */}
              {service.volumes && service.volumes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {service.volumes.map(vol => (
                    <span key={vol} className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      {vol}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Dependencies */}
              {service.depends_on && service.depends_on.length > 0 && (
                <div className="mt-2 text-xs text-gray-400">
                  depends_on: {service.depends_on.join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Network visualization */}
      <div className="mt-4 p-3 bg-[#0f3460]/50 rounded-lg border border-[#0f3460]">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 text-sm">Network: app_default</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {services.map(s => (
            <span key={s.name} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
              {s.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Docker Terminal Simulator with Compose
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
  const [showCompose, setShowCompose] = useState(false);
  const [services, setServices] = useState<DockerService[]>([
    { name: 'web', image: 'nginx:latest', status: 'stopped', ports: ['80:80'], depends_on: ['db', 'redis'] },
    { name: 'api', image: 'node:18-alpine', status: 'stopped', ports: ['3000:3000'], depends_on: ['db'] },
    { name: 'db', image: 'postgres:15', status: 'stopped', ports: ['5432:5432'], volumes: ['pgdata:/var/lib/postgresql/data'] },
    { name: 'redis', image: 'redis:7-alpine', status: 'stopped', ports: ['6379:6379'] },
  ]);
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
    if (action.includes('compose up')) return 'docker-compose up -d';
    if (action.includes('compose down')) return 'docker-compose down';
    if (action.includes('compose logs')) return 'docker-compose logs -f';
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
    if (cmd === 'docker ps' || cmd === 'docker ps -a') {
      const runningServices = services.filter(s => s.status === 'running');
      if (runningServices.length === 0) {
        return [
          { type: 'output', content: 'CONTAINER ID   IMAGE   COMMAND   STATUS   PORTS' },
        ];
      }
      return [
        { type: 'output', content: 'CONTAINER ID   IMAGE               COMMAND                  STATUS          PORTS' },
        ...runningServices.map(s => ({
          type: 'output' as const,
          content: `${Math.random().toString(16).slice(2, 14)}   ${s.image.padEnd(18)}   "..."   Up ${Math.floor(Math.random() * 10) + 1}m    ${s.ports?.join(', ') || ''}`
        }))
      ];
    }
    if (cmd === 'docker images') {
      return [
        { type: 'output', content: 'REPOSITORY   TAG       IMAGE ID       CREATED       SIZE' },
        { type: 'output', content: 'nginx        latest    a2abf6c4d29d   2 days ago    142MB' },
        { type: 'output', content: 'postgres     15        b2c9d8e7f6a5   3 days ago    379MB' },
        { type: 'output', content: 'node         18-alpine c3d4e5f6a7b8   1 week ago    167MB' },
        { type: 'output', content: 'redis        7-alpine  d4e5f6a7b8c9   4 days ago    32MB' },
        { type: 'output', content: 'myapp        latest    5d7e6f4a3b2c   5 minutes     487MB' },
      ];
    }
    if (cmd.includes('compose up')) {
      setShowCompose(true);
      // Simulate starting services
      setTimeout(() => {
        setServices(prev => prev.map(s => ({ ...s, status: 'starting' })));
      }, 200);
      setTimeout(() => {
        setServices(prev => prev.map(s => ({ ...s, status: 'running' })));
      }, 1500);
      
      return [
        { type: 'output', content: '[+] Running 5/5', delay: 200 },
        { type: 'output', content: ' ✔ Network app_default Created', delay: 400 },
        { type: 'output', content: ' ✔ Container app-redis-1 Started', delay: 600 },
        { type: 'output', content: ' ✔ Container app-db-1 Started', delay: 800 },
        { type: 'output', content: ' ✔ Container app-api-1 Started', delay: 1000 },
        { type: 'success', content: ' ✔ Container app-web-1 Started', delay: 1200 },
      ];
    }
    if (cmd.includes('compose down')) {
      setTimeout(() => {
        setServices(prev => prev.map(s => ({ ...s, status: 'stopped' })));
      }, 800);
      return [
        { type: 'output', content: '[+] Running 5/5', delay: 200 },
        { type: 'output', content: ' ✔ Container app-web-1 Stopped', delay: 400 },
        { type: 'output', content: ' ✔ Container app-api-1 Stopped', delay: 600 },
        { type: 'output', content: ' ✔ Container app-db-1 Stopped', delay: 800 },
        { type: 'output', content: ' ✔ Container app-redis-1 Stopped', delay: 1000 },
        { type: 'success', content: ' ✔ Network app_default Removed', delay: 1200 },
      ];
    }
    if (cmd.includes('compose logs')) {
      return [
        { type: 'output', content: 'app-web-1   | /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty', delay: 100 },
        { type: 'output', content: 'app-db-1    | PostgreSQL init process complete; ready for start up.', delay: 200 },
        { type: 'output', content: 'app-api-1   | > myapp@1.0.0 start', delay: 300 },
        { type: 'output', content: 'app-api-1   | Server running on port 3000', delay: 400 },
        { type: 'output', content: 'app-redis-1 | Ready to accept connections', delay: 500 },
        { type: 'success', content: '[Logs streaming... Press Ctrl+C to exit]', delay: 600 },
      ];
    }
    if (cmd.includes('compose ps')) {
      return [
        { type: 'output', content: 'NAME           SERVICE   STATUS    PORTS' },
        { type: 'output', content: 'app-web-1      web       running   0.0.0.0:80->80/tcp' },
        { type: 'output', content: 'app-api-1      api       running   0.0.0.0:3000->3000/tcp' },
        { type: 'output', content: 'app-db-1       db        running   0.0.0.0:5432->5432/tcp' },
        { type: 'output', content: 'app-redis-1    redis     running   0.0.0.0:6379->6379/tcp' },
      ];
    }
    if (cmd.includes('network ls')) {
      return [
        { type: 'output', content: 'NETWORK ID     NAME          DRIVER    SCOPE' },
        { type: 'output', content: 'a1b2c3d4e5f6   bridge        bridge    local' },
        { type: 'output', content: 'b2c3d4e5f6a7   app_default   bridge    local' },
        { type: 'output', content: 'c3d4e5f6a7b8   host          host      local' },
      ];
    }
    if (cmd.includes('volume ls')) {
      return [
        { type: 'output', content: 'DRIVER    VOLUME NAME' },
        { type: 'output', content: 'local     pgdata' },
        { type: 'output', content: 'local     app_node_modules' },
      ];
    }
    if (cmd === 'docker stats' || cmd.includes('stats --no-stream')) {
      return [
        { type: 'output', content: 'CONTAINER ID   NAME          CPU %   MEM USAGE / LIMIT     MEM %' },
        { type: 'output', content: 'a1b2c3d4e5f6   app-web-1     0.15%   32.5MiB / 7.77GiB     0.41%' },
        { type: 'output', content: 'b2c3d4e5f6a7   app-api-1     0.89%   156.2MiB / 7.77GiB    1.96%' },
        { type: 'output', content: 'c3d4e5f6a7b8   app-db-1      0.23%   89.7MiB / 7.77GiB     1.13%' },
        { type: 'output', content: 'd4e5f6a7b8c9   app-redis-1   0.02%   8.4MiB / 7.77GiB      0.11%' },
      ];
    }
    return [{ type: 'error', content: `Command not found: ${cmd}` }];
  };

  const handleServiceAction = (serviceName: string, action: string) => {
    if (action === 'start') {
      setServices(prev => prev.map(s => 
        s.name === serviceName ? { ...s, status: 'running' } : s
      ));
      setLines(prev => [...prev, 
        { type: 'input', content: `$ docker start ${serviceName}` },
        { type: 'success', content: serviceName }
      ]);
    } else if (action === 'logs') {
      setLines(prev => [...prev,
        { type: 'input', content: `$ docker logs ${serviceName}` },
        { type: 'output', content: `[${serviceName}] Starting service...` },
        { type: 'output', content: `[${serviceName}] Ready to accept connections` },
      ]);
    }
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
    <div className="space-y-4">
      {/* Compose Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowCompose(!showCompose)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
            showCompose ? "bg-purple-500/20 text-purple-400" : "bg-gray-700 text-gray-400"
          )}
        >
          {showCompose ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          docker-compose.yml
        </button>
        <span className="text-xs text-gray-500">Multi-container orchestration</span>
      </div>
      
      {/* Compose Visualization */}
      {showCompose && (
        <DockerComposeVisualization 
          services={services}
          onServiceAction={handleServiceAction}
        />
      )}
      
      {/* Terminal */}
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
              placeholder="Try: docker-compose up -d, docker ps, docker stats..."
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
      
      {/* Quick Commands */}
      <div className="flex flex-wrap gap-2">
        {['docker-compose up -d', 'docker-compose down', 'docker-compose logs -f', 'docker ps', 'docker stats --no-stream'].map(cmd => (
          <button
            key={cmd}
            onClick={() => setCurrentInput(cmd)}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-xs transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>
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

// Kubernetes Terminal Simulator with Helm support
export const KubernetesTerminal = ({ 
  currentStep, 
  onStepComplete 
}: { 
  currentStep?: NavigatorStep; 
  onStepComplete: (action: string) => void;
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'kubectl version: v1.28.0' },
    { type: 'output', content: 'helm version: v3.13.0' },
    { type: 'output', content: 'Connected to: minikube' },
    { type: 'output', content: '' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'kubectl' | 'helm'>('kubectl');
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
    if (action.includes('helm install')) return 'helm install my-release bitnami/nginx';
    if (action.includes('helm')) return 'helm list';
    return 'kubectl --help';
  };

  const getCommandOutput = (cmd: string): TerminalLine[] => {
    // kubectl commands
    if (cmd.includes('get pods') && !cmd.includes('-o')) {
      return [
        { type: 'output', content: 'NAME                                 READY   STATUS    RESTARTS   AGE' },
        { type: 'output', content: 'nginx-7854ff8877-x2bvz               1/1     Running   0          5m' },
        { type: 'output', content: 'nginx-7854ff8877-k9mjx               1/1     Running   0          5m' },
        { type: 'output', content: 'my-release-nginx-6f8d9b5c4d-abc12    1/1     Running   0          2m' },
      ];
    }
    if (cmd.includes('get pods') && cmd.includes('-o wide')) {
      return [
        { type: 'output', content: 'NAME                                 READY   STATUS    RESTARTS   AGE   IP           NODE' },
        { type: 'output', content: 'nginx-7854ff8877-x2bvz               1/1     Running   0          5m    172.17.0.4   minikube' },
        { type: 'output', content: 'nginx-7854ff8877-k9mjx               1/1     Running   0          5m    172.17.0.5   minikube' },
        { type: 'output', content: 'my-release-nginx-6f8d9b5c4d-abc12    1/1     Running   0          2m    172.17.0.6   minikube' },
      ];
    }
    if (cmd.includes('get all')) {
      return [
        { type: 'output', content: 'NAME                                     READY   STATUS    RESTARTS   AGE' },
        { type: 'output', content: 'pod/nginx-7854ff8877-x2bvz               1/1     Running   0          5m' },
        { type: 'output', content: 'pod/nginx-7854ff8877-k9mjx               1/1     Running   0          5m' },
        { type: 'output', content: '' },
        { type: 'output', content: 'NAME                 TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE' },
        { type: 'output', content: 'service/kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP   10d' },
        { type: 'output', content: 'service/nginx        ClusterIP   10.96.123.45   <none>        80/TCP    5m' },
        { type: 'output', content: '' },
        { type: 'output', content: 'NAME                    READY   UP-TO-DATE   AVAILABLE   AGE' },
        { type: 'output', content: 'deployment.apps/nginx   2/2     2            2           5m' },
      ];
    }
    if (cmd.includes('get deployments') || cmd.includes('get deploy')) {
      return [
        { type: 'output', content: 'NAME              READY   UP-TO-DATE   AVAILABLE   AGE' },
        { type: 'output', content: 'nginx             2/2     2            2           5m' },
        { type: 'output', content: 'my-release-nginx  1/1     1            1           2m' },
      ];
    }
    if (cmd.includes('get namespaces') || cmd.includes('get ns')) {
      return [
        { type: 'output', content: 'NAME              STATUS   AGE' },
        { type: 'output', content: 'default           Active   10d' },
        { type: 'output', content: 'kube-system       Active   10d' },
        { type: 'output', content: 'kube-public       Active   10d' },
        { type: 'output', content: 'monitoring        Active   2d' },
      ];
    }
    if (cmd.includes('get configmaps') || cmd.includes('get cm')) {
      return [
        { type: 'output', content: 'NAME               DATA   AGE' },
        { type: 'output', content: 'kube-root-ca.crt   1      10d' },
        { type: 'output', content: 'nginx-config       2      5m' },
      ];
    }
    if (cmd.includes('get secrets')) {
      return [
        { type: 'output', content: 'NAME                  TYPE                                  DATA   AGE' },
        { type: 'output', content: 'default-token-xyz     kubernetes.io/service-account-token   3      10d' },
        { type: 'output', content: 'db-credentials        Opaque                                2      5m' },
      ];
    }
    if (cmd.includes('get ingress') || cmd.includes('get ing')) {
      return [
        { type: 'output', content: 'NAME           CLASS    HOSTS             ADDRESS        PORTS   AGE' },
        { type: 'output', content: 'nginx-ingress  nginx    myapp.local       192.168.49.2   80      5m' },
      ];
    }
    if (cmd.includes('get pvc') || cmd.includes('get persistentvolumeclaim')) {
      return [
        { type: 'output', content: 'NAME        STATUS   VOLUME                                     CAPACITY   ACCESS MODES' },
        { type: 'output', content: 'data-pvc    Bound    pvc-abc123-def456-789                      10Gi       RWO' },
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
    if (cmd.includes('rollout status')) {
      return [
        { type: 'output', content: 'deployment "nginx" successfully rolled out', delay: 500 },
      ];
    }
    if (cmd.includes('rollout history')) {
      return [
        { type: 'output', content: 'deployment.apps/nginx' },
        { type: 'output', content: 'REVISION  CHANGE-CAUSE' },
        { type: 'output', content: '1         kubectl create deployment nginx --image=nginx' },
        { type: 'output', content: '2         kubectl set image deployment/nginx nginx=nginx:1.19' },
      ];
    }
    if (cmd.includes('rollout undo')) {
      return [
        { type: 'success', content: 'deployment.apps/nginx rolled back', delay: 400 },
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
        { type: 'output', content: 'NAME               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE' },
        { type: 'output', content: 'kubernetes         ClusterIP   10.96.0.1       <none>        443/TCP   10d' },
        { type: 'output', content: 'nginx              ClusterIP   10.96.123.45    <none>        80/TCP    5m' },
        { type: 'output', content: 'my-release-nginx   NodePort    10.96.234.56    <none>        80:30080  2m' },
      ];
    }
    if (cmd.includes('describe pod')) {
      return [
        { type: 'output', content: 'Name:         nginx-7854ff8877-x2bvz' },
        { type: 'output', content: 'Namespace:    default' },
        { type: 'output', content: 'Priority:     0' },
        { type: 'output', content: 'Node:         minikube/192.168.49.2' },
        { type: 'output', content: 'Start Time:   Mon, 01 Jan 2024 10:00:00 +0000' },
        { type: 'output', content: 'Labels:       app=nginx' },
        { type: 'output', content: 'Status:       Running' },
        { type: 'output', content: 'IP:           172.17.0.4' },
        { type: 'output', content: 'Containers:' },
        { type: 'output', content: '  nginx:' },
        { type: 'output', content: '    Image:          nginx:latest' },
        { type: 'output', content: '    Port:           80/TCP' },
        { type: 'output', content: '    State:          Running' },
      ];
    }
    if (cmd.includes('describe deploy')) {
      return [
        { type: 'output', content: 'Name:                   nginx' },
        { type: 'output', content: 'Namespace:              default' },
        { type: 'output', content: 'Replicas:               2 desired | 2 updated | 2 available' },
        { type: 'output', content: 'StrategyType:           RollingUpdate' },
        { type: 'output', content: 'RollingUpdateStrategy:  25% max unavailable, 25% max surge' },
        { type: 'output', content: 'Pod Template:' },
        { type: 'output', content: '  Containers:' },
        { type: 'output', content: '   nginx:' },
        { type: 'output', content: '    Image:        nginx:latest' },
        { type: 'output', content: '    Port:         80/TCP' },
      ];
    }
    if (cmd.includes('logs')) {
      return [
        { type: 'output', content: '/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty' },
        { type: 'output', content: '/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/' },
        { type: 'output', content: '2024/01/01 10:00:00 [notice] 1#1: nginx/1.25.0' },
        { type: 'output', content: '2024/01/01 10:00:00 [notice] 1#1: built by gcc 12.2.0' },
        { type: 'success', content: '10.0.0.1 - - "GET / HTTP/1.1" 200 615 "-" "curl/7.88.1"' },
      ];
    }
    if (cmd.includes('exec')) {
      return [
        { type: 'output', content: 'root@nginx-7854ff8877-x2bvz:/# ls' },
        { type: 'output', content: 'bin  boot  dev  docker-entrypoint.d  etc  home  lib  lib64  media  mnt' },
      ];
    }
    if (cmd.includes('top pods')) {
      return [
        { type: 'output', content: 'NAME                     CPU(cores)   MEMORY(bytes)' },
        { type: 'output', content: 'nginx-7854ff8877-x2bvz   2m           15Mi' },
        { type: 'output', content: 'nginx-7854ff8877-k9mjx   1m           14Mi' },
      ];
    }
    if (cmd.includes('top nodes')) {
      return [
        { type: 'output', content: 'NAME       CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%' },
        { type: 'output', content: 'minikube   250m         12%    1024Mi          26%' },
      ];
    }
    if (cmd.includes('port-forward')) {
      return [
        { type: 'success', content: 'Forwarding from 127.0.0.1:8080 -> 80' },
        { type: 'output', content: 'Handling connection for 8080...' },
      ];
    }
    if (cmd.includes('delete pod')) {
      return [
        { type: 'success', content: 'pod "nginx-7854ff8877-x2bvz" deleted', delay: 500 },
      ];
    }
    if (cmd.includes('delete deployment')) {
      return [
        { type: 'success', content: 'deployment.apps "nginx" deleted', delay: 500 },
      ];
    }
    
    // Helm commands
    if (cmd.includes('helm install')) {
      const releaseName = cmd.split(' ')[2] || 'my-release';
      return [
        { type: 'output', content: `NAME: ${releaseName}`, delay: 200 },
        { type: 'output', content: 'LAST DEPLOYED: Mon Jan 01 10:00:00 2024', delay: 300 },
        { type: 'output', content: 'NAMESPACE: default', delay: 400 },
        { type: 'output', content: 'STATUS: deployed', delay: 500 },
        { type: 'output', content: 'REVISION: 1', delay: 600 },
        { type: 'success', content: 'NOTES:', delay: 700 },
        { type: 'success', content: '1. Get the application URL by running:', delay: 800 },
        { type: 'output', content: '   kubectl get svc --namespace default -l app.kubernetes.io/name=nginx', delay: 900 },
      ];
    }
    if (cmd.includes('helm upgrade')) {
      return [
        { type: 'output', content: 'Release "my-release" has been upgraded. Happy Helming!', delay: 300 },
        { type: 'output', content: 'NAME: my-release', delay: 400 },
        { type: 'output', content: 'LAST DEPLOYED: Mon Jan 01 10:05:00 2024', delay: 500 },
        { type: 'success', content: 'STATUS: deployed', delay: 600 },
        { type: 'output', content: 'REVISION: 2', delay: 700 },
      ];
    }
    if (cmd.includes('helm list') || cmd === 'helm ls') {
      return [
        { type: 'output', content: 'NAME         NAMESPACE  REVISION  UPDATED                                 STATUS    CHART          APP VERSION' },
        { type: 'output', content: 'my-release   default    1         2024-01-01 10:00:00.000000 +0000 UTC   deployed  nginx-15.0.0   1.25.0' },
        { type: 'output', content: 'prometheus   monitoring 2         2024-01-01 09:30:00.000000 +0000 UTC   deployed  prometheus-24  2.47.0' },
      ];
    }
    if (cmd.includes('helm repo add')) {
      return [
        { type: 'success', content: '"bitnami" has been added to your repositories', delay: 300 },
      ];
    }
    if (cmd.includes('helm repo update')) {
      return [
        { type: 'output', content: 'Hang tight while we grab the latest from your chart repositories...', delay: 200 },
        { type: 'output', content: '...Successfully got an update from the "bitnami" chart repository', delay: 600 },
        { type: 'success', content: 'Update Complete. ⎈Happy Helming!⎈', delay: 800 },
      ];
    }
    if (cmd.includes('helm repo list')) {
      return [
        { type: 'output', content: 'NAME      URL' },
        { type: 'output', content: 'bitnami   https://charts.bitnami.com/bitnami' },
        { type: 'output', content: 'stable    https://charts.helm.sh/stable' },
      ];
    }
    if (cmd.includes('helm search repo')) {
      return [
        { type: 'output', content: 'NAME                    CHART VERSION   APP VERSION   DESCRIPTION' },
        { type: 'output', content: 'bitnami/nginx           15.0.0          1.25.0        NGINX Open Source for web serving...' },
        { type: 'output', content: 'bitnami/postgresql      13.0.0          16.0.0        PostgreSQL object-relational database...' },
        { type: 'output', content: 'bitnami/redis           18.0.0          7.2.0         Redis Open Source is an in-memory...' },
      ];
    }
    if (cmd.includes('helm show values')) {
      return [
        { type: 'output', content: '## @section Global parameters' },
        { type: 'output', content: 'global:' },
        { type: 'output', content: '  imageRegistry: ""' },
        { type: 'output', content: '' },
        { type: 'output', content: '## @section Common parameters' },
        { type: 'output', content: 'replicaCount: 1' },
        { type: 'output', content: 'image:' },
        { type: 'output', content: '  registry: docker.io' },
        { type: 'output', content: '  repository: bitnami/nginx' },
        { type: 'output', content: '  tag: 1.25.0' },
      ];
    }
    if (cmd.includes('helm status')) {
      return [
        { type: 'output', content: 'NAME: my-release' },
        { type: 'output', content: 'LAST DEPLOYED: Mon Jan 01 10:00:00 2024' },
        { type: 'output', content: 'NAMESPACE: default' },
        { type: 'success', content: 'STATUS: deployed' },
        { type: 'output', content: 'REVISION: 1' },
        { type: 'output', content: '' },
        { type: 'output', content: 'RESOURCES:' },
        { type: 'output', content: '==> v1/Service' },
        { type: 'output', content: 'NAME               TYPE       CLUSTER-IP    PORT(S)' },
        { type: 'output', content: 'my-release-nginx   NodePort   10.96.234.56  80:30080/TCP' },
      ];
    }
    if (cmd.includes('helm history')) {
      return [
        { type: 'output', content: 'REVISION  UPDATED                   STATUS      CHART          APP VERSION  DESCRIPTION' },
        { type: 'output', content: '1         Mon Jan 01 10:00:00 2024  superseded  nginx-15.0.0   1.25.0       Install complete' },
        { type: 'output', content: '2         Mon Jan 01 10:05:00 2024  deployed    nginx-15.0.0   1.25.0       Upgrade complete' },
      ];
    }
    if (cmd.includes('helm rollback')) {
      return [
        { type: 'success', content: 'Rollback was a success! Happy Helming!', delay: 500 },
      ];
    }
    if (cmd.includes('helm uninstall') || cmd.includes('helm delete')) {
      return [
        { type: 'success', content: 'release "my-release" uninstalled', delay: 400 },
      ];
    }
    if (cmd.includes('helm template')) {
      return [
        { type: 'output', content: '---' },
        { type: 'output', content: '# Source: nginx/templates/serviceaccount.yaml' },
        { type: 'output', content: 'apiVersion: v1' },
        { type: 'output', content: 'kind: ServiceAccount' },
        { type: 'output', content: 'metadata:' },
        { type: 'output', content: '  name: my-release-nginx' },
        { type: 'output', content: '---' },
        { type: 'output', content: '# Source: nginx/templates/deployment.yaml' },
        { type: 'output', content: 'apiVersion: apps/v1' },
        { type: 'output', content: 'kind: Deployment' },
      ];
    }
    if (cmd.includes('helm create')) {
      return [
        { type: 'success', content: 'Creating mychart', delay: 200 },
        { type: 'output', content: 'mychart/Chart.yaml', delay: 300 },
        { type: 'output', content: 'mychart/values.yaml', delay: 400 },
        { type: 'output', content: 'mychart/templates/', delay: 500 },
      ];
    }
    if (cmd.includes('helm lint')) {
      return [
        { type: 'output', content: '==> Linting ./mychart' },
        { type: 'success', content: '1 chart(s) linted, 0 chart(s) failed', delay: 400 },
      ];
    }
    if (cmd.includes('helm package')) {
      return [
        { type: 'success', content: 'Successfully packaged chart and saved it to: ./mychart-0.1.0.tgz', delay: 500 },
      ];
    }
    
    return [{ type: 'error', content: `Error: ${cmd.split(' ')[0]}: command not found. Try 'kubectl --help' or 'helm --help'` }];
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

  const kubectlQuickCommands = [
    'kubectl get pods',
    'kubectl get pods -o wide',
    'kubectl get all',
    'kubectl get deployments',
    'kubectl get svc',
    'kubectl describe pod',
    'kubectl logs',
    'kubectl scale deployment nginx --replicas=3',
    'kubectl rollout status deployment/nginx',
    'kubectl top pods',
  ];

  const helmQuickCommands = [
    'helm repo add bitnami https://charts.bitnami.com/bitnami',
    'helm repo update',
    'helm search repo nginx',
    'helm install my-release bitnami/nginx',
    'helm list',
    'helm status my-release',
    'helm upgrade my-release bitnami/nginx --set replicaCount=3',
    'helm history my-release',
    'helm rollback my-release 1',
    'helm uninstall my-release',
  ];

  return (
    <div className="space-y-4">
      {/* Tool Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('kubectl')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
            activeTab === 'kubectl' 
              ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/30" 
              : "bg-gray-700 text-gray-400 hover:bg-gray-600"
          )}
        >
          <Box className="w-4 h-4" />
          kubectl
        </button>
        <button
          onClick={() => setActiveTab('helm')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
            activeTab === 'helm' 
              ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30" 
              : "bg-gray-700 text-gray-400 hover:bg-gray-600"
          )}
        >
          <Package className="w-4 h-4" />
          Helm
        </button>
      </div>

      {/* Terminal */}
      <div className="bg-[#1a1a2e] rounded-xl overflow-hidden font-mono text-sm">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#16213e] border-b border-[#0f3460]">
          <Box className="w-4 h-4 text-blue-400" />
          <span className="text-gray-300">Kubernetes Terminal</span>
          <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
            {activeTab}
          </span>
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
              placeholder={activeTab === 'kubectl' ? "Type kubectl command..." : "Type helm command..."}
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
      
      {/* Quick Commands */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Quick commands ({activeTab}):</p>
        <div className="flex flex-wrap gap-2 max-h-24 overflow-auto">
          {(activeTab === 'kubectl' ? kubectlQuickCommands : helmQuickCommands).map(cmd => (
            <button
              key={cmd}
              onClick={() => setCurrentInput(cmd)}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs transition-colors whitespace-nowrap"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
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

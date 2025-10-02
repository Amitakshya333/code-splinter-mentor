import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Folder, FolderOpen, Plus, Trash2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Workspace {
  id: string;
  name: string;
  path: string;
  lastOpened: Date;
  isActive: boolean;
}

export const WorkspaceManager = () => {
  const { toast } = useToast();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: '1',
      name: 'Main Project',
      path: '/projects/main',
      lastOpened: new Date(),
      isActive: true,
    },
    {
      id: '2',
      name: 'Test Environment',
      path: '/projects/test',
      lastOpened: new Date(Date.now() - 86400000),
      isActive: false,
    },
  ]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const switchWorkspace = (workspaceId: string) => {
    setWorkspaces(prev => prev.map(ws => ({
      ...ws,
      isActive: ws.id === workspaceId,
      lastOpened: ws.id === workspaceId ? new Date() : ws.lastOpened,
    })));
    toast({
      title: 'Workspace Switched',
      description: 'Your workspace has been changed successfully',
    });
  };

  const createWorkspace = () => {
    if (!newWorkspaceName.trim()) return;

    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name: newWorkspaceName,
      path: `/projects/${newWorkspaceName.toLowerCase().replace(/\s+/g, '-')}`,
      lastOpened: new Date(),
      isActive: false,
    };

    setWorkspaces(prev => [...prev, newWorkspace]);
    setNewWorkspaceName('');
    toast({
      title: 'Workspace Created',
      description: `${newWorkspaceName} has been created successfully`,
    });
  };

  const deleteWorkspace = (workspaceId: string) => {
    setWorkspaces(prev => prev.filter(ws => ws.id !== workspaceId));
    toast({
      title: 'Workspace Deleted',
      description: 'Workspace has been removed',
    });
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center gap-2 mb-4">
        <FolderOpen className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Workspace Manager</h2>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="New workspace name..."
          value={newWorkspaceName}
          onChange={(e) => setNewWorkspaceName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && createWorkspace()}
        />
        <Button onClick={createWorkspace} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {workspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className={workspace.isActive ? 'border-primary' : ''}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    <CardTitle className="text-base">{workspace.name}</CardTitle>
                    {workspace.isActive && (
                      <Badge variant="default" className="text-xs">Active</Badge>
                    )}
                  </div>
                </div>
                <CardDescription className="text-xs">
                  {workspace.path}
                </CardDescription>
                <div className="text-xs text-muted-foreground">
                  Last opened: {workspace.lastOpened.toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  {!workspace.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => switchWorkspace(workspace.id)}
                      className="flex-1"
                    >
                      Open
                    </Button>
                  )}
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  {!workspace.isActive && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteWorkspace(workspace.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

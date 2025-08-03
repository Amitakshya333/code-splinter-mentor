import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useGitIntegration } from '@/hooks/useGitIntegration';
import { 
  GitBranch, 
  GitCommit, 
  Plus, 
  Check, 
  FileText, 
  Clock, 
  User,
  GitPullRequest,
  RefreshCw
} from 'lucide-react';

export const GitPanel = () => {
  const [commitMessage, setCommitMessage] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [showCommitForm, setShowCommitForm] = useState(false);
  const [showBranchForm, setShowBranchForm] = useState(false);

  const {
    commits,
    branches,
    currentBranch,
    status,
    isLoading,
    initRepository,
    addFiles,
    commit,
    createBranch,
    switchBranch,
    getBranchInfo,
  } = useGitIntegration();

  const handleCommit = async () => {
    if (!commitMessage.trim()) return;
    await commit(commitMessage);
    setCommitMessage('');
    setShowCommitForm(false);
  };

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) return;
    await createBranch(newBranchName);
    setNewBranchName('');
    setShowBranchForm(false);
  };

  const handleAddAllFiles = () => {
    const allFiles = [...status.modified, ...status.untracked];
    if (allFiles.length > 0) {
      addFiles(allFiles);
    }
  };

  const getStatusColor = (hasChanges: boolean) => {
    return hasChanges ? 'text-yellow-600' : 'text-green-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-4 w-4" />
          Git Integration
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Repository Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Repository</span>
            <Button size="sm" variant="outline" onClick={initRepository} disabled={isLoading}>
              <RefreshCw className="h-3 w-3 mr-1" />
              {branches.length === 0 ? 'Init' : 'Refresh'}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {currentBranch}
            </Badge>
            <Badge 
              variant={status.clean ? "default" : "secondary"} 
              className={getStatusColor(!status.clean)}
            >
              {status.clean ? 'Clean' : 'Modified'}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Branch Management */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Branches ({branches.length})</span>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setShowBranchForm(!showBranchForm)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          {showBranchForm && (
            <div className="space-y-2 p-2 border rounded">
              <Input
                placeholder="Branch name"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                className="text-xs"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreateBranch} disabled={isLoading}>
                  Create
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowBranchForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          <ScrollArea className="max-h-32">
            <div className="space-y-1">
              {branches.map((branch) => (
                <div 
                  key={branch.name}
                  className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer hover:bg-muted/50 ${
                    branch.current ? 'bg-muted border' : ''
                  }`}
                  onClick={() => !branch.current && switchBranch(branch.name)}
                >
                  <span className={branch.current ? 'font-medium' : ''}>
                    {branch.name}
                  </span>
                  {branch.current && <Check className="h-3 w-3" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* File Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Changes</span>
            {(status.modified.length > 0 || status.untracked.length > 0) && (
              <Button size="sm" variant="ghost" onClick={handleAddAllFiles}>
                <Plus className="h-3 w-3 mr-1" />
                Stage All
              </Button>
            )}
          </div>
          
          <ScrollArea className="max-h-24">
            <div className="space-y-1 text-xs">
              {status.modified.map((file) => (
                <div key={file} className="flex items-center gap-2 p-1">
                  <FileText className="h-3 w-3 text-yellow-600" />
                  <span>Modified: {file}</span>
                </div>
              ))}
              {status.untracked.map((file) => (
                <div key={file} className="flex items-center gap-2 p-1">
                  <FileText className="h-3 w-3 text-green-600" />
                  <span>Untracked: {file}</span>
                </div>
              ))}
              {status.added.map((file) => (
                <div key={file} className="flex items-center gap-2 p-1">
                  <FileText className="h-3 w-3 text-blue-600" />
                  <span>Staged: {file}</span>
                </div>
              ))}
              
              {status.clean && (
                <div className="text-muted-foreground text-center py-2">
                  No changes to commit
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Commit Section */}
        {status.added.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Commit</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setShowCommitForm(!showCommitForm)}
                >
                  <GitCommit className="h-3 w-3" />
                </Button>
              </div>
              
              {showCommitForm && (
                <div className="space-y-2 p-2 border rounded">
                  <Textarea
                    placeholder="Commit message"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    className="text-xs min-h-16"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleCommit} disabled={isLoading}>
                      Commit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowCommitForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <Separator />

        {/* Commit History */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Recent Commits</span>
          
          <ScrollArea className="max-h-40">
            <div className="space-y-2">
              {commits.map((commit) => (
                <div key={commit.hash} className="p-2 border rounded text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-xs">
                      {commit.hash}
                    </Badge>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(commit.date)}
                    </div>
                  </div>
                  <div className="font-medium">{commit.message}</div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <User className="h-3 w-3" />
                    {commit.author}
                  </div>
                </div>
              ))}
              
              {commits.length === 0 && (
                <div className="text-muted-foreground text-center py-4">
                  No commits yet
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
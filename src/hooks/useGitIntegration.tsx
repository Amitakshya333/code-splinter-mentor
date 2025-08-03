import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
  changes: string[];
}

interface GitBranch {
  name: string;
  current: boolean;
  lastCommit: string;
}

interface GitStatus {
  modified: string[];
  added: string[];
  deleted: string[];
  untracked: string[];
  clean: boolean;
}

export const useGitIntegration = () => {
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [branches, setBranches] = useState<GitBranch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<string>('main');
  const [status, setStatus] = useState<GitStatus>({
    modified: [],
    added: [],
    deleted: [],
    untracked: [],
    clean: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Simulate git operations (in a real implementation, these would call actual git commands)
  const initRepository = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate git init
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBranches([{ name: 'main', current: true, lastCommit: 'Initial commit' }]);
      setCurrentBranch('main');
      
      toast.success('Repository initialized successfully');
    } catch (error) {
      toast.error('Failed to initialize repository');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addFiles = useCallback(async (files: string[]) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStatus(prev => ({
        ...prev,
        added: [...prev.added, ...files],
        untracked: prev.untracked.filter(f => !files.includes(f)),
        modified: prev.modified.filter(f => !files.includes(f)),
      }));
      
      toast.success(`Added ${files.length} file(s) to staging`);
    } catch (error) {
      toast.error('Failed to add files');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const commit = useCallback(async (message: string) => {
    if (!message.trim()) {
      toast.error('Commit message is required');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCommit: GitCommit = {
        hash: Math.random().toString(36).substring(2, 10),
        message,
        author: 'Developer',
        date: new Date().toISOString(),
        changes: status.added,
      };
      
      setCommits(prev => [newCommit, ...prev]);
      setStatus({
        modified: [],
        added: [],
        deleted: [],
        untracked: [],
        clean: true,
      });
      
      toast.success('Changes committed successfully');
    } catch (error) {
      toast.error('Failed to commit changes');
    } finally {
      setIsLoading(false);
    }
  }, [status.added]);

  const createBranch = useCallback(async (branchName: string) => {
    if (!branchName.trim()) {
      toast.error('Branch name is required');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newBranch: GitBranch = {
        name: branchName,
        current: false,
        lastCommit: commits[0]?.hash || 'No commits',
      };
      
      setBranches(prev => [...prev, newBranch]);
      toast.success(`Branch '${branchName}' created successfully`);
    } catch (error) {
      toast.error('Failed to create branch');
    } finally {
      setIsLoading(false);
    }
  }, [commits]);

  const switchBranch = useCallback(async (branchName: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBranches(prev => prev.map(branch => ({
        ...branch,
        current: branch.name === branchName,
      })));
      setCurrentBranch(branchName);
      
      toast.success(`Switched to branch '${branchName}'`);
    } catch (error) {
      toast.error('Failed to switch branch');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateFileStatus = useCallback((filename: string, type: 'modified' | 'untracked') => {
    setStatus(prev => {
      const newStatus = { ...prev };
      
      if (type === 'modified' && !prev.modified.includes(filename)) {
        newStatus.modified = [...prev.modified, filename];
        newStatus.clean = false;
      } else if (type === 'untracked' && !prev.untracked.includes(filename)) {
        newStatus.untracked = [...prev.untracked, filename];
        newStatus.clean = false;
      }
      
      return newStatus;
    });
  }, []);

  const getCommitHistory = useCallback(() => {
    return commits.slice(0, 20); // Return last 20 commits
  }, [commits]);

  const getBranchInfo = useCallback(() => {
    return {
      current: currentBranch,
      total: branches.length,
      branches: branches,
    };
  }, [currentBranch, branches]);

  return {
    commits: getCommitHistory(),
    branches,
    currentBranch,
    status,
    isLoading,
    initRepository,
    addFiles,
    commit,
    createBranch,
    switchBranch,
    updateFileStatus,
    getBranchInfo,
  };
};
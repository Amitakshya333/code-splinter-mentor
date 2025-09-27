import React, { useState, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Folder, 
  FolderOpen, 
  File, 
  Plus, 
  FolderPlus, 
  Edit, 
  Trash2, 
  Move,
  Search,
  FileCode,
  FileText,
  Settings
} from 'lucide-react';
import { useAppStore, FileItem } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';

interface FileTreeItemProps {
  file: FileItem;
  level: number;
  onSelect: (file: FileItem) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, newParentId?: string) => void;
  isSelected: boolean;
}

const FileTreeItem = memo<FileTreeItemProps>(({ 
  file, 
  level, 
  onSelect, 
  onRename, 
  onDelete, 
  onMove,
  isSelected 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const { files } = useAppStore();
  
  const children = files.filter(f => f.parentId === file.id);
  const hasChildren = children.length > 0;

  const handleRename = useCallback(() => {
    if (newName.trim() && newName !== file.name) {
      onRename(file.id, newName.trim());
    }
    setIsRenaming(false);
  }, [file.id, file.name, newName, onRename]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setNewName(file.name);
      setIsRenaming(false);
    }
  }, [handleRename, file.name]);

  const getFileIcon = useCallback((fileType: string, fileName: string) => {
    if (fileType === 'folder') {
      return isExpanded ? <FolderOpen className="h-4 w-4 text-blue-500" /> : <Folder className="h-4 w-4 text-blue-500" />;
    }
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
        return <FileCode className="h-4 w-4 text-yellow-500" />;
      case 'py':
        return <FileCode className="h-4 w-4 text-blue-600" />;
      case 'html':
      case 'htm':
        return <FileCode className="h-4 w-4 text-orange-500" />;
      case 'css':
      case 'scss':
      case 'sass':
        return <FileCode className="h-4 w-4 text-blue-400" />;
      case 'json':
        return <FileCode className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  }, [isExpanded]);

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={`flex items-center gap-2 py-1 px-2 hover:bg-accent/50 cursor-pointer transition-colors ${
              isSelected ? 'bg-accent text-accent-foreground' : ''
            }`}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
            onClick={() => {
              if (file.type === 'folder') {
                setIsExpanded(!isExpanded);
              } else {
                onSelect(file);
              }
            }}
          >
            {file.type === 'folder' && hasChildren && (
              <div className="w-4 flex justify-center">
                <div 
                  className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-transparent border-b-foreground transition-transform"
                  style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                />
              </div>
            )}
            {getFileIcon(file.type, file.name)}
            {isRenaming ? (
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyDown}
                className="h-6 text-sm flex-1"
                autoFocus
              />
            ) : (
              <span className="text-sm flex-1 truncate">{file.name}</span>
            )}
            {file.language && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                {file.language}
              </Badge>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setIsRenaming(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onDelete(file.id)} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onMove(file.id)}>
            <Move className="h-4 w-4 mr-2" />
            Move
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      
      {file.type === 'folder' && isExpanded && children.map(child => (
        <FileTreeItem
          key={child.id}
          file={child}
          level={level + 1}
          onSelect={onSelect}
          onRename={onRename}
          onDelete={onDelete}
          onMove={onMove}
          isSelected={isSelected}
        />
      ))}
    </div>
  );
});

FileTreeItem.displayName = 'FileTreeItem';

export const FileExplorer = memo(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const [newItemName, setNewItemName] = useState('');
  const [newItemLanguage, setNewItemLanguage] = useState('javascript');
  
  const { 
    files, 
    currentFile, 
    currentWorkspace,
    addFile,
    updateFile,
    deleteFile,
    createFolder,
    renameFile,
    moveFile,
    setCurrentFile,
    setCurrentCode,
    setCurrentLanguage 
  } = useAppStore();

  const { toast } = useToast();

  const rootFiles = files.filter(f => !f.parentId && f.path.startsWith(currentWorkspace));
  const filteredFiles = searchQuery 
    ? files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : rootFiles;

  const handleFileSelect = useCallback((file: FileItem) => {
    if (file.type === 'file') {
      setCurrentFile(file.id);
      if (file.code) {
        setCurrentCode(file.code);
      }
      if (file.language) {
        setCurrentLanguage(file.language);
      }
      toast({
        title: "File Opened",
        description: `Opened ${file.name}`,
      });
    }
  }, [setCurrentFile, setCurrentCode, setCurrentLanguage, toast]);

  const handleCreateItem = useCallback(() => {
    if (!newItemName.trim()) return;

    if (createType === 'file') {
      const fileExtension = newItemName.split('.').pop() || '';
      const language = getLanguageFromExtension(fileExtension) || newItemLanguage;
      
      addFile({
        name: newItemName.trim(),
        type: 'file',
        language,
        code: getDefaultTemplate(language),
        path: `${currentWorkspace}/${newItemName.trim()}`,
      });
      
      toast({
        title: "File Created",
        description: `Created ${newItemName.trim()}`,
      });
    } else {
      createFolder(newItemName.trim());
      toast({
        title: "Folder Created", 
        description: `Created folder ${newItemName.trim()}`,
      });
    }

    setNewItemName('');
    setShowCreateDialog(false);
  }, [createType, newItemName, newItemLanguage, currentWorkspace, addFile, createFolder, toast]);

  const handleRename = useCallback((id: string, newName: string) => {
    renameFile(id, newName);
    toast({
      title: "Item Renamed",
      description: `Renamed to ${newName}`,
    });
  }, [renameFile, toast]);

  const handleDelete = useCallback((id: string) => {
    const file = files.find(f => f.id === id);
    if (file && confirm(`Are you sure you want to delete ${file.name}?`)) {
      deleteFile(id);
      if (currentFile === id) {
        setCurrentFile(null);
      }
      toast({
        title: "Item Deleted",
        description: `Deleted ${file.name}`,
      });
    }
  }, [files, currentFile, deleteFile, setCurrentFile, toast]);

  const handleMove = useCallback((id: string, newParentId?: string) => {
    moveFile(id, newParentId);
    toast({
      title: "Item Moved",
      description: "Item has been moved",
    });
  }, [moveFile, toast]);

  const getLanguageFromExtension = useCallback((extension: string): string => {
    const extMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'html': 'html',
      'css': 'css',
      'json': 'json',
    };
    return extMap[extension.toLowerCase()] || 'plaintext';
  }, []);

  const getDefaultTemplate = useCallback((language: string): string => {
    const templates: Record<string, string> = {
      'javascript': '// JavaScript file\nconsole.log("Hello, World!");',
      'typescript': '// TypeScript file\nconst message: string = "Hello, World!";\nconsole.log(message);',
      'python': '# Python file\nprint("Hello, World!")',
      'java': 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      'html': '<!DOCTYPE html>\n<html>\n<head>\n    <title>New Page</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>',
      'css': '/* CSS file */\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n}',
    };
    return templates[language] || '// New file';
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Explorer</CardTitle>
          <div className="flex gap-1">
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setCreateType('file');
                    setShowCreateDialog(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New {createType === 'file' ? 'File' : 'Folder'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={createType === 'file' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCreateType('file')}
                    >
                      <File className="h-4 w-4 mr-1" />
                      File
                    </Button>
                    <Button
                      variant={createType === 'folder' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCreateType('folder')}
                    >
                      <FolderPlus className="h-4 w-4 mr-1" />
                      Folder
                    </Button>
                  </div>
                  <Input
                    placeholder={`${createType === 'file' ? 'File' : 'Folder'} name...`}
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  {createType === 'file' && (
                    <select
                      value={newItemLanguage}
                      onChange={(e) => setNewItemLanguage(e.target.value)}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="c">C</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                    </select>
                  )}
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateItem}>
                      Create
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-2">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No files found</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create first file
                </Button>
              </div>
            ) : (
              filteredFiles.map(file => (
                <FileTreeItem
                  key={file.id}
                  file={file}
                  level={0}
                  onSelect={handleFileSelect}
                  onRename={handleRename}
                  onDelete={handleDelete}
                  onMove={handleMove}
                  isSelected={currentFile === file.id}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

FileExplorer.displayName = 'FileExplorer';
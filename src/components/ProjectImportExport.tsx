import { memo, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Upload, Archive } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { compressProject, decompressProject } from '@/utils/fileCompression';

export const ProjectImportExport = memo(() => {
  const { files, addFile } = useAppStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(async () => {
    try {
      const projectFiles = files.map(file => ({
        name: file.path,
        content: file.code || '',
      }));

      const blob = compressProject(projectFiles);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-backup-${Date.now()}.gz`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Project Exported',
        description: `Exported ${files.length} files successfully`,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export project',
        variant: 'destructive',
      });
    }
  }, [files, toast]);

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const projectFiles = await decompressProject(file);

      projectFiles.forEach(file => {
        const extension = file.name.split('.').pop() || '';
        const languageMap: Record<string, string> = {
          js: 'javascript',
          ts: 'typescript',
          py: 'python',
          java: 'java',
          html: 'html',
          css: 'css',
        };

        addFile({
          name: file.name.split('/').pop() || file.name,
          type: 'file',
          language: languageMap[extension] || 'plaintext',
          code: file.content,
          path: file.name,
        });
      });

      toast({
        title: 'Project Imported',
        description: `Imported ${projectFiles.length} files successfully`,
      });
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'Failed to import project',
        variant: 'destructive',
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [addFile, toast]);

  const handleExportJSON = useCallback(() => {
    const projectData = {
      files: files.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type,
        path: file.path,
        language: file.language,
        code: file.code,
        parentId: file.parentId,
      })),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Project Exported',
      description: 'Exported as JSON',
    });
  }, [files, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Import/Export</CardTitle>
        <CardDescription>Backup and restore your project files</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={handleExport} className="w-full" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Project (Compressed)
        </Button>

        <Button onClick={handleExportJSON} className="w-full" variant="outline">
          <Archive className="h-4 w-4 mr-2" />
          Export as JSON
        </Button>

        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
          variant="outline"
        >
          <Upload className="h-4 w-4 mr-2" />
          Import Project
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".gz,.json"
          onChange={handleImport}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
});

ProjectImportExport.displayName = 'ProjectImportExport';

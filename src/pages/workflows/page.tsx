import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Play, CheckCircle2 } from "lucide-react";
import { getAllWorkflows, type Workflow } from "@/lib/workflows";
import { getUserWorkflowProgress } from "@/lib/workflowProgress";
import { getCurrentUser } from "@/lib/auth";
import { checkWorkflowLimit } from "@/lib/freemium";
import { UpgradeModal } from "@/components/freemium/UpgradeModal";
import { CheckoutButton } from "@/components/stripe/CheckoutButton";

interface WorkflowWithProgress extends Workflow {
  progress?: {
    current_step: number;
    completed_steps: number[];
    completed_at: string | null;
  };
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          // User not authenticated - they should authenticate on landing page
          setIsLoading(false);
          return;
        }

        // Load all workflows
        const allWorkflows = await getAllWorkflows();
        
        // Load user progress for all workflows
        const userProgress = await getUserWorkflowProgress(user.id);
        
        // Combine workflows with progress
        const workflowsWithProgress = allWorkflows.map(workflow => {
          const progress = userProgress.find(p => p.workflow_id === workflow.id);
          return {
            ...workflow,
            progress: progress ? {
              current_step: progress.current_step,
              completed_steps: progress.completed_steps,
              completed_at: progress.completed_at,
            } : undefined,
          };
        });

        setWorkflows(workflowsWithProgress);
      } catch (error) {
        console.error("Error loading workflows:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkflows();
  }, [navigate]);

  const handleStartWorkflow = async (workflowId: string) => {
    const canStart = await checkWorkflowLimit();
    if (!canStart) {
      setShowUpgradeModal(true);
      return;
    }

    // Navigate to Navigator with workflow ID
    // For MVP, we'll use the moduleId mapping
    navigate(`/?workflowId=${workflowId}`);
  };

  const getProgressPercentage = (workflow: WorkflowWithProgress): number => {
    if (!workflow.progress) return 0;
    const completed = workflow.progress.completed_steps.length;
    return (completed / workflow.total_steps) * 100;
  };

  const isCompleted = (workflow: WorkflowWithProgress): boolean => {
    return !!workflow.progress?.completed_at;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Workflow Library</h1>
          <p className="text-muted-foreground mt-2">
            Choose a workflow to get step-by-step guidance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => {
            const progress = getProgressPercentage(workflow);
            const completed = isCompleted(workflow);

            return (
              <Card key={workflow.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {workflow.description || "No description available"}
                      </CardDescription>
                    </div>
                    {completed && (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {workflow.progress
                          ? `${workflow.progress.completed_steps.length}/${workflow.total_steps} steps`
                          : "Not started"}
                      </span>
                    </div>
                    {workflow.progress && (
                      <Progress value={progress} className="h-2" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {workflow.platform}
                    </Badge>
                    {workflow.difficulty && (
                      <Badge variant="outline" className="text-xs capitalize">
                        {workflow.difficulty}
                      </Badge>
                    )}
                    {workflow.estimated_time && (
                      <Badge variant="outline" className="text-xs">
                        ~{workflow.estimated_time} min
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => handleStartWorkflow(workflow.id)}
                    className="w-full"
                    variant={completed ? "outline" : "default"}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {completed ? "Review" : workflow.progress ? "Continue" : "Start"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {workflows.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No workflows available. Check back soon!
              </p>
            </CardContent>
          </Card>
        )}

        <UpgradeModal
          open={showUpgradeModal}
          onOpenChange={setShowUpgradeModal}
          onUpgrade={() => {}}
        />
      </div>
    </div>
  );
}


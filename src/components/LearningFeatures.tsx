import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeReviewPanel } from './CodeReviewPanel';
import { MentorshipSystem } from './MentorshipSystem';
import { TutorialMode } from './TutorialMode';
import { AchievementSystem } from './AchievementSystem';
import { CodeQualityMetrics } from './CodeQualityMetrics';

interface LearningFeaturesProps {
  onCodeUpdate?: (code: string, language: string) => void;
}

export const LearningFeatures = ({ onCodeUpdate }: LearningFeaturesProps) => {
  return (
    <Tabs defaultValue="reviews" className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
        <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
        <TabsTrigger value="quality">Quality</TabsTrigger>
      </TabsList>

      <TabsContent value="reviews" className="flex-1">
        <CodeReviewPanel />
      </TabsContent>

      <TabsContent value="mentorship" className="flex-1">
        <MentorshipSystem />
      </TabsContent>

      <TabsContent value="tutorials" className="flex-1">
        <TutorialMode onCodeUpdate={onCodeUpdate} />
      </TabsContent>

      <TabsContent value="achievements" className="flex-1">
        <AchievementSystem />
      </TabsContent>

      <TabsContent value="quality" className="flex-1">
        <CodeQualityMetrics />
      </TabsContent>
    </Tabs>
  );
};

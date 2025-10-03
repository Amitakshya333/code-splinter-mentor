import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Zap, Target, Award, Lock, TrendingUp } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'code' | 'learning' | 'community' | 'milestone';
  points: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: string;
}

interface UserStats {
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  rank: string;
  achievements: number;
  totalAchievements: number;
}

export const AchievementSystem = () => {
  const [userStats] = useState<UserStats>({
    totalPoints: 2450,
    level: 12,
    nextLevelPoints: 3000,
    rank: 'Expert Coder',
    achievements: 18,
    totalAchievements: 45
  });

  const mockAchievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first coding tutorial',
      icon: 'star',
      category: 'learning',
      points: 50,
      unlocked: true,
      unlockedAt: '2024-01-10'
    },
    {
      id: '2',
      title: 'Code Warrior',
      description: 'Write 10,000 lines of code',
      icon: 'zap',
      category: 'code',
      points: 200,
      unlocked: true,
      progress: 8543,
      maxProgress: 10000,
      unlockedAt: '2024-01-15'
    },
    {
      id: '3',
      title: 'Bug Hunter',
      description: 'Fix 50 bugs in your projects',
      icon: 'target',
      category: 'code',
      points: 150,
      unlocked: false,
      progress: 32,
      maxProgress: 50
    },
    {
      id: '4',
      title: 'Community Helper',
      description: 'Help 25 other developers with their code',
      icon: 'award',
      category: 'community',
      points: 300,
      unlocked: false,
      progress: 12,
      maxProgress: 25
    },
    {
      id: '5',
      title: 'Speed Demon',
      description: 'Complete 10 challenges in under 5 minutes each',
      icon: 'zap',
      category: 'milestone',
      points: 250,
      unlocked: true,
      unlockedAt: '2024-01-18'
    },
    {
      id: '6',
      title: 'Master Builder',
      description: 'Complete 100 projects',
      icon: 'trophy',
      category: 'milestone',
      points: 500,
      unlocked: false,
      progress: 47,
      maxProgress: 100
    }
  ];

  const getIcon = (iconName: string, unlocked: boolean) => {
    const className = `h-8 w-8 ${unlocked ? 'text-primary' : 'text-muted-foreground'}`;
    switch (iconName) {
      case 'star':
        return <Star className={className} />;
      case 'zap':
        return <Zap className={className} />;
      case 'target':
        return <Target className={className} />;
      case 'award':
        return <Award className={className} />;
      case 'trophy':
        return <Trophy className={className} />;
      default:
        return <Star className={className} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'code':
        return 'default';
      case 'learning':
        return 'secondary';
      case 'community':
        return 'outline';
      case 'milestone':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const levelProgress = (userStats.totalPoints / userStats.nextLevelPoints) * 100;

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Achievements & Progress</h2>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Trophy className="mr-2 h-5 w-5" />
          Level {userStats.level}
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{userStats.totalPoints}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{userStats.rank}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                {userStats.achievements}/{userStats.totalAchievements}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{userStats.totalPoints} / {userStats.nextLevelPoints}</span>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <Progress value={levelProgress} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements List */}
      <Tabs defaultValue="all" className="flex-1">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="milestone">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <ScrollArea className="h-[500px]">
            <div className="grid gap-4 md:grid-cols-2">
              {mockAchievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`${achievement.unlocked ? 'bg-accent/50' : 'opacity-75'} transition-all hover:bg-accent`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {achievement.unlocked ? (
                          getIcon(achievement.icon, true)
                        ) : (
                          <div className="relative">
                            {getIcon(achievement.icon, false)}
                            <Lock className="absolute -top-1 -right-1 h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-lg">{achievement.title}</CardTitle>
                          <Badge variant={getCategoryColor(achievement.category)} className="mt-1">
                            {achievement.category}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {achievement.points} pts
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    
                    {achievement.progress !== undefined && achievement.maxProgress && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">
                            {achievement.progress} / {achievement.maxProgress}
                          </span>
                        </div>
                        <Progress
                          value={(achievement.progress / achievement.maxProgress) * 100}
                        />
                      </div>
                    )}

                    {achievement.unlockedAt && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Trophy className="h-3 w-3" />
                        <span>Unlocked on {achievement.unlockedAt}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {['code', 'learning', 'community', 'milestone'].map((category) => (
          <TabsContent key={category} value={category} className="mt-4">
            <ScrollArea className="h-[500px]">
              <div className="grid gap-4 md:grid-cols-2">
                {mockAchievements
                  .filter((a) => a.category === category)
                  .map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={`${achievement.unlocked ? 'bg-accent/50' : 'opacity-75'} transition-all hover:bg-accent`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {achievement.unlocked ? (
                              getIcon(achievement.icon, true)
                            ) : (
                              <div className="relative">
                                {getIcon(achievement.icon, false)}
                                <Lock className="absolute -top-1 -right-1 h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <CardTitle className="text-lg">{achievement.title}</CardTitle>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {achievement.points} pts
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        
                        {achievement.progress !== undefined && achievement.maxProgress && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-semibold">
                                {achievement.progress} / {achievement.maxProgress}
                              </span>
                            </div>
                            <Progress
                              value={(achievement.progress / achievement.maxProgress) * 100}
                            />
                          </div>
                        )}

                        {achievement.unlockedAt && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Trophy className="h-3 w-3" />
                            <span>Unlocked on {achievement.unlockedAt}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TutorialMode } from './TutorialMode';
import { ChallengeMode } from './ChallengeMode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Star, 
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

interface EducationalHubProps {
  onCodeUpdate?: (code: string, language: string) => void;
}

export const EducationalHub: React.FC<EducationalHubProps> = ({ onCodeUpdate }) => {
  const [userStats] = useState({
    tutorialsCompleted: 3,
    challengesSolved: 8,
    totalScore: 195,
    currentStreak: 5,
    timeSpent: 240, // minutes
    level: 2,
    nextLevelScore: 250
  });

  const achievements = [
    { name: 'First Steps', description: 'Complete your first tutorial', icon: '🎯', unlocked: true },
    { name: 'Problem Solver', description: 'Solve 5 challenges', icon: '🧩', unlocked: true },
    { name: 'Speed Coder', description: 'Solve a challenge in under 5 minutes', icon: '⚡', unlocked: false },
    { name: 'Perfectionist', description: 'Get 100% on 3 challenges', icon: '💎', unlocked: false }
  ];

  return (
    <div className="h-full">
      <Tabs defaultValue="overview" className="h-full">
        <TabsList className="grid w-full grid-cols-4 text-xs mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="h-[calc(100%-3rem)] overflow-auto">
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-lg font-bold">{userStats.tutorialsCompleted}</div>
                  <div className="text-xs text-muted-foreground">Tutorials</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Target className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-lg font-bold">{userStats.challengesSolved}</div>
                  <div className="text-xs text-muted-foreground">Challenges</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="text-lg font-bold">{userStats.totalScore}</div>
                  <div className="text-xs text-muted-foreground">Points</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="text-lg font-bold">{userStats.currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </CardContent>
              </Card>
            </div>

            {/* Level Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Level {userStats.level}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Level {userStats.level + 1}</span>
                    <span>{userStats.totalScore}/{userStats.nextLevelScore}</span>
                  </div>
                  <Progress 
                    value={(userStats.totalScore / userStats.nextLevelScore) * 100} 
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground">
                    {userStats.nextLevelScore - userStats.totalScore} points to next level
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-3 p-2 rounded ${
                        achievement.unlocked ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="text-lg">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${
                          achievement.unlocked ? 'text-green-800' : 'text-gray-500'
                        }`}>
                          {achievement.name}
                        </div>
                        <div className={`text-xs ${
                          achievement.unlocked ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {achievement.description}
                        </div>
                      </div>
                      {achievement.unlocked && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium">Continue Learning</div>
                  <div className="text-xs text-muted-foreground">Resume tutorial</div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-sm font-medium">Daily Challenge</div>
                  <div className="text-xs text-muted-foreground">Earn bonus points</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="h-[calc(100%-3rem)]">
          <TutorialMode onCodeUpdate={onCodeUpdate} />
        </TabsContent>

        <TabsContent value="challenges" className="h-[calc(100%-3rem)]">
          <ChallengeMode onCodeUpdate={onCodeUpdate} />
        </TabsContent>

        <TabsContent value="progress" className="h-[calc(100%-3rem)] overflow-auto">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Learning Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Time Spent Learning</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.floor(userStats.timeSpent / 60)}h {userStats.timeSpent % 60}m
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Average Score</span>
                    <span>{Math.round(userStats.totalScore / userStats.challengesSolved)}%</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span>85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Skills Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Python Basics', 'JavaScript', 'Algorithms', 'Data Structures'].map((skill, index) => {
                    const progress = [75, 60, 45, 30][index];
                    return (
                      <div key={skill}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{skill}</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Completed "Python Functions" tutorial</span>
                    <Badge variant="outline" className="text-xs">2h ago</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span>Solved "Reverse String" challenge</span>
                    <Badge variant="outline" className="text-xs">1d ago</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span>Earned "Problem Solver" achievement</span>
                    <Badge variant="outline" className="text-xs">3d ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
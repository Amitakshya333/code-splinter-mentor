import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Share2, 
  Heart, 
  MessageCircle, 
  Star, 
  Trophy, 
  Users, 
  Code,
  GitFork,
  Eye,
  Download,
  Filter,
  Search,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface SharedCode {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    level: number;
  };
  likes: number;
  comments: number;
  views: number;
  forks: number;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  isLiked: boolean;
}

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  participants: number;
  solutions: number;
  reward: number;
  deadline: Date;
  status: 'active' | 'completed' | 'upcoming';
}

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  rank: number;
  badges: string[];
  codeShares: number;
  challengesCompleted: number;
  totalLikes: number;
  joinDate: Date;
}

const mockSharedCodes: SharedCode[] = [
  {
    id: '1',
    title: 'Responsive Navigation Component',
    description: 'A flexible navigation component built with React and Tailwind CSS',
    code: 'const Navigation = () => {\n  return (\n    <nav className="flex items-center justify-between p-4">\n      {/* Navigation content */}\n    </nav>\n  );\n};',
    language: 'javascript',
    author: {
      id: '1',
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      level: 42
    },
    likes: 245,
    comments: 23,
    views: 1580,
    forks: 67,
    tags: ['React', 'Navigation', 'Responsive'],
    difficulty: 'intermediate',
    createdAt: new Date('2024-01-15'),
    isLiked: false
  },
  {
    id: '2',
    title: 'Custom Hooks Collection',
    description: 'Useful React hooks for common patterns',
    code: 'export const useLocalStorage = (key, initialValue) => {\n  // Hook implementation\n};',
    language: 'javascript',
    author: {
      id: '2',
      name: 'Alex Rodriguez',
      avatar: '/avatars/alex.jpg',
      level: 38
    },
    likes: 189,
    comments: 15,
    views: 923,
    forks: 45,
    tags: ['React', 'Hooks', 'Utilities'],
    difficulty: 'advanced',
    createdAt: new Date('2024-01-20'),
    isLiked: true
  }
];

const mockChallenges: CommunityChallenge[] = [
  {
    id: '1',
    title: 'Build a Weather App',
    description: 'Create a responsive weather application using a weather API',
    difficulty: 'intermediate',
    category: 'Frontend',
    participants: 234,
    solutions: 187,
    reward: 500,
    deadline: new Date('2024-02-15'),
    status: 'active'
  },
  {
    id: '2',
    title: 'Algorithm Challenge: Binary Tree',
    description: 'Implement various binary tree algorithms and optimizations',
    difficulty: 'advanced',
    category: 'Algorithms',
    participants: 156,
    solutions: 89,
    reward: 750,
    deadline: new Date('2024-02-20'),
    status: 'active'
  }
];

const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Your Name',
  avatar: '/avatars/user.jpg',
  level: 25,
  xp: 12450,
  rank: 156,
  badges: ['First Share', 'Code Reviewer', 'Challenge Winner'],
  codeShares: 12,
  challengesCompleted: 8,
  totalLikes: 234,
  joinDate: new Date('2023-06-01')
};

interface CommunityHubProps {
  onCodeUpdate?: (code: string, language: string) => void;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ onCodeUpdate }) => {
  const { sharedCodes, addSharedCode, communityStats } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newCodeTitle, setNewCodeTitle] = useState('');
  const [newCodeDescription, setNewCodeDescription] = useState('');
  const [newCode, setNewCode] = useState('');

  const handleShareCode = () => {
    if (newCodeTitle && newCodeDescription && newCode) {
      const codeShare = {
        id: Date.now().toString(),
        title: newCodeTitle,
        description: newCodeDescription,
        code: newCode,
        language: 'javascript',
        author: mockUserProfile,
        likes: 0,
        comments: 0,
        views: 0,
        forks: 0,
        tags: [],
        difficulty: 'beginner' as const,
        createdAt: new Date(),
        isLiked: false
      };
      
      addSharedCode(codeShare);
      setNewCodeTitle('');
      setNewCodeDescription('');
      setNewCode('');
    }
  };

  const handleRunCode = (code: string, language: string) => {
    if (onCodeUpdate) {
      onCodeUpdate(code, language);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'upcoming': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full">
      <Tabs defaultValue="browse" className="h-full flex flex-col">
        <div className="p-4 border-b">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Code</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="share">Share Code</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="browse" className="flex-1 p-4">
          <div className="space-y-4">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search shared code..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{communityStats.totalUsers || 1234}</p>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{communityStats.codeShares || 567}</p>
                      <p className="text-sm text-muted-foreground">Code Shares</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">{communityStats.activeChallenges || 12}</p>
                      <p className="text-sm text-muted-foreground">Active Challenges</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shared Code List */}
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {[...mockSharedCodes, ...sharedCodes].map((codeShare) => (
                  <Card key={codeShare.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {codeShare.title}
                            <Badge className={getDifficultyColor(codeShare.difficulty)}>
                              {codeShare.difficulty}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{codeShare.description}</CardDescription>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={codeShare.author.avatar} />
                                <AvatarFallback>{codeShare.author.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {codeShare.author.name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {codeShare.createdAt.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                          <code>{codeShare.code}</code>
                        </pre>
                        
                        <div className="flex flex-wrap gap-2">
                          {codeShare.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className={`h-4 w-4 ${codeShare.isLiked ? 'text-red-500 fill-current' : ''}`} />
                              {codeShare.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {codeShare.comments}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {codeShare.views}
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="h-4 w-4" />
                              {codeShare.forks}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRunCode(codeShare.code, codeShare.language)}
                            >
                              Run Code
                            </Button>
                            <Button size="sm" variant="outline">
                              <GitFork className="h-4 w-4 mr-1" />
                              Fork
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="flex-1 p-4">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Community Challenges</h2>
                <Button>
                  <Trophy className="h-4 w-4 mr-2" />
                  Create Challenge
                </Button>
              </div>

              {mockChallenges.map((challenge) => (
                <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {challenge.title}
                          <Badge className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                          <Badge className={getStatusColor(challenge.status)}>
                            {challenge.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{challenge.reward} XP</p>
                        <p className="text-sm text-muted-foreground">Reward</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {challenge.participants} participants
                        </div>
                        <div className="flex items-center gap-1">
                          <Code className="h-4 w-4" />
                          {challenge.solutions} solutions
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Ends {challenge.deadline.toLocaleDateString()}
                        </div>
                      </div>
                      <Button>
                        Join Challenge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="share" className="flex-1 p-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share Your Code
              </CardTitle>
              <CardDescription>
                Share your code with the community and get feedback from other developers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Give your code a descriptive title..."
                  value={newCodeTitle}
                  onChange={(e) => setNewCodeTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe what your code does and why it's useful..."
                  value={newCodeDescription}
                  onChange={(e) => setNewCodeDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Code</label>
                <Textarea
                  placeholder="Paste your code here..."
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  rows={10}
                  className="font-mono"
                />
              </div>
              <Button 
                onClick={handleShareCode}
                disabled={!newCodeTitle || !newCodeDescription || !newCode}
                className="w-full"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Code
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="flex-1 p-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={mockUserProfile.avatar} />
                    <AvatarFallback>{mockUserProfile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{mockUserProfile.name}</h2>
                    <p className="text-muted-foreground">Level {mockUserProfile.level} Developer</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Rank #{mockUserProfile.rank}
                      </span>
                      <span>{mockUserProfile.xp} XP</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{mockUserProfile.codeShares}</p>
                    <p className="text-sm text-muted-foreground">Code Shares</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{mockUserProfile.challengesCompleted}</p>
                    <p className="text-sm text-muted-foreground">Challenges Completed</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{mockUserProfile.totalLikes}</p>
                    <p className="text-sm text-muted-foreground">Total Likes</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{mockUserProfile.badges.length}</p>
                    <p className="text-sm text-muted-foreground">Badges Earned</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockUserProfile.badges.map((badge) => (
                    <Badge key={badge} variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
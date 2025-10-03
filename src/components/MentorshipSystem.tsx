import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Star, MessageCircle, Video, Calendar, Search } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  expertise: string[];
  rating: number;
  sessions: number;
  availability: string;
  description: string;
  languages: string[];
}

interface MentorSession {
  id: string;
  mentor: string;
  date: string;
  duration: string;
  topic: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export const MentorshipSystem = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);

  const mockMentors: Mentor[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      expertise: ['React', 'TypeScript', 'Node.js'],
      rating: 4.9,
      sessions: 156,
      availability: 'Mon-Fri, 9AM-5PM EST',
      description: 'Senior full-stack developer with 10+ years of experience. Specialized in React ecosystem and building scalable applications.',
      languages: ['English', 'Spanish']
    },
    {
      id: '2',
      name: 'Michael Chen',
      expertise: ['Python', 'Machine Learning', 'Data Science'],
      rating: 4.8,
      sessions: 203,
      availability: 'Tue-Sat, 2PM-8PM PST',
      description: 'AI/ML expert with background in data science and algorithm optimization. Love teaching practical ML concepts.',
      languages: ['English', 'Mandarin']
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      expertise: ['UI/UX', 'Design Systems', 'Accessibility'],
      rating: 5.0,
      sessions: 98,
      availability: 'Wed-Sun, 10AM-4PM GMT',
      description: 'Design-focused developer passionate about creating inclusive and beautiful user interfaces.',
      languages: ['English', 'Portuguese']
    }
  ];

  const mockSessions: MentorSession[] = [
    {
      id: '1',
      mentor: 'Sarah Johnson',
      date: '2024-01-20',
      duration: '1 hour',
      topic: 'React Hooks Best Practices',
      status: 'scheduled'
    },
    {
      id: '2',
      mentor: 'Michael Chen',
      date: '2024-01-18',
      duration: '45 minutes',
      topic: 'Introduction to Neural Networks',
      status: 'completed'
    }
  ];

  const filteredMentors = mockMentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBookSession = (mentorId: string) => {
    console.log('Booking session with mentor:', mentorId);
  };

  const handleMessage = (mentorId: string) => {
    console.log('Opening chat with mentor:', mentorId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'scheduled':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mentorship Program</h2>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Become a Mentor
        </Button>
      </div>

      <Tabs defaultValue="find" className="flex-1">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="find">Find a Mentor</TabsTrigger>
          <TabsTrigger value="sessions">My Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="find" className="mt-4">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredMentors.map((mentor) => (
                <Card key={mentor.id} className="hover:bg-accent/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{mentor.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-semibold">{mentor.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {mentor.sessions} sessions
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">{mentor.description}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2">Expertise:</p>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-1">Languages:</p>
                      <p className="text-sm text-muted-foreground">{mentor.languages.join(', ')}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-1">Availability:</p>
                      <p className="text-sm text-muted-foreground">{mentor.availability}</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1" onClick={() => handleBookSession(mentor.id)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Session
                      </Button>
                      <Button variant="outline" onClick={() => handleMessage(mentor.id)}>
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sessions" className="mt-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {mockSessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{session.topic}</CardTitle>
                      <Badge variant={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{session.mentor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">{session.mentor}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {session.date}
                          </span>
                          <span>{session.duration}</span>
                        </div>
                      </div>

                      {session.status === 'scheduled' && (
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" className="flex-1">
                            <Video className="mr-2 h-4 w-4" />
                            Join Session
                          </Button>
                          <Button variant="outline">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

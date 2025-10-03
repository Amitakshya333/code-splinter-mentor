import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GitPullRequest, MessageSquare, ThumbsUp, ThumbsDown, CheckCircle2, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CodeReview {
  id: string;
  title: string;
  author: string;
  status: 'pending' | 'approved' | 'changes_requested';
  linesChanged: number;
  comments: number;
  createdAt: string;
}

interface ReviewComment {
  id: string;
  author: string;
  content: string;
  line: number;
  timestamp: string;
  resolved: boolean;
}

export const CodeReviewPanel = () => {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const mockReviews: CodeReview[] = [
    {
      id: '1',
      title: 'Add authentication system',
      author: 'John Doe',
      status: 'pending',
      linesChanged: 234,
      comments: 5,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Refactor API handlers',
      author: 'Jane Smith',
      status: 'approved',
      linesChanged: 156,
      comments: 3,
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      title: 'Update UI components',
      author: 'Bob Wilson',
      status: 'changes_requested',
      linesChanged: 89,
      comments: 8,
      createdAt: '2024-01-13'
    }
  ];

  const mockComments: ReviewComment[] = [
    {
      id: '1',
      author: 'Reviewer 1',
      content: 'Consider using async/await instead of promises here for better readability.',
      line: 42,
      timestamp: '2024-01-15 10:30',
      resolved: false
    },
    {
      id: '2',
      author: 'Reviewer 2',
      content: 'Great implementation! This looks clean and efficient.',
      line: 78,
      timestamp: '2024-01-15 11:45',
      resolved: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'changes_requested':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'changes_requested':
        return <XCircle className="h-4 w-4" />;
      default:
        return <GitPullRequest className="h-4 w-4" />;
    }
  };

  const handleApprove = () => {
    console.log('Approving review');
  };

  const handleRequestChanges = () => {
    console.log('Requesting changes');
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Code Reviews</h2>
        <Button>
          <GitPullRequest className="mr-2 h-4 w-4" />
          Create Review
        </Button>
      </div>

      <Tabs defaultValue="pending" className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="changes">Changes Requested</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {mockReviews.filter(r => r.status === 'pending').map((review) => (
                <Card key={review.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setSelectedReview(review.id)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{review.title}</CardTitle>
                      <Badge variant={getStatusColor(review.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(review.status)}
                          {review.status.replace('_', ' ')}
                        </span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{review.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span>{review.author}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>{review.linesChanged} lines changed</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {review.comments}
                        </span>
                        <span>{review.createdAt}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {mockReviews.filter(r => r.status === 'approved').map((review) => (
                <Card key={review.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{review.title}</CardTitle>
                      <Badge variant={getStatusColor(review.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(review.status)}
                          {review.status.replace('_', ' ')}
                        </span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{review.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span>{review.author}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>{review.linesChanged} lines changed</span>
                        <span>{review.createdAt}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="changes" className="mt-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {mockReviews.filter(r => r.status === 'changes_requested').map((review) => (
                <Card key={review.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{review.title}</CardTitle>
                      <Badge variant={getStatusColor(review.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(review.status)}
                          {review.status.replace('_', ' ')}
                        </span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{review.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span>{review.author}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>{review.linesChanged} lines changed</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {review.comments}
                        </span>
                        <span>{review.createdAt}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {selectedReview && (
        <Card>
          <CardHeader>
            <CardTitle>Review Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] mb-4">
              <div className="space-y-4">
                {mockComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 bg-accent/50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{comment.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">Line {comment.line}</span>
                      </div>
                      <p className="text-sm mb-2">{comment.content}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{comment.timestamp}</span>
                        {comment.resolved && <Badge variant="outline" className="text-xs">Resolved</Badge>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-3">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleApprove}>
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button variant="outline" onClick={handleRequestChanges}>
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Request Changes
                  </Button>
                </div>
                <Button onClick={handleAddComment}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Add Comment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

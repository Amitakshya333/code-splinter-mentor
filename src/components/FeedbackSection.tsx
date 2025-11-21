import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  MessageSquare, 
  Star, 
  Send,
  Lightbulb,
  Bug,
  Heart,
  Zap,
  Loader2
} from 'lucide-react';

interface FeedbackItem {
  id: string;
  type: 'bug' | 'feature' | 'improvement' | 'praise';
  title: string;
  description: string;
  rating: number;
  created_at: string;
  status: string;
}

const FEEDBACK_TYPES = [
  { id: 'bug', label: 'Bug Report', icon: Bug, color: 'bg-destructive/10 text-destructive' },
  { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'bg-primary/10 text-primary' },
  { id: 'improvement', label: 'Improvement', icon: Zap, color: 'bg-accent/10 text-accent-foreground' },
  { id: 'praise', label: 'Praise', icon: Heart, color: 'bg-green-500/10 text-green-600' }
] as const;

export const FeedbackSection: React.FC = () => {
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'improvement' | 'praise'>('improvement');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(5);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load feedback history
  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      setFeedbackHistory((data || []) as FeedbackItem[]);
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Incomplete Feedback",
        description: "Please fill in both title and description",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;

      // If no session, try getting user directly
      let userId = session?.user?.id;
      
      if (!userId) {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          toast({
            title: "Authentication Required",
            description: "Please refresh the page and try again",
            variant: "destructive",
          });
          return;
        }
        userId = user.id;
      }

      // Insert feedback
      const { data, error } = await supabase
        .from('feedback')
        .insert([{
          user_id: userId,
          type: feedbackType,
          title: title.trim(),
          description: description.trim(),
          rating: rating
        }])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setFeedbackHistory(prev => [data as FeedbackItem, ...prev]);
      
      // Reset form
      setTitle('');
      setDescription('');
      setRating(5);

      toast({
        title: "Feedback Submitted! 🎉",
        description: "Thank you for helping us improve",
      });

    } catch (error: any) {
      console.error('Feedback submission error:', error);
      toast({
        title: "Submission Failed",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = FEEDBACK_TYPES.find(t => t.id === type);
    const Icon = typeConfig?.icon || MessageSquare;
    return <Icon className="w-4 h-4" />;
  };

  const getTypeColor = (type: string) => {
    return FEEDBACK_TYPES.find(t => t.id === type)?.color || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="h-full space-y-4 p-4">
      {/* Feedback Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="w-5 h-5" />
            Share Your Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Feedback Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Feedback Type</label>
            <div className="grid grid-cols-2 gap-2">
              {FEEDBACK_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={feedbackType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFeedbackType(type.id as any)}
                    className="justify-start"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of your feedback"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information..."
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Overall Experience Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  onClick={() => setRating(star)}
                  className="p-1 h-auto hover:bg-transparent"
                >
                  <Star 
                    className={`w-6 h-6 transition-colors ${
                      star <= rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                </Button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Feedback History */}
      {feedbackHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feedbackHistory.map((feedback) => (
                <div 
                  key={feedback.id} 
                  className="border border-border rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getTypeIcon(feedback.type)}
                      <span className="font-medium text-sm truncate">{feedback.title}</span>
                    </div>
                    <Badge variant="secondary" className={getTypeColor(feedback.type)}>
                      {feedback.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {feedback.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{feedback.rating}/5</span>
                    </div>
                    <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

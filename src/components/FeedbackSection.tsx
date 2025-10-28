import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';
import { 
  MessageSquare, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Send,
  Lightbulb,
  Bug,
  Heart,
  Zap
} from 'lucide-react';

export interface FeedbackItem {
  id: string;
  type: 'bug' | 'feature' | 'improvement' | 'praise';
  title: string;
  description: string;
  rating: number;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'resolved';
}

export const FeedbackSection: React.FC = () => {
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'improvement' | 'praise'>('improvement');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(5);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { userId } = useAppStore();

  const feedbackTypes = [
    { id: 'bug', label: 'Bug Report', icon: Bug, color: 'bg-red-100 text-red-800' },
    { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'bg-blue-100 text-blue-800' },
    { id: 'improvement', label: 'Improvement', icon: Zap, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'praise', label: 'Praise', icon: Heart, color: 'bg-green-100 text-green-800' }
  ];

  const handleSubmitFeedback = async () => {
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Incomplete Feedback",
        description: "Please fill in both title and description",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log('=== FEEDBACK SUBMISSION START ===');

    try {
      console.log('1. Checking authentication...');
      
      // CRITICAL: Get fresh session directly from Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('2. Session check:', {
        hasSession: !!session,
        userId: session?.user?.id,
        error: sessionError
      });
      
      // If no session, try getting user directly
      if (!session) {
        console.log('3. No session found, trying direct user check...');
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        console.log('4. Direct user check:', { 
          userId: user?.id, 
          error: userError 
        });
        
        if (!user) {
          console.error('❌ No authenticated user found');
          toast({
            title: "Authentication Required",
            description: "Please refresh the page and try again.",
            variant: "destructive",
          });
          return;
        }
        
        // Use user ID from direct check
        console.log('5. Submitting feedback with user ID:', user.id);
        
        const feedbackRecord = {
          user_id: user.id,
          type: feedbackType,
          title: title.trim(),
          description: description.trim(),
          rating: rating
        };
        
        console.log('6. Feedback record:', feedbackRecord);
        
        const { data, error } = await supabase
          .from('feedback')
          .insert([feedbackRecord])
          .select()
          .single();
        
        console.log('7. Supabase response:', { data, error });
        
        if (error) {
          console.error('❌ Insert failed:', error);
          toast({
            title: "Submission Failed",
            description: `Error: ${error.message}`,
            variant: "destructive",
          });
          return;
        }
        
        console.log('✅ SUCCESS - Feedback saved to Supabase');
        
        // Add to local state
        if (data) {
          const newFeedback: FeedbackItem = {
            id: data.id,
            type: feedbackType,
            title: title.trim(),
            description: description.trim(),
            rating,
            timestamp: new Date(data.created_at),
            status: data.status as any
          };
          setFeedbackHistory(prev => [newFeedback, ...prev]);
        }
        
        // Reset form
        setTitle('');
        setDescription('');
        setRating(5);
        
        toast({
          title: "Feedback Submitted! 🎉",
          description: "Thank you for helping us improve CodeSplinter",
        });
        
        console.log('=== FEEDBACK SUBMISSION COMPLETE ===');
        return;
      }
      
      // If session exists, use it
      console.log('3. Session found, submitting with session user ID:', session.user.id);
      
      const feedbackRecord = {
        user_id: session.user.id,
        type: feedbackType,
        title: title.trim(),
        description: description.trim(),
        rating: rating
      };
      
      console.log('4. Feedback record:', feedbackRecord);
      
      const { data, error } = await supabase
        .from('feedback')
        .insert([feedbackRecord])
        .select()
        .single();
      
      console.log('5. Supabase response:', { data, error });
      
      if (error) {
        console.error('❌ Insert failed:', error);
        toast({
          title: "Submission Failed",
          description: `Error: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      console.log('✅ SUCCESS - Feedback saved to Supabase');
      
      // Add to local state
      if (data) {
        const newFeedback: FeedbackItem = {
          id: data.id,
          type: feedbackType,
          title: title.trim(),
          description: description.trim(),
          rating,
          timestamp: new Date(data.created_at),
          status: data.status as any
        };
        setFeedbackHistory(prev => [newFeedback, ...prev]);
      }
      
      // Reset form
      setTitle('');
      setDescription('');
      setRating(5);
      
      toast({
        title: "Feedback Submitted! 🎉",
        description: "Thank you for helping us improve CodeSplinter",
      });
      
      console.log('=== FEEDBACK SUBMISSION COMPLETE ===');
      
    } catch (error: any) {
      console.error('❌ UNEXPECTED ERROR:', error);
      toast({
        title: "Submission Failed",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = feedbackTypes.find(t => t.id === type);
    const IconComponent = typeConfig?.icon || MessageSquare;
    return <IconComponent className="w-4 h-4" />;
  };

  const getTypeColor = (type: string) => {
    const typeConfig = feedbackTypes.find(t => t.id === type);
    return typeConfig?.color || 'bg-gray-100 text-gray-800';
  };

  // Load feedback history from Supabase on component mount
  useEffect(() => {
    const loadFeedback = async () => {
      try {
        console.log('=== LOADING FEEDBACK HISTORY ===');
        
        // Get fresh session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log('No authenticated user, skipping feedback load');
          setIsLoading(false);
          return;
        }

        console.log('Loading feedback for user:', session.user.id);
        
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error loading feedback:', error);
        } else if (data) {
          const loadedFeedback: FeedbackItem[] = data.map(item => ({
            id: item.id,
            type: item.type as any,
            title: item.title,
            description: item.description || '',
            rating: item.rating || 5,
            timestamp: new Date(item.created_at),
            status: item.status as any
          }));
          
          console.log('✅ Loaded', loadedFeedback.length, 'feedback items from Supabase');
          setFeedbackHistory(loadedFeedback);
        }
      } catch (error) {
        console.error('Error loading feedback:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedback();
  }, []);

  return (
    <div className="h-full space-y-4">
      {/* Feedback Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Share Your Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Feedback Type Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Feedback Type</label>
            <div className="grid grid-cols-2 gap-2">
              {feedbackTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={feedbackType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFeedbackType(type.id as any)}
                    className="justify-start"
                  >
                    <IconComponent className="w-3 h-3 mr-2" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of your feedback"
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about your feedback..."
              className="min-h-[80px] text-sm resize-none"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Overall Experience Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  onClick={() => setRating(star)}
                  className="p-1 h-auto"
                >
                  <Star 
                    className={`w-5 h-5 ${
                      star <= rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                </Button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmitFeedback} 
            className="w-full"
            disabled={isSubmitting}
          >
            <Send className="w-3 h-3 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setFeedbackType('praise');
                setTitle('Great experience!');
                setDescription('I love using CodeSplinter because...');
              }}
              className="text-xs"
            >
              <ThumbsUp className="w-3 h-3 mr-1" />
              Quick Praise
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setFeedbackType('bug');
                setTitle('Found a bug');
                setDescription('Steps to reproduce:\n1. \n2. \n3. \n\nExpected: \nActual: ');
              }}
              className="text-xs"
            >
              <ThumbsDown className="w-3 h-3 mr-1" />
              Report Issue
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback History */}
      {feedbackHistory.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[200px] overflow-y-auto">
              {feedbackHistory.slice(0, 3).map((feedback) => (
                <div key={feedback.id} className="border border-border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(feedback.type)}
                      <span className="text-sm font-medium">{feedback.title}</span>
                    </div>
                    <Badge className={getTypeColor(feedback.type)}>
                      {feedback.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {feedback.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {feedback.rating}/5
                    </div>
                    <span>{feedback.timestamp.toLocaleDateString()}</span>
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
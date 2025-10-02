import { useState } from 'react';
import { useCollaboration } from '@/hooks/useCollaboration';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Users, 
  Share2,
  MessageSquare,
  ScreenShare,
  Settings,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LiveCodingSession = () => {
  const { toast } = useToast();
  const [roomId, setRoomId] = useState(`room_${Date.now()}`);
  const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
  const { collaborators, isConnected } = useCollaboration(roomId, userId);
  
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ user: string; message: string }>>([]);

  const copyRoomLink = () => {
    const link = `${window.location.origin}/session/${roomId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link Copied',
      description: 'Session link copied to clipboard',
    });
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? 'Video Off' : 'Video On',
      description: `Video has been ${isVideoOn ? 'disabled' : 'enabled'}`,
    });
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast({
      title: isAudioOn ? 'Audio Off' : 'Audio On',
      description: `Audio has been ${isAudioOn ? 'disabled' : 'enabled'}`,
    });
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? 'Screen Share Stopped' : 'Screen Share Started',
      description: `Screen sharing ${isScreenSharing ? 'disabled' : 'enabled'}`,
    });
  };

  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatMessages([...chatMessages, { user: 'You', message: chatMessage }]);
    setChatMessage('');
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Live Coding Session</h2>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-sm">Session Room</CardTitle>
          <CardDescription>Share this room ID with collaborators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={roomId} readOnly />
            <Button variant="outline" onClick={copyRoomLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <Button
          variant={isVideoOn ? "default" : "outline"}
          onClick={toggleVideo}
          className="flex flex-col gap-1 h-auto py-3"
        >
          {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          <span className="text-xs">Video</span>
        </Button>
        <Button
          variant={isAudioOn ? "default" : "outline"}
          onClick={toggleAudio}
          className="flex flex-col gap-1 h-auto py-3"
        >
          {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          <span className="text-xs">Audio</span>
        </Button>
        <Button
          variant={isScreenSharing ? "default" : "outline"}
          onClick={toggleScreenShare}
          className="flex flex-col gap-1 h-auto py-3"
        >
          <ScreenShare className="h-5 w-5" />
          <span className="text-xs">Share</span>
        </Button>
        <Button
          variant={showChat ? "default" : "outline"}
          onClick={() => setShowChat(!showChat)}
          className="flex flex-col gap-1 h-auto py-3"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs">Chat</span>
        </Button>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Participants ({collaborators.length + 1})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-sm font-medium">You (Host)</span>
              <Badge variant="default">Active</Badge>
            </div>
            {collaborators.map((collab) => (
              <div key={collab.user_id} className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">{collab.username}</span>
                <Badge variant="secondary">Guest</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showChat && (
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm">Session Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-3">
            <ScrollArea className="flex-1 mb-3 pr-3">
              <div className="space-y-2">
                {chatMessages.map((msg, index) => (
                  <div key={index} className="p-2 bg-muted rounded">
                    <div className="text-xs font-medium mb-1">{msg.user}</div>
                    <div className="text-sm">{msg.message}</div>
                  </div>
                ))}
                {chatMessages.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    No messages yet
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

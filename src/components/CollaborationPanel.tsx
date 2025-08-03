import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCollaboration } from '@/hooks/useCollaboration';
import { Users, Wifi, WifiOff, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface CollaborationPanelProps {
  roomId: string;
  userId: string;
  onShareRoom: (roomId: string) => void;
}

export const CollaborationPanel = ({ roomId, userId, onShareRoom }: CollaborationPanelProps) => {
  const [newRoomId, setNewRoomId] = useState('');
  const { collaborators, isConnected, codeChanges } = useCollaboration(roomId, userId);

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 10);
    setNewRoomId(id);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success('Room ID copied to clipboard');
  };

  const shareRoom = () => {
    const shareUrl = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard');
    onShareRoom(roomId);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Collaboration
          <Badge variant={isConnected ? "default" : "secondary"} className="ml-auto">
            {isConnected ? (
              <>
                <Wifi className="h-3 w-3 mr-1" />
                Online
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </>
            )}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Room Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Room ID:</span>
            <Badge variant="outline" className="font-mono">
              {roomId}
            </Badge>
            <Button size="sm" variant="ghost" onClick={copyRoomId}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" onClick={shareRoom} className="flex-1">
              <Share2 className="h-3 w-3 mr-1" />
              Share Room
            </Button>
            <Button size="sm" variant="outline" onClick={generateRoomId}>
              New Room
            </Button>
          </div>
          
          {newRoomId && (
            <div className="flex items-center gap-2">
              <Input
                value={newRoomId}
                onChange={(e) => setNewRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="text-xs"
              />
              <Button size="sm" onClick={() => window.location.href = `?room=${newRoomId}`}>
                Join
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Active Collaborators */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            Active Users ({collaborators.length + 1})
          </h4>
          
          <ScrollArea className="max-h-32">
            <div className="space-y-2">
              {/* Current user */}
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">You</AvatarFallback>
                </Avatar>
                <span className="text-sm">You</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  Host
                </Badge>
              </div>
              
              {/* Other collaborators */}
              {collaborators.map((collaborator) => (
                <div key={collaborator.user_id} className="flex items-center gap-2 p-2 rounded-md border">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {collaborator.username.slice(-2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{collaborator.username}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    Online
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Recent Changes */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Changes</h4>
          
          <ScrollArea className="max-h-40">
            <div className="space-y-1">
              {codeChanges.slice(-5).reverse().map((change) => (
                <div key={change.id} className="text-xs p-2 rounded border">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      User {change.user_id.slice(-4)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {change.operation}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground mt-1">
                    Position: {change.position}
                    {change.length && ` (${change.length} chars)`}
                  </div>
                </div>
              ))}
              
              {codeChanges.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-4">
                  No recent changes
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

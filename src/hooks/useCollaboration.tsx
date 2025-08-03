import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface CollaboratorPresence {
  user_id: string;
  username: string;
  cursor_position: number;
  selected_text: { start: number; end: number } | null;
  last_seen: string;
}

interface CodeChange {
  id: string;
  user_id: string;
  content: string;
  timestamp: string;
  operation: 'insert' | 'delete' | 'replace';
  position: number;
  length?: number;
}

export const useCollaboration = (roomId: string, userId: string) => {
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [codeChanges, setCodeChanges] = useState<CodeChange[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!roomId || !userId) return;

    const collaborationChannel = supabase.channel(`room_${roomId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    // Track user presence
    collaborationChannel
      .on('presence', { event: 'sync' }, () => {
        const newState = collaborationChannel.presenceState();
        const collaboratorList = Object.values(newState)
          .flat()
          .filter((presence: any) => presence.user_id && presence.user_id !== userId)
          .map((presence: any) => ({
            user_id: presence.user_id,
            username: presence.username || `User ${presence.user_id?.slice(-4)}`,
            cursor_position: presence.cursor_position || 0,
            selected_text: presence.selected_text || null,
            last_seen: presence.last_seen || new Date().toISOString(),
          })) as CollaboratorPresence[];
        setCollaborators(collaboratorList);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .on('broadcast', { event: 'code_change' }, ({ payload }) => {
        if (payload.user_id !== userId) {
          setCodeChanges(prev => [...prev, payload]);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          const presenceTrackStatus = await collaborationChannel.track({
            user_id: userId,
            username: `User ${userId.slice(-4)}`,
            cursor_position: 0,
            selected_text: null,
            last_seen: new Date().toISOString(),
          });
          console.log('Presence tracking status:', presenceTrackStatus);
        }
      });

    setChannel(collaborationChannel);

    return () => {
      collaborationChannel.unsubscribe();
      setIsConnected(false);
    };
  }, [roomId, userId]);

  const broadcastCodeChange = useCallback((change: Omit<CodeChange, 'id' | 'timestamp'>) => {
    if (!channel || !isConnected) return;

    const fullChange: CodeChange = {
      ...change,
      id: `${Date.now()}_${Math.random()}`,
      timestamp: new Date().toISOString(),
    };

    channel.send({
      type: 'broadcast',
      event: 'code_change',
      payload: fullChange,
    });
  }, [channel, isConnected]);

  const updatePresence = useCallback((updates: Partial<CollaboratorPresence>) => {
    if (!channel || !isConnected) return;

    channel.track({
      user_id: userId,
      username: `User ${userId.slice(-4)}`,
      cursor_position: 0,
      selected_text: null,
      last_seen: new Date().toISOString(),
      ...updates,
    });
  }, [channel, isConnected, userId]);

  return {
    collaborators,
    codeChanges,
    isConnected,
    broadcastCodeChange,
    updatePresence,
  };
};
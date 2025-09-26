import React, { memo, useMemo, useCallback } from 'react';
import { ProjectGuidance } from '@/components/ProjectGuidance';
import { AIChatMentor } from '@/components/AIChatMentor';
import { CollaborationPanel } from '@/components/CollaborationPanel';
import { PerformancePanel } from '@/components/PerformancePanel';
import { GitPanel } from '@/components/GitPanel';
import { EducationalHub } from '@/components/EducationalHub';
import { FeedbackSection } from '@/components/FeedbackSection';
import { EnhancedOutputConsole } from '@/components/EnhancedOutputConsole';

// Memoized Project Guidance Component
export const MemoizedProjectGuidance = memo<{ onProjectSelect: (project: string) => void }>(
  ({ onProjectSelect }) => {
    const handleProjectSelect = useCallback((project: string) => {
      onProjectSelect(project);
    }, [onProjectSelect]);

    return <ProjectGuidance onProjectSelect={handleProjectSelect} />;
  },
  (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return prevProps.onProjectSelect === nextProps.onProjectSelect;
  }
);

MemoizedProjectGuidance.displayName = 'MemoizedProjectGuidance';

// Memoized AI Chat Mentor Component
export const MemoizedAIChatMentor = memo<{
  currentCode: string;
  currentProject: string | null;
}>(
  ({ currentCode, currentProject }) => {
    return <AIChatMentor currentCode={currentCode} currentProject={currentProject} />;
  },
  (prevProps, nextProps) => {
    return (
      prevProps.currentCode === nextProps.currentCode &&
      prevProps.currentProject === nextProps.currentProject
    );
  }
);

MemoizedAIChatMentor.displayName = 'MemoizedAIChatMentor';

// Memoized Collaboration Panel Component
export const MemoizedCollaborationPanel = memo<{
  roomId: string;
  userId: string;
  onShareRoom: (roomId: string) => void;
}>(
  ({ roomId, userId, onShareRoom }) => {
    const handleShareRoom = useCallback((roomId: string) => {
      onShareRoom(roomId);
    }, [onShareRoom]);

    return (
      <CollaborationPanel
        roomId={roomId}
        userId={userId}
        onShareRoom={handleShareRoom}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.roomId === nextProps.roomId &&
      prevProps.userId === nextProps.userId &&
      prevProps.onShareRoom === nextProps.onShareRoom
    );
  }
);

MemoizedCollaborationPanel.displayName = 'MemoizedCollaborationPanel';

// Memoized Performance Panel Component
export const MemoizedPerformancePanel = memo(() => {
  return <PerformancePanel />;
});

MemoizedPerformancePanel.displayName = 'MemoizedPerformancePanel';

// Memoized Git Panel Component
export const MemoizedGitPanel = memo(() => {
  return <GitPanel />;
});

MemoizedGitPanel.displayName = 'MemoizedGitPanel';

// Memoized Educational Hub Component
export const MemoizedEducationalHub = memo<{
  onCodeUpdate: (code: string, language: string) => void;
}>(
  ({ onCodeUpdate }) => {
    const handleCodeUpdate = useCallback((code: string, language: string) => {
      onCodeUpdate(code, language);
    }, [onCodeUpdate]);

    return <EducationalHub onCodeUpdate={handleCodeUpdate} />;
  },
  (prevProps, nextProps) => {
    return prevProps.onCodeUpdate === nextProps.onCodeUpdate;
  }
);

MemoizedEducationalHub.displayName = 'MemoizedEducationalHub';

// Memoized Feedback Section Component
export const MemoizedFeedbackSection = memo(() => {
  return <FeedbackSection />;
});

MemoizedFeedbackSection.displayName = 'MemoizedFeedbackSection';

// Memoized Enhanced Output Console Component
export const MemoizedEnhancedOutputConsole = memo<{
  currentCode: string;
  currentLanguage: string;
}>(
  ({ currentCode, currentLanguage }) => {
    // Memoize the props to avoid unnecessary re-renders
    const memoizedProps = useMemo(() => ({
      currentCode,
      currentLanguage
    }), [currentCode, currentLanguage]);

    return (
      <EnhancedOutputConsole
        currentCode={memoizedProps.currentCode}
        currentLanguage={memoizedProps.currentLanguage}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.currentCode === nextProps.currentCode &&
      prevProps.currentLanguage === nextProps.currentLanguage
    );
  }
);

MemoizedEnhancedOutputConsole.displayName = 'MemoizedEnhancedOutputConsole';

// Tab Content Wrapper with memoization
export const MemoizedTabContent = memo<{
  children: React.ReactNode;
  value: string;
  activeValue: string;
}>(
  ({ children, value, activeValue }) => {
    const isActive = value === activeValue;
    
    // Only render content when tab is active
    if (!isActive) {
      return null;
    }

    return <>{children}</>;
  },
  (prevProps, nextProps) => {
    const wasActive = prevProps.value === prevProps.activeValue;
    const isActive = nextProps.value === nextProps.activeValue;
    
    // Only re-render if the active state changed
    return wasActive === isActive;
  }
);

MemoizedTabContent.displayName = 'MemoizedTabContent';
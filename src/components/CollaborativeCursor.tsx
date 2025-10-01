import { memo } from 'react';

interface CollaborativeCursorProps {
  username: string;
  color: string;
  position: { line: number; column: number };
  isActive: boolean;
}

export const CollaborativeCursor = memo<CollaborativeCursorProps>(({ 
  username, 
  color, 
  position,
  isActive 
}) => {
  if (!isActive) return null;

  return (
    <div
      className="absolute pointer-events-none z-50 transition-all duration-200"
      style={{
        left: `${position.column * 8}px`,
        top: `${position.line * 20}px`,
      }}
    >
      <div className="relative">
        <div
          className="w-0.5 h-5 animate-pulse"
          style={{ backgroundColor: color }}
        />
        <div
          className="absolute -top-6 left-1 px-2 py-0.5 rounded text-xs text-white whitespace-nowrap shadow-lg"
          style={{ backgroundColor: color }}
        >
          {username}
        </div>
      </div>
    </div>
  );
});

CollaborativeCursor.displayName = 'CollaborativeCursor';

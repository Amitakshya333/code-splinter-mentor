import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export const useNavigationShortcuts = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if Ctrl/Cmd is pressed
      if (!e.ctrlKey && !e.metaKey) return;
      
      // Prevent if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          if (location.pathname !== '/') {
            navigate('/');
            toast.info('Switched to Navigator', { duration: 1500 });
          }
          break;
        case 'i':
          e.preventDefault();
          if (location.pathname !== '/ide') {
            navigate('/ide');
            toast.info('Switched to IDE', { duration: 1500 });
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, location.pathname]);
};

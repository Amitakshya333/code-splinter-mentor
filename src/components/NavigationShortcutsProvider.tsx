import { ReactNode } from 'react';
import { useNavigationShortcuts } from '@/hooks/useNavigationShortcuts';

interface NavigationShortcutsProviderProps {
  children: ReactNode;
}

export const NavigationShortcutsProvider = ({ children }: NavigationShortcutsProviderProps) => {
  useNavigationShortcuts();
  return <>{children}</>;
};

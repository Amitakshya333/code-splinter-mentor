import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types
export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CodeSnippet {
  id: string;
  name: string;
  language: string;
  code: string;
  createdAt: Date;
}

// App State Interface
interface AppState {
  // User state
  user: User | null;
  
  // Current session
  currentCode: string;
  currentLanguage: string;
  currentProject: string | null;
  roomId: string;
  userId: string;
  
  // UI state
  isLoading: boolean;
  feedbackTabValue: string;
  
  // Projects and snippets
  projects: Project[];
  savedSnippets: CodeSnippet[];
  
  // Performance tracking
  performanceMetrics: {
    loadTime: number;
    renderTime: number;
    memoryUsage: number;
  };
  
  // Error tracking
  errors: Array<{
    id: string;
    message: string;
    timestamp: Date;
    context?: string;
  }>;
}

// Actions Interface  
interface AppActions {
  // User actions
  setUser: (user: User | null) => void;
  
  // Session actions
  setCurrentCode: (code: string) => void;
  setCurrentLanguage: (language: string) => void;
  setCurrentProject: (project: string | null) => void;
  setRoomId: (roomId: string) => void;
  setUserId: (userId: string) => void;
  
  // UI actions
  setIsLoading: (loading: boolean) => void;
  setFeedbackTabValue: (value: string) => void;
  
  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Snippet actions
  addSnippet: (snippet: Omit<CodeSnippet, 'id' | 'createdAt'>) => void;
  deleteSnippet: (id: string) => void;
  loadSnippet: (id: string) => void;
  
  // Performance actions
  updatePerformanceMetrics: (metrics: Partial<AppState['performanceMetrics']>) => void;
  
  // Error actions
  addError: (error: string, context?: string) => void;
  clearErrors: () => void;
  
  // Utility actions
  reset: () => void;
}

// Initial state
const initialState: AppState = {
  user: null,
  currentCode: '',
  currentLanguage: 'python',
  currentProject: null,
  roomId: '',
  userId: '',
  isLoading: false,
  feedbackTabValue: 'guidance',
  projects: [],
  savedSnippets: [],
  performanceMetrics: {
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0
  },
  errors: []
};

// Create store
export const useAppStore = create<AppState & AppActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        ...initialState,
        
        // User actions
        setUser: (user) => set({ user }, false, 'setUser'),
        
        // Session actions
        setCurrentCode: (currentCode) => set({ currentCode }, false, 'setCurrentCode'),
        setCurrentLanguage: (currentLanguage) => set({ currentLanguage }, false, 'setCurrentLanguage'),
        setCurrentProject: (currentProject) => set({ currentProject }, false, 'setCurrentProject'),
        setRoomId: (roomId) => set({ roomId }, false, 'setRoomId'),
        setUserId: (userId) => set({ userId }, false, 'setUserId'),
        
        // UI actions
        setIsLoading: (isLoading) => set({ isLoading }, false, 'setIsLoading'),
        setFeedbackTabValue: (feedbackTabValue) => set({ feedbackTabValue }, false, 'setFeedbackTabValue'),
        
        // Project actions
        addProject: (projectData) => {
          const project: Project = {
            ...projectData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
          };
          set(state => ({ 
            projects: [...state.projects, project] 
          }), false, 'addProject');
        },
        
        updateProject: (id, updates) => {
          set(state => ({
            projects: state.projects.map(project =>
              project.id === id 
                ? { ...project, ...updates, updatedAt: new Date() }
                : project
            )
          }), false, 'updateProject');
        },
        
        deleteProject: (id) => {
          set(state => ({
            projects: state.projects.filter(project => project.id !== id)
          }), false, 'deleteProject');
        },
        
        // Snippet actions
        addSnippet: (snippetData) => {
          const snippet: CodeSnippet = {
            ...snippetData,
            id: Date.now().toString(),
            createdAt: new Date()
          };
          set(state => ({ 
            savedSnippets: [...state.savedSnippets, snippet] 
          }), false, 'addSnippet');
        },
        
        deleteSnippet: (id) => {
          set(state => ({
            savedSnippets: state.savedSnippets.filter(snippet => snippet.id !== id)
          }), false, 'deleteSnippet');
        },
        
        loadSnippet: (id) => {
          const state = get();
          const snippet = state.savedSnippets.find(s => s.id === id);
          if (snippet) {
            set({
              currentCode: snippet.code,
              currentLanguage: snippet.language
            }, false, 'loadSnippet');
          }
        },
        
        // Performance actions
        updatePerformanceMetrics: (metrics) => {
          set(state => ({
            performanceMetrics: { ...state.performanceMetrics, ...metrics }
          }), false, 'updatePerformanceMetrics');
        },
        
        // Error actions
        addError: (message, context) => {
          const error = {
            id: Date.now().toString(),
            message,
            context,
            timestamp: new Date()
          };
          set(state => ({
            errors: [...state.errors.slice(-9), error] // Keep only last 10 errors
          }), false, 'addError');
        },
        
        clearErrors: () => set({ errors: [] }, false, 'clearErrors'),
        
        // Utility actions
        reset: () => set(initialState, false, 'reset')
      }),
      {
        name: 'codesplinter-app-store',
        partialize: (state) => ({
          // Only persist certain parts of the state
          user: state.user,
          currentLanguage: state.currentLanguage,
          feedbackTabValue: state.feedbackTabValue,
          projects: state.projects,
          savedSnippets: state.savedSnippets
        })
      }
    ),
    {
      name: 'CodeSplinter App Store'
    }
  )
);

// Selectors for optimized component updates
export const useCurrentCode = () => useAppStore(state => state.currentCode);
export const useCurrentLanguage = () => useAppStore(state => state.currentLanguage);
export const useCurrentProject = () => useAppStore(state => state.currentProject);
export const useIsLoading = () => useAppStore(state => state.isLoading);
export const useProjects = () => useAppStore(state => state.projects);
export const useSavedSnippets = () => useAppStore(state => state.savedSnippets);
export const usePerformanceMetrics = () => useAppStore(state => state.performanceMetrics);
export const useErrors = () => useAppStore(state => state.errors);
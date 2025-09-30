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

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  code?: string;
  parentId?: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LayoutPreset {
  id: string;
  name: string;
  editorWidth: number;
  sidebarWidth: number;
  explorerWidth: number;
  editorHeight: number;
  consoleHeight: number;
  showExplorer: boolean;
  showSidebar: boolean;
}

// App State Interface
interface AppState {
  // User state
  user: User | null;
  
  // Current session
  currentCode: string;
  currentLanguage: string;
  currentProject: string | null;
  currentFile: string | null;
  roomId: string;
  userId: string;
  
  // UI state
  isLoading: boolean;
  feedbackTabValue: string;
  
  // Projects and snippets
  projects: Project[];
  savedSnippets: CodeSnippet[];
  
  // File management
  files: FileItem[];
  currentWorkspace: string;
  
  // Layout management
  layoutPresets: LayoutPreset[];
  currentLayoutPreset: string | null;
  layoutSettings: {
    editorWidth: number;
    sidebarWidth: number;
    explorerWidth: number;
    editorHeight: number;
    consoleHeight: number;
    showExplorer: boolean;
    showSidebar: boolean;
  };
  
  // Multi-tab editor
  openTabs: string[];
  activeTabId: string | null;
  
  // Editor settings
  editorSettings: {
    autoSave: boolean;
    autoSaveDelay: number;
    showMinimap: boolean;
    enableCodeFolding: boolean;
    findReplaceVisible: boolean;
    enableIntelliSense: boolean;
    enableDebugger: boolean;
  };
  
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
  
  // Learning system
  learningProgress: Record<string, number>;
  currentLearningPath: any | null;
  userProfile: any | null;
  sharedCodes: any[];
  communityStats: {
    totalUsers: number;
    activeChallenges: number;
    codeShares: number;
  };
}

// Actions Interface  
interface AppActions {
  // User actions
  setUser: (user: User | null) => void;
  
  // Session actions
  setCurrentCode: (code: string) => void;
  setCurrentLanguage: (language: string) => void;
  setCurrentProject: (project: string | null) => void;
  setCurrentFile: (file: string | null) => void;
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
  
  // File management actions
  addFile: (file: Omit<FileItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFile: (id: string, updates: Partial<FileItem>) => void;
  deleteFile: (id: string) => void;
  createFolder: (name: string, parentId?: string) => void;
  renameFile: (id: string, newName: string) => void;
  moveFile: (id: string, newParentId?: string) => void;
  setCurrentWorkspace: (workspace: string) => void;
  
  // Layout management actions
  updateLayoutSettings: (settings: Partial<AppState['layoutSettings']>) => void;
  addLayoutPreset: (preset: Omit<LayoutPreset, 'id'>) => void;
  deleteLayoutPreset: (id: string) => void;
  applyLayoutPreset: (id: string) => void;
  setCurrentLayoutPreset: (id: string | null) => void;
  
  // Editor settings actions
  updateEditorSettings: (settings: Partial<AppState['editorSettings']>) => void;
  
  // Performance actions
  updatePerformanceMetrics: (metrics: Partial<AppState['performanceMetrics']>) => void;
  
  // Error actions
  addError: (error: string, context?: string) => void;
  clearErrors: () => void;
  
  // Learning system actions
  setLearningProgress: (progress: Record<string, number>) => void;
  setCurrentLearningPath: (path: any) => void;
  setUserProfile: (profile: any) => void;
  addSharedCode: (code: any) => void;
  updateCommunityStats: (stats: any) => void;
  
  // Utility actions
  reset: () => void;
}

// Initial state
const initialState: AppState = {
  user: null,
  currentCode: '',
  currentLanguage: 'python',
  currentProject: null,
  currentFile: null,
  roomId: '',
  userId: '',
  isLoading: false,
  feedbackTabValue: 'guidance',
  projects: [],
  savedSnippets: [],
  files: [],
  currentWorkspace: 'default',
  openTabs: [],
  activeTabId: null,
  layoutPresets: [
    {
      id: 'default',
      name: 'Default',
      editorWidth: 60,
      sidebarWidth: 25,
      explorerWidth: 15,
      editorHeight: 60,
      consoleHeight: 40,
      showExplorer: true,
      showSidebar: true,
    },
    {
      id: 'focus',
      name: 'Focus Mode',
      editorWidth: 85,
      sidebarWidth: 15,
      explorerWidth: 0,
      editorHeight: 70,
      consoleHeight: 30,
      showExplorer: false,
      showSidebar: false,
    },
    {
      id: 'debug',
      name: 'Debug Mode',
      editorWidth: 50,
      sidebarWidth: 30,
      explorerWidth: 20,
      editorHeight: 50,
      consoleHeight: 50,
      showExplorer: true,
      showSidebar: true,
    }
  ],
  currentLayoutPreset: 'default',
  layoutSettings: {
    editorWidth: 60,
    sidebarWidth: 25,
    explorerWidth: 15,
    editorHeight: 60,
    consoleHeight: 40,
    showExplorer: true,
    showSidebar: true,
  },
  editorSettings: {
    autoSave: true,
    autoSaveDelay: 2000,
    showMinimap: true,
    enableCodeFolding: true,
    findReplaceVisible: false,
    enableIntelliSense: true,
    enableDebugger: true,
  },
  performanceMetrics: {
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0
  },
  errors: [],
  
  // Learning system initial state
  learningProgress: {},
  currentLearningPath: null,
  userProfile: null,
  sharedCodes: [],
  communityStats: {
    totalUsers: 1234,
    activeChallenges: 12,
    codeShares: 567
  }
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
        setCurrentFile: (currentFile) => set({ currentFile }, false, 'setCurrentFile'),
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
        
        // File management actions
        addFile: (fileData) => {
          const file = {
            ...fileData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
          };
          set(state => ({ files: [...state.files, file] }), false, 'addFile');
        },
        
        updateFile: (id, updates) => {
          set(state => ({
            files: state.files.map(file =>
              file.id === id ? { ...file, ...updates, updatedAt: new Date() } : file
            )
          }), false, 'updateFile');
        },
        
        deleteFile: (id) => {
          set(state => ({ files: state.files.filter(file => file.id !== id) }), false, 'deleteFile');
        },
        
        createFolder: (name, parentId) => {
          const folder = {
            id: Date.now().toString(),
            name,
            type: 'folder' as const,
            parentId,
            path: parentId ? `${parentId}/${name}` : name,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          set(state => ({ files: [...state.files, folder] }), false, 'createFolder');
        },
        
        renameFile: (id, newName) => {
          set(state => ({
            files: state.files.map(file =>
              file.id === id ? { ...file, name: newName, updatedAt: new Date() } : file
            )
          }), false, 'renameFile');
        },
        
        moveFile: (id, newParentId) => {
          set(state => ({
            files: state.files.map(file =>
              file.id === id ? { ...file, parentId: newParentId, updatedAt: new Date() } : file
            )
          }), false, 'moveFile');
        },
        
        setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }, false, 'setCurrentWorkspace'),
        
        // Layout management actions
        updateLayoutSettings: (settings) => {
          set(state => ({ layoutSettings: { ...state.layoutSettings, ...settings } }), false, 'updateLayoutSettings');
        },
        
        addLayoutPreset: (presetData) => {
          const preset = { ...presetData, id: Date.now().toString() };
          set(state => ({ layoutPresets: [...state.layoutPresets, preset] }), false, 'addLayoutPreset');
        },
        
        deleteLayoutPreset: (id) => {
          set(state => ({ layoutPresets: state.layoutPresets.filter(p => p.id !== id) }), false, 'deleteLayoutPreset');
        },
        
        applyLayoutPreset: (id) => {
          const state = get();
          const preset = state.layoutPresets.find(p => p.id === id);
          if (preset) {
            set({ layoutSettings: { ...preset } }, false, 'applyLayoutPreset');
          }
        },
        
        setCurrentLayoutPreset: (id) => set({ currentLayoutPreset: id }, false, 'setCurrentLayoutPreset'),
        
        // Editor settings actions
        updateEditorSettings: (settings) => {
          set(state => ({ editorSettings: { ...state.editorSettings, ...settings } }), false, 'updateEditorSettings');
        },
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
        
        // Learning system actions
        setLearningProgress: (progress) => set({ learningProgress: progress }, false, 'setLearningProgress'),
        setCurrentLearningPath: (path) => set({ currentLearningPath: path }, false, 'setCurrentLearningPath'),
        setUserProfile: (profile) => set({ userProfile: profile }, false, 'setUserProfile'),
        addSharedCode: (code) => set(state => ({ 
          sharedCodes: [...state.sharedCodes, code] 
        }), false, 'addSharedCode'),
        updateCommunityStats: (stats) => set({ communityStats: stats }, false, 'updateCommunityStats'),
        
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
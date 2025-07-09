import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Task, Phase, Project, Skill, DailyProgress } from '../types';
import { phases, sampleTasks, sampleProjects, sampleSkills } from '../data/roadmapData';

interface AppState {
  tasks: Task[];
  phases: Phase[];
  projects: Project[];
  skills: Skill[];
  dailyProgress: DailyProgress[];
  currentDate: string;
}

type Action =
  | { type: 'COMPLETE_TASK'; taskId: string; notes?: string }
  | { type: 'UNCOMPLETE_TASK'; taskId: string }
  | { type: 'UPDATE_PROJECT'; projectId: string; updates: Partial<Project> }
  | { type: 'UPDATE_SKILL'; skillId: string; updates: Partial<Skill> }
  | { type: 'ADD_DAILY_PROGRESS'; progress: DailyProgress }
  | { type: 'LOAD_DATA'; data: Partial<AppState> };

const initialState: AppState = {
  tasks: sampleTasks,
  phases: phases,
  projects: sampleProjects,
  skills: sampleSkills,
  dailyProgress: [],
  currentDate: new Date().toISOString().split('T')[0]
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.taskId
            ? { ...task, completed: true, completedDate: new Date(), notes: action.notes }
            : task
        ),
        phases: state.phases.map(phase => ({
          ...phase,
          completedTasks: state.tasks.filter(t => 
            t.phase === phase.id && (t.completed || t.id === action.taskId)
          ).length
        }))
      };

    case 'UNCOMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.taskId
            ? { ...task, completed: false, completedDate: undefined, notes: undefined }
            : task
        ),
        phases: state.phases.map(phase => ({
          ...phase,
          completedTasks: state.tasks.filter(t => 
            t.phase === phase.id && t.completed && t.id !== action.taskId
          ).length
        }))
      };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.projectId
            ? { ...project, ...action.updates }
            : project
        )
      };

    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map(skill =>
          skill.id === action.skillId
            ? { ...skill, ...action.updates }
            : skill
        )
      };

    case 'ADD_DAILY_PROGRESS':
      return {
        ...state,
        dailyProgress: [
          ...state.dailyProgress.filter(p => p.date !== action.progress.date),
          action.progress
        ].sort((a, b) => b.date.localeCompare(a.date))
      };

    case 'LOAD_DATA':
      return {
        ...state,
        ...action.data
      };

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  React.useEffect(() => {
    const savedData = localStorage.getItem('genai-roadmap-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', data: parsedData });
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage when state changes
  React.useEffect(() => {
    localStorage.setItem('genai-roadmap-data', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

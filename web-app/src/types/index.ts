// Types for the roadmap application
export interface Task {
  id: string;
  title: string;
  description: string;
  day: number;
  week: number;
  phase: number;
  category: 'study' | 'hands-on' | 'project' | 'review';
  estimatedHours: number;
  completed: boolean;
  completedDate?: Date;
  notes?: string;
  resources?: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'paper' | 'course' | 'documentation' | 'video' | 'book' | 'tool' | 'tutorial' | 'blog' | 'code' | 'demo' | 'workshop' | 'certification';
  url?: string;
  description?: string;
  estimatedTime?: number; // minutes
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  priority?: 'high' | 'medium' | 'low';
}

export interface Phase {
  id: number;
  title: string;
  description: string;
  weeks: number;
  totalTasks: number;
  completedTasks: number;
  startDate?: Date;
  endDate?: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  phase: number;
  status: 'not-started' | 'in-progress' | 'completed';
  githubUrl?: string;
  demoUrl?: string;
  technologies: string[];
  completedDate?: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'platform' | 'business';
  level: 1 | 2 | 3 | 4 | 5; // 1 = Beginner, 5 = Expert
  targetLevel: 1 | 2 | 3 | 4 | 5;
  relatedTasks: string[];
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD format
  tasksCompleted: number;
  hoursStudied: number;
  notes?: string;
  mood: 1 | 2 | 3 | 4 | 5; // 1 = Poor, 5 = Excellent
}

export interface CalendarEvent {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  url?: string;
}

export interface ExportOptions {
  selectedTasks: string[];
  startDate: Date;
  includeResources: boolean;
  reminderMinutes: number;
}

export interface LinkedInPost {
  id: string;
  title: string;
  content: string;
  hashtags: string[];
  category: 'learning' | 'achievement' | 'insight' | 'project' | 'tip' | 'industry';
  linkedResources?: string[];
  createdDate: Date;
  published: boolean;
  engagementScore?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  category: string;
  readingTime: number;
  publishDate?: Date;
  status: 'draft' | 'published' | 'scheduled';
  linkedTasks: string[];
  linkedProjects: string[];
}

export interface ContentCalendar {
  date: string;
  contentType: 'linkedin' | 'blog' | 'both';
  topic: string;
  status: 'planned' | 'drafted' | 'published';
  linkedPhase?: number;
}

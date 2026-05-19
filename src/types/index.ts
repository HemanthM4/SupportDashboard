export type TaskStatus = 'TO DO' | 'AI TASKS - DONE' | 'HUMAN NEEDED TO ASSESS' | 'IN REVIEW - AI NEEDED' | 'DONE';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  assignee: {
    id: string;
    name: string;
    email: string;
    initials: string;
  } | null;
  reporter: {
    name: string;
    initials: string;
  };
  priority: TaskPriority;
  status: TaskStatus;
  resolution: string;
  created: Date;
  updated: Date;
  dueDate: Date | null;
  description?: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  author: {
    name: string;
    initials: string;
  };
  text: string;
  timestamp: Date;
}

export type ViewType = 'list' | 'board';

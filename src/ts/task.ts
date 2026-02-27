export type SubTask = {
  title: string;
  location?: string;
  category?: string;
  assignedTo?: string;
  startDate?: string;
  dueDate?: string;
  status: string;
};

export type Task = {
  id: number;
  title: string;
  project: string;
  location: string;
  category: string;
  assignedTo: string;
  priority: string;
  startDate: string;
  dueDate: string;
  subtasks: SubTask[];
};
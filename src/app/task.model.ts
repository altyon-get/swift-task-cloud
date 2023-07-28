export interface Task {
    _id: number;
    title: string;
    description: string;
    dueDate: Date;
    priority: string; // 'low', 'medium', or 'high'
    status: string; // 'to-do', 'in-progress', or 'completed'
    history: any[]; // You can define a custom history object to track changes
}
  
// task.reducer.ts
import { createReducer, on, Action } from '@ngrx/store';
import { Task } from './task.model';
import { addTask, updateTask, deleteTask } from './task.actions';

export interface TaskState {
  tasks: Task[];
}

export const initialState: TaskState = {
  tasks: [] // Make sure the type of 'tasks' is 'Task[]'
};

const taskReducer = createReducer(
  initialState,
  on(addTask, (state, { task }) => ({ ...state, tasks: [...state.tasks, task] })),
  on(updateTask, (state, { id, task }) => ({
    ...state,
    tasks: state.tasks.map(item => item.id === id ? { ...task } : item)
  })),
  on(deleteTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(item => item.id !== id)
  }))
);

export function reducer(state: TaskState | undefined, action: Action) {
  return taskReducer(state, action);
}

// Helper function to get initial state from local storage
export function getInitialState(): TaskState {
  const savedState = localStorage.getItem('tasks');
  return savedState ? JSON.parse(savedState) : initialState;
}

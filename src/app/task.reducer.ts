// task.reducer.ts
import { createReducer, on, Action } from '@ngrx/store';
import { Task } from './task.model';
import { addTask, updateTask, deleteTask, incrementCoins, loadAllTasks, loadAllCoins, loadAllTasksAndCoins } from './task.actions';

export interface TaskState {
  tasks: Task[];
  coins:number;
}

export const initialState: TaskState = {
  tasks: [], // Make sure the type of 'tasks' is 'Task[]'
  coins : 0
};

const taskReducer = createReducer(
  initialState,
  
  on(addTask, (state, { task }) => {
    
    if (state.tasks && Symbol.iterator in Object(state.tasks)) {
      return { ...state, tasks: [...state.tasks, task] };
    } else {
   
      return { ...state, tasks: [task] };
    }
  }),
   on(updateTask, (state, { _id, task }) => ({
    ...state,
    tasks: state.tasks.map(item => item._id === _id ? { ...item, ...task } : item)
  })),  
  on(deleteTask, (state, { _id }) => ({
    ...state,
    tasks: state.tasks.filter(item => item._id !== _id)
  })),
  on(incrementCoins, (state, { amount }) => {

    if (typeof amount !== 'number' || isNaN(amount)) {
      amount = 10;
    }

    return {
      ...state,
      coins: state.coins + amount,
    };
  }),

  on(loadAllTasksAndCoins, (state, { tasks, coins }) => {
    // loading data from backend
    return { ...state, tasks: tasks, coins: coins };
  })
  

);

export function reducer(state: TaskState | undefined, action: Action) {
  return taskReducer(state, action);
}


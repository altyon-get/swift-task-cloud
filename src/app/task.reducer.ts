// task.reducer.ts
import { createReducer, on, Action } from '@ngrx/store';
import { Task } from './task.model';
import { addTask, updateTask, deleteTask, incrementCoins, loadAllTasks, loadAllCoins } from './task.actions';

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
    // Check if state.tasks is iterable (an array)
    if (state.tasks && Symbol.iterator in Object(state.tasks)) {
      return { ...state, tasks: [...state.tasks, task] };
    } else {
      // Create a new array and add the incoming task to it
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
    // Check if the 'amount' is a val_id number
    if (typeof amount !== 'number' || isNaN(amount)) {
      // If 'amount' is not a number or NaN, assign 10 as the default value
      amount = 10;
    }
  
    // Perform the increment operation
    return {
      ...state,
      coins: state.coins + amount,
    };
  }),

  on(loadAllTasks, (state, { tasks }) => {
    // Replace the existing tasks with the new tasks from the action payload
    return { ...state, tasks: tasks };
  }),
  
  on(loadAllCoins, (state, { coins }) => {
    // Replace the existing tasks with the new tasks from the action payload
    return { ...state, coins: coins };
  })
  

);

export function reducer(state: TaskState | undefined, action: Action) {
  return taskReducer(state, action);
}

// Helper function to get initial state from local storage
// export function getInitialState(): TaskState {
//   const savedState = localStorage.getItem('tasks');
//   return savedState ? JSON.parse(savedState) : initialState;
// }

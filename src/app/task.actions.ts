import { createAction, props } from '@ngrx/store';
import { Task } from './task.model';

export const addTask = createAction('[Task] Add Task', props<{ task: Task }>());
export const updateTask = createAction('[Task] Update Task', props<{ _id: number, task: Task }>());
export const deleteTask = createAction('[Task] Delete Task', props<{ _id: number }>());
export const incrementCoins = createAction('[Task] Increment Coins', props<{ amount: number }>());
export const loadAllTasks = createAction('[Task] Load All Tasks', props<{ tasks: Task[] }>());
export const loadAllCoins = createAction('[Task] Load All Tasks', props<{ coins: number }>());


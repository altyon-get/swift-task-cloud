import { createAction, props } from '@ngrx/store';
import { Task } from './task.model';

export const addTask = createAction('[Task] Add Task', props<{ task: Task }>());
export const updateTask = createAction('[Task] Update Task', props<{ id: number, task: Task }>());
export const deleteTask = createAction('[Task] Delete Task', props<{ id: number }>());

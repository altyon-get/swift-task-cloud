import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TaskState } from './task.reducer';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectTasks = createSelector(
  selectTaskState,
  (state: TaskState) => state.tasks
);

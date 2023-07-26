import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Task } from './task.model';
import { addTask, updateTask, deleteTask } from './task.actions';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private currentId = 1;

  constructor(private store: Store) { }

  addTaskToStore(task: Task): void {
    task.id = this.currentId++;
    this.store.dispatch(addTask({ task }));
  }

  updateTaskInStore(id: number, task: Task): void {
    this.store.dispatch(updateTask({ id, task }));
  }

  deleteTaskFromStore(id: number): void {
    this.store.dispatch(deleteTask({ id }));
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Task } from '../task.model';
import { TaskService } from '../task.service';
import { selectTasks } from '../task.selectors';

@Component({
  selector: 'app-display-task',
  template: `
    <h2>Task List</h2>
    <ul>
      <li *ngFor="let task of tasks$ | async">
        <strong>{{ task.title }}</strong> - {{ task.description }} ({{ task.priority }} - {{ task.status }})
        <br>Due Date: {{ task.dueDate | date }}
        <br>
        <button (click)="onUpdateTask(task)">Update</button>
        <button (click)="onDeleteTask(task.id)">Delete</button>
      </li>
    </ul>
  `
})
export class DisplayTaskComponent implements OnInit {
  tasks$: Observable<Task[]> | undefined;

  constructor(private store: Store<{ tasks: Task[] }>, private taskService: TaskService) { }

  ngOnInit(): void {
    this.tasks$ = this.store.pipe(select(selectTasks));
  }

  onUpdateTask(task: Task): void {
    // Implement logic to open a dialog or navigate to the update task page
    // For simplicity, we will just log the task to update for now
    console.log('Update task:', task);
  }

  onDeleteTask(id: number): void {
    // Implement logic to confirm deletion and delete task from the store
    // For simplicity, we will just delete the task directly for now
    this.taskService.deleteTaskFromStore(id);
  }
}

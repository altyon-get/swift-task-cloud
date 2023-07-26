import { Component } from '@angular/core';
import { Task } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-add-task',
  template: `
    <h2>Add Task</h2>
    <form (submit)="onFormSubmit()">
      <input type="text" [(ngModel)]="newTask.title" name="title" placeholder="Task Title" required>
      <input type="text" [(ngModel)]="newTask.description" name="description" placeholder="Task Description" required>
      <input type="date" [(ngModel)]="newTask.dueDate" name="dueDate" required>
      <select [(ngModel)]="newTask.priority" name="priority" required>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select [(ngModel)]="newTask.status" name="status" required>
        <option value="to-do">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  `
})
export class AddTaskComponent {
  newTask: Task = {
    id: 0,
    title: '',
    description: '',
    dueDate: new Date(),
    priority: 'low',
    status: 'to-do',
    history: []
  };

  constructor(private taskService: TaskService) { }

  onFormSubmit(): void {
    this.taskService.addTaskToStore({ ...this.newTask });
    this.clearForm();
  }

  clearForm(): void {
    this.newTask = {
      id: 0,
      title: '',
      description: '',
      dueDate: new Date(),
      priority: 'low',
      status: 'to-do',
      history: []
    };
  }
}

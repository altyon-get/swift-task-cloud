import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../task.model';

import { TaskService } from '../task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { selectTasks } from '../task.selectors';
import { Store, select } from '@ngrx/store';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import { addTask, updateTask } from '../task.actions';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css'],
  animations: [
    trigger('toggleAddTaskForm', [
      state(
        'visible',
        style({ opacity: 1, transform: 'scale(1) translateY(0%)' })
      ),
      state(
        'hidden',
        style({ opacity: 0, transform: 'scale(0.8) translateY(-0%)' })
      ),
      transition('visible <=> hidden', animate('300ms')),
    ]),
  ],
})
export class AddTaskDialogComponent {
  taskForm!: FormGroup;
  isEditing = false;
  editTaskId!: number;
  tasks$: Observable<Task[]> | undefined;
  tasks: Task[] = [];
  newTask: Task = {
    _id: 0,
    title: '',
    description: '',
    dueDate: new Date(),
    priority: 'low',
    status: 'to-do',
    history: [{ date: new Date(), description: 'Created' }],
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { task: Task; isEdit: boolean },
    private dialogRef: MatDialogRef<AddTaskDialogComponent>,
    private formBuilder: FormBuilder,
    private store: Store<{ tasks: Task[] }>,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['low', Validators.required],
    });

    this.tasks$ = this.store.pipe(select(selectTasks));
    this.tasks$.subscribe((tasks) => {
      this.tasks = tasks || [];
    });
    this.isEditing = this.data.isEdit;
    if (this.data.task) {
      // Patch the form values with the data from the task (if available)
      this.taskForm.patchValue(this.data.task);
      this.editTaskId = this.data.task._id;
    }
    // console.log(this.newTask, this.isEditing);
  }

  updateHistory(task: Task, description: string) {
    const newHistory = task.history ? [...task.history] : [];
    newHistory.push({ date: this.formatDate(new Date()), description });
    const updatedTask: Task = { ...task, history: newHistory };
    // console.log('update', task);
    // this.taskService.updateTaskInStore(task.id, updatedTask);

    this.taskService
      .updateTaskInStore(task._id, updatedTask)
      .subscribe((response) => {
        // If the backend update is successful, dispatch the updateTask action
        this.store.dispatch(updateTask({ _id: task._id, task: updatedTask }));
      });
  }

  onFormSubmit(): void {
    if (this.isEditing) {
      // Get the updated task data from the form
      const updatedTask: Task = this.taskForm.value;
      updatedTask._id = this.data.task._id;
      updatedTask.history = this.data.task.history;
      this.updateHistory(updatedTask, 'Edited');
      // console.log(updatedTask);
      this.clearForm();
      this.closeDialog();
    } else {
      if (this.taskForm.valid) {
        const newTask: Task = this.taskForm.value;
        newTask.status = 'to-do';
        newTask.history = [
          { date: this.formatDate(new Date()), description: 'Created' },
        ];
        this.taskService.addTaskToStore({ ...newTask }).subscribe(
          (response: Task) => {
            // console.log('Task added successfully:', response);
            // Optionally, you can update your local tasks array with the newly added task.
            this.store.dispatch(addTask({ task: response }));
          },
          (error) => {
            console.error('Error adding task:', error);
            // Handle the error, show a toast message, etc.
          }
        );
        this.clearForm();
      }
    }
  }
  clearForm(): void {
    this.newTask = {
      _id: 0,
      title: '',
      description: '',
      dueDate: new Date(),
      priority: 'low',
      status: 'to-do',
      history: [],
    };
    this.taskForm.setValue({
      title: this.newTask.title,
      description: this.newTask.description,
      dueDate: this.newTask.dueDate,
      priority: this.newTask.priority,
    });
  }

  private formatDate(date: Date | string): string {
    if (date instanceof Date) {
      const year = String(date.getFullYear());
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } else if (typeof date === 'string') {
      // In case 'date' is a string, parse it to a Date object
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        const year = String(parsedDate.getFullYear());
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const hours = String(parsedDate.getHours()).padStart(2, '0');
        const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      }
    }

    // Return an empty string if 'date' is not valid
    return '';
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}

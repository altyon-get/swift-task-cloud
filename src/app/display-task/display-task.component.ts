import { Task } from './../task.model';
import {
  updateTask,
  addTask,
  deleteTask,
  loadAllTasks,
  incrementCoins,
  loadAllCoins,
  loadAllTasksAndCoins,
} from './../task.actions';
import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, forkJoin } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { TaskService } from '../task.service';
import { selectCoins, selectTasks } from '../task.selectors';
import { DisplayTaskDetailsComponent } from '../display-task-details/display-task-details.component';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import * as Papa from 'papaparse'; // Import papaparse
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';

@Component({
  selector: 'app-display-task',
  templateUrl: './display-task.component.html',
  styleUrls: ['./display-task.component.css'],
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
export class DisplayTaskComponent implements OnInit {
  tasks$: Observable<Task[]> | undefined;
  coins$: Observable<number> | undefined;
  tasks: Task[] = [];
  sortedTasks: Task[] = [];
  sortType: string = 'none';

  constructor(
    private store: Store<{ tasks: Task[] }>,
    private taskService: TaskService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.taskService.getAllTasksWithCoins().subscribe(
      (data ) => {
        const tasks = data.tasks;
        const coins = data.amount; // Extract the 'coins' property from the array
        // console.log('data:', data);
        // console.log('tasks:', tasks);
        // console.log('coins:', coins);
        // this.store.dispatch(loadAllTasks({ tasks }) | loadAllCoins({ coins }));
        this.store.dispatch(loadAllTasksAndCoins({ tasks, coins }));
        // console.log('Both actions dispatched successfully.');
        // const coins = coinsData.coins; // Extract the 'coins' property from the array
        // this.store.dispatch(loadAllTasks({ tasks }));
        // this.store.dispatch(loadAllCoins({ coins }));
        // console.log('tasks:', tasks);
        this.tasks$ = this.store.pipe(select(selectTasks));
        this.tasks$.subscribe((tasks) => {
          this.tasks = tasks || [];
          this.sortedTasks = tasks || []; // Update sortedTasks with the same data
          this.sortTasks();
        });
        // this.coins = coins; // Assign the coins value to the component property
      },
      (error) => {
        console.error('Error loading tasks:', error);
        // Handle the error, show a toast message, etc.
      }
    );
    
  }

  sortTasks() {
    switch (this.sortType) {
      case 'dueDate':
        this.sortedTasks = this.tasks.slice().sort((a, b) => {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case 'priority':
        const priorityOrder: { [key: string]: number } = {
          low: 3,
          medium: 2,
          high: 1,
        };
        this.sortedTasks = this.tasks.slice().sort((a, b) => {
          return (
            priorityOrder[a.priority as keyof typeof priorityOrder] -
            priorityOrder[b.priority as keyof typeof priorityOrder]
          );
        });
        break;
      case 'status':
        const statusOrder: { [key: string]: number } = {
          'to-do': 1,
          'in-progress': 2,
          completed: 3,
        };
        this.sortedTasks = this.tasks.slice().sort((a, b) => {
          return (
            statusOrder[a.status as keyof typeof statusOrder] -
            statusOrder[b.status as keyof typeof statusOrder]
          );
        });
        break;
      default:
        this.sortedTasks = this.tasks.slice();
        break;
    }
  }

  onSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortType = target.value;
    this.sortTasks();
  }

  onDelete(task: Task) {
    // this.taskService.deleteTaskFromStore(task._id).subscribe(());
    this.taskService.deleteTaskFromStore(task._id).subscribe(
      (deletedTasks) => {
        // On successful update, dispatch an action to update the store
        // console.log(deletedTasks, 'xxx');
        this.store.dispatch(deleteTask({ _id: deletedTasks._id }));
      },
      (error) => {
        console.error('Error updating task:', error);
        // Handle the error, show a toast message, etc.
      }
    );
  }

  updateHistory(task: Task, description: string) {
    const newHistory = task.history ? [...task.history] : [];
    newHistory.push({ date: this.formatDate(new Date()), description });
    const updatedTask: Task = { ...task, history: newHistory };
    // this.taskService.updateTaskInStore(task.id, updatedTask);
    // Call the service to update the task
    this.taskService.updateTaskInStore(task._id, updatedTask).subscribe(
      (updatedTaskFromServer) => {
        // On successful update, dispatch an action to update the store
        this.store.dispatch(
          updateTask({ _id: task._id, task: updatedTaskFromServer })
        );
      },
      (error) => {
        console.error('Error updating task:', error);
        // Handle the error, show a toast message, etc.
      }
    );
  }

  onToDo(task: Task) {
    const updatedTask: Task = { ...task, status: 'to-do' };
    this.updateHistory(updatedTask, 'Status changed to to-do');
  }

  onInProgress(task: Task) {
    const updatedTask: Task = { ...task, status: 'in-progress' };
    this.updateHistory(updatedTask, 'Status changed to In Progress');
  }

  onComplete(task: Task) {
    const updatedTask: Task = { ...task, status: 'completed' };
    this.updateHistory(updatedTask, 'Status changed to Completed');

    const amount=this.store.pipe(select(selectCoins));
    let currCoin:number=0;;
    amount.subscribe(
      (x)=>{
        currCoin=x;
      }
    )
    this.taskService.incrementCoinsInStore(currCoin+10).subscribe(
      (updateCoin) => {
        // On successful update, dispatch an action to update the store
        // console.log('incrementing on complete',updateCoin);
        this.store.dispatch(incrementCoins({ amount: 10 }));
      },
      (error) => {
        console.error('Error updating coin:', error);
        // Handle the error, show a toast message, etc.
      }
    ); // Increment coins by 10 (you can use any desired amount)
   
  }

  onTaskSelected(task: Task) {
    this.dialog.open(DisplayTaskDetailsComponent, {
      data: task,
      width: '500px',
    });
  }
  onAddTaskSelected() {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      data: { isEdit: false },
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.sortTasks();
    });
  }
  onEditTaskSelected(task: Task) {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      data: { task: task, isEdit: true },
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.sortTasks();
    });
  }
  exportToCSV(): void {
    // Clone the tasks array to avoid modifying the original data
    const tasksCopy: any[] = this.tasks.map((task) => ({
      ...task,
      dueDate: this.formatDate(task.dueDate),
      history: task.history
        ?.map((historyEntry: any) => {
          const formattedDate = this.formatDate(historyEntry.date);
          return `${formattedDate} - ${historyEntry.description}`;
        })
        .join(', '), // Convert the array to a single string
    }));
    // console.log(tasksCopy);

    const csvData = Papa.unparse(tasksCopy, { header: true });
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Create a temporary anchor element to initiate the download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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

  // updateTask(task:Task){
  //   console.log('task');
  // }
}

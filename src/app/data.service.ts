// data.service.ts

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Task } from './task.model';
import { loadAllTasks, loadAllCoins } from './task.actions';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private store: Store<{ tasks: Task[]; coins: number }>, private taskService: TaskService) {}

  loadDataFromBackend(): void {
    console.log('loading data');
    // Load tasks
    this.taskService.getAllTasks().subscribe(
        (tasks: Task[]) => {
            this.store.dispatch(loadAllTasks({ tasks }));
            console.log('task',tasks);
        },
        (error) => {
            console.error('Error loading tasks:', error);
            // Handle the error, show a toast message, etc.
        }
        );
        
        // Load coins
        this.taskService.getCurrentCoins().subscribe(
            (response: { coins: number }) => {
                const coins = response.coins;
                console.log('coins',coins);
                this.store.dispatch(loadAllCoins({ coins }));
      },
      (error) => {
        console.error('Error loading coins:', error);
        // Handle the error, show a toast message, etc.
      }
    );
  }
}

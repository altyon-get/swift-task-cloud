import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { TaskState } from './task.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `
})
export class AppComponent implements OnDestroy {
  private storeSubscription: Subscription;

  constructor(private store: Store<TaskState>) {
    this.storeSubscription = this.store.subscribe(state => {
      localStorage.setItem('tasks', JSON.stringify(state)); // Save tasks to local storage
    });
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }
}

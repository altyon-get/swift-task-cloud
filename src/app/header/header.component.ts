import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCoins } from '../task.selectors';
import { loadAllCoins } from '../task.actions';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  page = 'home';
  title = 'Swift Task';
  subtitle = 'Get Your Work Done';
  coins$: Observable<number> | undefined;
  coins: number = 0;
  constructor(private store: Store, private taskService: TaskService) {}

  ngOnInit() {
    this.coins$ = this.store.select(selectCoins);
    // Load coins
    this.taskService.getCurrentCoins().subscribe(
      (response: { coins: number }) => {
        const coins = response.coins;
        console.log('coins', coins);
        this.store.dispatch(loadAllCoins({ coins }));

        this.coins$ = this.store.select(selectCoins);
        this.coins$.subscribe((coins) => {
          console.log(coins,' -XXX')
          if(coins) this.coins = coins;
        });
      },
      (error) => {
        console.error('Error loading coins:', error);
        // Handle the error, show a toast message, etc.
      }
    );
  }

  switchPage() {
    if (this.page == 'home') this.page = 'rewards';
    else this.page = 'home';
  }
}

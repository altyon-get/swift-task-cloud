// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule, INITIAL_STATE } from '@ngrx/store'; // Import INITIAL_STATE
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DisplayTaskComponent } from './display-task/display-task.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { reducer, getInitialState } from './task.reducer'; // Import getInitialState

@NgModule({
  declarations: [
    AppComponent,
    DisplayTaskComponent,
    AddTaskComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot({ tasks: reducer }),
  ],
  providers: [
    {
      provide: INITIAL_STATE,
      useFactory: getInitialState // Set the initial state for the 'tasks' property
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

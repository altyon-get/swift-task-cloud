// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule, INITIAL_STATE } from '@ngrx/store'; // Import INITIAL_STATE
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DisplayTaskComponent } from './display-task/display-task.component';
import { reducer, 
  // getInitialState
 } from './task.reducer';
import { MatDialogModule } from '@angular/material/dialog';
import { DisplayTaskDetailsComponent } from './display-task-details/display-task-details.component';
import { HomeComponent } from './home/home.component';
import { RewardsComponent } from './rewards/rewards.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { ReactiveFormsModule } from '@angular/forms';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule


const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rewards', component: RewardsComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    DisplayTaskComponent,
    DisplayTaskDetailsComponent,
    HomeComponent,
    RewardsComponent,
    HeaderComponent,
    FooterComponent,
    AddTaskDialogComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule, // Add BrowserAnimationsModule to imports
    StoreModule.forRoot({ tasks: reducer }),
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
    HttpClientModule
    
  ],
  // providers: [
  //   {
  //     provide: INITIAL_STATE,
  //     useFactory: getInitialState // Set the initial state for the 'tasks' property
  //   }
  // ],
  bootstrap: [AppComponent]
})
export class AppModule { }

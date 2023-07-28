// task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:8800/api/tasks';
  private coinsUrl = 'http://localhost:8800/api/coins'; // New URL for coins


  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<Task[]> {
    // console.log('getting all task');
    return this.http.get<Task[]>(this.apiUrl);
  }

  getCurrentCoins(): Observable<{ coins: number }> {
    return this.http.get<{ coins: number }>(this.coinsUrl);
  }
  
  addTaskToStore(task: Task): Observable<Task> {
    // console.log('adding task');
    return this.http.post<Task>(this.apiUrl, task);
  }
  
  updateTaskInStore(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTaskFromStore(id: number): Observable<Task> {
    return this.http.delete<Task>(`${this.apiUrl}/${id}`);
  }

  // New method to increment coins
  incrementCoinsInStore(amount: number): Observable<any> {
    return this.http.put(this.coinsUrl, { coins: amount });
  }

}

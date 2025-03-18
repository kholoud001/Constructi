import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.tasksApiUrl;

  constructor(private http: HttpClient) {}

  createTask(task: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, task);
  }

  getAllTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getTaskById(taskId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${taskId}`);
  }

  updateTask(taskId: number, task: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${taskId}`, task);
  }

  deleteTask(taskId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${taskId}`, { responseType: 'text' });
  }

  assignTaskToWorker(taskId: number, workerId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assign/${taskId}/${workerId}`, {});
  }

  getAssignedTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mytasks`);
  }

  getTaskWithInvoices(taskId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/invoice/${taskId}`);
  }

  // prolongTask(taskId: number, newEndDate: string): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/prolong/${taskId}`, null, {
  //     params: { newEndDate }
  //   });
  // }
}

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:8086/tasks';


  constructor(private http: HttpClient) {}

  getTaskDetails(taskId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${taskId}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubtaskService {
  private apiUrl = 'http://localhost:8086/subtasks';

  constructor(private http: HttpClient) {}

  createSubtask(subtask: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, subtask);
  }

  getAllSubtasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getSubtaskById(subtaskId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${subtaskId}`);
  }

  updateSubtask(subtaskId: number, subtask: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${subtaskId}`, subtask);
  }

  prolongSubtask(taskId: number, newEndDate: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/prolong/${taskId}`, null, {
      params: { newEndDate }
    });
  }

  deleteSubtask(subtaskId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${subtaskId}`, { responseType: 'text' });
  }

  getSubtasksByParentTaskId(parentTaskId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/parent/${parentTaskId}`);
  }

  approveSubtask(subtaskId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/approve/${subtaskId}`, {});
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = 'http://localhost:8086/projects';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getMyProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-projects`);
  }

  getMyProjectTasks(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/my-tasks`);
  }

  getProjectById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getProjectDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/details`);
  }

  getProjectProgress(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/progress`);
  }

  createProject(project: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, project);
  }

  updateProject(id: number, project: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, project);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }
}

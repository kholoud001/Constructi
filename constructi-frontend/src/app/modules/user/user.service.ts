import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from './user.model';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8086';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/admin/users/add`, user);
  }

  updateUser(id: number | undefined, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/admin/users/update/${id}`, user);
  }

  getRoles(): Observable<{ id: number, roleType: string }[]> {
    return this.http.get<{ id: number, roleType: string }[]>(`${this.apiUrl}/admin/roles`);
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/users/delete/${id}`,
      { responseType: 'text' as 'json' });
  }

}

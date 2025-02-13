import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8086/auth';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }


  register(userData: {
    firstName: string,
    lastName: string,
    cell: string,
    email: string,
    password: string,
    rateHourly: number,
    contratType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR'| 'FREELANCE'

  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData,
      { responseType: 'text' });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, password });
  }



}

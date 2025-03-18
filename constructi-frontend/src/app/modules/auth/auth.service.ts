import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import {Router} from '@angular/router';
import { AppStateService } from '../../shared/services/app-state.service';
import {environment} from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,
              private router: Router,
              private appStateService: AppStateService) {}


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);

      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        this.removeToken();
        return null;
      }

      return decodedToken;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }


      isAuthenticated(): boolean {
        return !!this.getToken();
      }


      login(email: string, password: string): Observable<any> {
        this.appStateService.setAuthenticated(true);
        return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
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
        return this.http.post(`${this.apiUrl}/admin/register`, userData,
          { responseType: 'text' });
      }

      forgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email },
          { responseType: 'text' });
      }

      resetPassword(token: string, newPassword: string, email: string): Observable<any> {
        const payload = {
          token: token,
          email: email,
          newPassword: newPassword
        };
        return this.http.post(`${this.apiUrl}/auth/reset-password`, payload,
          { responseType: 'text' });
      }

      logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/auth/login']);
        this.appStateService.setAuthenticated(false);

      }



      getUserName(): string | null {
        const decodedToken = this.getDecodedToken();
        return decodedToken ? decodedToken.sub : null;
      }

      getUserRole(): string | null {
        const decodedToken = this.getDecodedToken();
        return decodedToken ? decodedToken.role : null;
      }
}

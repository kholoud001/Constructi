import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../modules/auth/auth.service';
import { AppStateService } from '../services/app-state.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private appStateService: AppStateService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.appStateService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/auth/login']);
          return false;
        }

        const token = this.authService.getToken();
        const role = this.authService.getUserRole();
        console.log(token , role)

        if (!token || !role) {
          this.appStateService.setAuthenticated(false);
          this.router.navigate(['/auth/login']);
          return false;
        }

        const expectedRole = route.data['role'];
        if (expectedRole && expectedRole !== role) {
          this.router.navigate(['/unauthorized']);
          return false;
        }

        return true;
      })
    );
  }
}

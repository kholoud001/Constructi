import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {AppStateService} from '../services/app-state.service';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {AuthService} from '../../modules/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthReverseGuard implements CanActivate {
  constructor(
    private router: Router,
    private appStateService: AppStateService,
    private authService:AuthService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.appStateService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        console.log('AuthReverseGuard - Is Authenticated:', isAuthenticated);

        if (isAuthenticated) {
          const role = this.authService.getUserRole();
          console.log('Redirecting based on role:', role);

          let redirectPath = '/';
          switch (role) {
            case 'ADMIN':
              redirectPath = '/dashboard/admin';
              break;
            case 'ARCHITECT':
              redirectPath = '/dashboard/architect';
              break;
            case 'WORKER':
              redirectPath = '/dashboard/worker';
              break;
            default:
              redirectPath = '/';
          }

          console.log('Redirecting to:', redirectPath);
          this.router.navigate([redirectPath]);
          return false;
        }

        console.log('User is not authenticated, allowing access');
        return true;
      })
    );
  }
}

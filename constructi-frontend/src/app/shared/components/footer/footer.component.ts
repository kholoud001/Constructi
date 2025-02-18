import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../modules/auth/auth.service';
import {AppStateService} from '../../services/app-state.service';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  showCollaboration = false;
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private appStateService: AppStateService
  ) {}

  ngOnInit() {
    this.appStateService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        const role = this.authService.getUserRole();
        if (role != null) {
          this.showCollaboration = ['ADMIN', 'ARCHITECT', 'WORKER'].includes(role);
        }
      } else {
        this.showCollaboration = false;
      }
    });
  }



}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  faLock,
  faShieldHalved,
  faCircleExclamation,
  faHome,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-unauthorized',
  standalone: false,
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {
  faLock = faLock;
  faShieldHalved = faShieldHalved;
  faCircleExclamation = faCircleExclamation;
  faHome = faHome;
  faArrowLeft = faArrowLeft;

  constructor(private router: Router) {}

  goBack(): void {
    window.history.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}

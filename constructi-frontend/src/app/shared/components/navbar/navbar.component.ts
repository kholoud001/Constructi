import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { faBars, faUser, faSignOutAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../modules/auth/auth.service';
import { Router } from '@angular/router';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  faBars = faBars;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  faChevronDown = faChevronDown;
  isMobileMenuOpen = false;
  isProfileDropdownOpen = false;
  navItems: { name: string; href: string; current: boolean }[] = [];
  userName: string | null = '';
  userRole: string | null = '';

  @ViewChild('profileDropdown') profileDropdown!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private appStateService: AppStateService
  ) {}

  ngOnInit() {
    this.appStateService.isAuthenticated$.subscribe(
      isAuthenticated => {
        if (isAuthenticated) {
          this.setNavItems();
          this.setUserInfo();
        }
      }
    );
  }

  setNavItems() {
    const role = this.authService.getUserRole();
    this.navItems = [
      {name: 'Tableau de bord', href: '/dashboard', current: true},
      {name: 'Projets', href: '/projects', current: false},
      {name: 'Tâches', href: '/tasks', current: false},
    ];

    if (role === 'ADMIN' || role === 'ARCHITECT') {
      this.navItems.push(
        {name: 'Gestion des équipes', href: '/team-management', current: false},
        {name: 'Rapports', href: '/reports', current: false}
      );
    }

    if (role === 'ADMIN') {
      this.navItems.push(
        {name: 'Gestion des acteurs', href: '/actor-management', current: false},
        {name: 'Gestion des ressources', href: '/admin/users', current: false},
        {name: 'Gestion des stocks', href: '/inventory', current: false}
      );
    }
  }

  setUserInfo() {
    this.userName = this.authService.getUserName();
    this.userRole = this.authService.getUserRole();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.profileDropdown.nativeElement.contains(event.target)) {
      this.isProfileDropdownOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

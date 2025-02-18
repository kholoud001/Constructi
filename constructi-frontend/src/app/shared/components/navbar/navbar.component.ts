import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
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
export class NavbarComponent implements OnInit, AfterViewInit {
  faBars = faBars;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  faChevronDown = faChevronDown;
  isMobileMenuOpen = false;
  isProfileDropdownOpen = false;
  navItems: { name: string; href: string; current: boolean }[] = [];
  userName: string | null = '';
  userRole: string | null = '';
  isAuthenticated = false;

  @ViewChild('profileDropdown') profileDropdown!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private appStateService: AppStateService
  ) {}

  ngOnInit() {
    this.appStateService.isAuthenticated$.subscribe(
      isAuth => {
        this.isAuthenticated = isAuth;

        if (isAuth) {
          this.setNavItems();
          this.setUserInfo();
        }
      }
    );
  }

  ngAfterViewInit() {
    // Ensure the view is fully initialized before adding the click listener
    setTimeout(() => {
      this.addClickOutsideListener();
    });
  }

  setNavItems() {
    const role = this.authService.getUserRole();

    if (!role) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.navItems = [
      {name: 'Tableau de bord', href: `/dashboard/${role.toLowerCase()}`, current: true},
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

  addClickOutsideListener() {
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  handleClickOutside(event: Event) {
    if (this.profileDropdown && !this.profileDropdown.nativeElement.contains(event.target)) {
      this.isProfileDropdownOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy() {
    // Remove the click listener when the component is destroyed
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }
}

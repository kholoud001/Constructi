import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { faBars, faUser, faSignOutAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../modules/auth/auth.service';
import { Router } from '@angular/router';
import { AppStateService } from '../../services/app-state.service';

interface NavItem {
  name: string;
  href: string;
  current: boolean;
  isDropdown?: boolean;
}

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
  isProjectsDropdownOpen = false;
  navItems: NavItem[] = [];
  userName: string | null = '';
  userRole: string | null = '';
  isAuthenticated = false;
  isMobileProjectsDropdownOpen = false;

  @ViewChild('profileDropdown') profileDropdown!: ElementRef;
  @ViewChild('projectsDropdown') projectsDropdown!: ElementRef;

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
    ];

    if (role === 'WORKER' || role === 'ARCHITECT'){
      this.navItems.push(
        {name: 'Mes Projets', href: '/projects/my-projects', current: false},
        {name: 'Mes Tâches', href: '/tasks/my-tasks', current: false},
      );
    }

      if (role === 'ADMIN' || role === 'ARCHITECT') {
      this.navItems.push(
        {name: 'Gestion des équipes', href: '/team-management', current: false},
        {name: 'Rapports', href: '/reports', current: false}
      );
    }

    if (role === 'ADMIN') {
      this.navItems.push(
        {name: 'Tâches', href: '/tasks', current: false},
        {name: 'Gestion des projets', href: '#', current: false, isDropdown: true},
        {name: 'Gestion des ressources', href: '/admin/users', current: false},
      );
    }
  }
  get isGestionProjetsAvailable(): boolean {
    return this.navItems.some(item => item.name === 'Gestion des projets');
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

  toggleProjectsDropdown() {
    this.isProjectsDropdownOpen = !this.isProjectsDropdownOpen;
  }

  addClickOutsideListener() {
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  handleClickOutside(event: Event) {
    if (this.profileDropdown && !this.profileDropdown.nativeElement.contains(event.target) &&
      this.projectsDropdown && !this.projectsDropdown.nativeElement.contains(event.target)) {
      this.isProfileDropdownOpen = false;
      this.isProjectsDropdownOpen = false;
    }
  }

  toggleMobileProjectsDropdown() {
    this.isMobileProjectsDropdownOpen = !this.isMobileProjectsDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close projects dropdown if clicking outside
    if (this.projectsDropdown && !this.projectsDropdown.nativeElement.contains(event.target)) {
      this.isProjectsDropdownOpen = false;
    }

    // Close profile dropdown if clicking outside
    if (this.profileDropdown && !this.profileDropdown.nativeElement.contains(event.target)) {
      this.isProfileDropdownOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }
}

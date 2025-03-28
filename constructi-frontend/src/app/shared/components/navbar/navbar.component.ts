import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { faBars, faUser, faSignOutAlt, faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../modules/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
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
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  faBars = faBars;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  faChevronDown = faChevronDown;
  faTimes = faTimes; // Add close icon
  isMobileMenuOpen = false;
  isProfileDropdownOpen = false;
  isProjectsDropdownOpen = false;
  navItems: NavItem[] = [];
  userName: string | null = '';
  userRole: string | null = '';
  isAuthenticated = false;
  isMobileProjectsDropdownOpen = false;
  isResourcesDropdownOpen = false;
  isMobileResourcesDropdownOpen = false;

  @ViewChild('resourcesDropdown') resourcesDropdown!: ElementRef;
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
          this.updateCurrentNavItem();
        }
      }
    );

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateCurrentNavItem();
      }
    });
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
      { name: 'Tableau de bord', href: `/dashboard/${role.toLowerCase()}`, current: false },
    ];

    if (role === 'WORKER' || role === 'ARCHITECT') {
      this.navItems.push(
        { name: 'Mes Projets', href: '/projects/my-projects', current: false },
      );
    }

    if (role === 'ADMIN') {
      this.navItems.push(
        { name: 'Gestion des Tâches', href: '/tasks', current: false },
        { name: 'Gestion des projets', href: '#', current: false, isDropdown: true },
        { name: 'Gestion des ressources', href: '#', current: false, isDropdown: true },
      );
    }
  }

  updateCurrentNavItem() {
    const currentRoute = this.router.url;
    this.navItems.forEach(item => {
      item.current = currentRoute.startsWith(item.href);
    });
  }

  setUserInfo() {
    this.userName = this.authService.getUserName();
    this.userRole = this.authService.getUserRole();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log('Mobile Menu Open:', this.isMobileMenuOpen);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false; // Close mobile menu
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  toggleProjectsDropdown() {
    this.isProjectsDropdownOpen = !this.isProjectsDropdownOpen;
  }

  toggleResourcesDropdown() {
    this.isResourcesDropdownOpen = !this.isResourcesDropdownOpen;
  }

  addClickOutsideListener() {
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  handleClickOutside(event: Event) {
    if (this.profileDropdown && !this.profileDropdown.nativeElement.contains(event.target) &&
      this.projectsDropdown && !this.projectsDropdown.nativeElement.contains(event.target) &&
      this.resourcesDropdown && !this.resourcesDropdown.nativeElement.contains(event.target)) {
      this.isProfileDropdownOpen = false;
      this.isProjectsDropdownOpen = false;
      this.isResourcesDropdownOpen = false;
    }
  }

  toggleMobileProjectsDropdown() {
    this.isMobileProjectsDropdownOpen = !this.isMobileProjectsDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.projectsDropdown && !this.projectsDropdown.nativeElement.contains(event.target)) {
      this.isProjectsDropdownOpen = false;
    }
    if (this.profileDropdown && !this.profileDropdown.nativeElement.contains(event.target)) {
      this.isProfileDropdownOpen = false;
    }
    if (this.resourcesDropdown && !this.resourcesDropdown.nativeElement.contains(event.target)) {
      this.isResourcesDropdownOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  toggleMobileResourcesDropdown() {
    this.isMobileResourcesDropdownOpen = !this.isMobileResourcesDropdownOpen;
  }
}

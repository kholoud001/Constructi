import { Component, OnInit } from '@angular/core';
import {
  faChartLine,
  faClipboardCheck,
  faSignInAlt,
  faUserPlus,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import {AppStateService} from '../../services/app-state.service';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  protected readonly faUsers = faUsers;
  protected readonly faChartLine = faChartLine;
  protected readonly faClipboardCheck = faClipboardCheck;
  protected readonly faSignInAlt = faSignInAlt;
  protected readonly faUserPlus = faUserPlus;

  isAuthenticated: boolean = false;

  constructor(private appStateService: AppStateService) {}

  ngOnInit(): void {
    this.appStateService.isAuthenticated$.subscribe(
      isAuth => {
        this.isAuthenticated = isAuth;
      }
    );
  }
}

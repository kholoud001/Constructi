import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../modules/auth/auth.service';
import {faChartLine, faClipboardCheck, faSignInAlt, faUserPlus, faUsers} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  protected readonly faUsers = faUsers;
  protected readonly faChartLine = faChartLine;
  protected readonly faClipboardCheck = faClipboardCheck;
  protected readonly faSignInAlt = faSignInAlt;
  protected readonly faUserPlus = faUserPlus;
}

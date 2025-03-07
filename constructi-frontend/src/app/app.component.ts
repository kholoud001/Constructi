import {Component, OnInit} from '@angular/core';
import {AppStateService} from './shared/services/app-state.service';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  showNavbar = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !['/login'].some(path => event.url.includes(path));
      }
    });
  }
}

import { Component } from '@angular/core';
import { faProjectDiagram, faTasks, faUsers } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  faProjectDiagram = faProjectDiagram;
  faTasks = faTasks;
  faUsers = faUsers;

}

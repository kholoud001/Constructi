import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';
import { Router } from '@angular/router';
import {
  faBuilding,
  faCalendarAlt,
  faClock,
  faUsers,
  faToolbox,
  faSpinner,
  faTasks,
  faMoneyBill
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css'],
  standalone: false,

})
export class MyProjectsComponent implements OnInit {
  projects: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  userRole: string = 'WORKER';

  faBuilding = faBuilding;
  faCalendarAlt = faCalendarAlt;
  faClock = faClock;
  faUsers = faUsers;
  faToolbox = faToolbox;
  faSpinner = faSpinner;
  faTasks = faTasks;
  faMoneyBill = faMoneyBill;

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyProjects();
  }

  loadMyProjects(): void {
    this.loading = true;
    this.projectService.getMyProjects().subscribe({
      next: (data) => {
        console.log("My projects ", data)
        this.projects = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your projects';
        this.loading = false;
      }
    });
  }


  viewProject(id: number): void {
    this.router.navigate(['/projects', id, 'my-tasks']);
  }

  getStatusClass(state: string): string {
    switch (state?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_started':
        return 'bg-yellow-100 text-yellow-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  calculateProgress(project: any): number {
    if (project.initialBudget && project.actualBudget) {
      return (project.actualBudget / project.initialBudget) * 100;
    }
    return 0;
  }

  getStatusByProgress(progress: number): string {
    if (progress >= 100) {
      return 'FINISHED';
    } else if (progress >= 75) {
      return 'Almost Done';
    } else if (progress >= 50) {
      return 'IN_PROGRESS';
    } else if (progress >= 25) {
      return 'NOT_STARTED';
    } else {
      return 'NOT_STARTED';
    }
  }
}

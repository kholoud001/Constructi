import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCalendar, faChartLine, faClock, faDollarSign, faList, faTasks, faTools, faUserClock } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '@angular/common';
import {ProjectService} from '../project.service';

@Component({
  selector: 'app-my-project-detail',
  templateUrl: './my-project-detail.component.html',
  styleUrls: ['./my-project-detail.component.css']
})
export class MyProjectDetailComponent implements OnInit {
  projectId!: number;
  project: any;
  loading = true;
  error: string | null = null;

  faCalendar = faCalendar;
  faChartLine = faChartLine;
  faDollarSign = faDollarSign;
  faTasks = faTasks;
  faTools = faTools;
  faList = faList;
  faClock = faClock;
  faUserClock = faUserClock;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProject();
  }

  loadProject(): void {
    this.loading = true;
    this.projectService.getMyProjectTasks(this.projectId).subscribe({
      next: (data) => {
        this.project = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading project details';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'NOT_STARTED':
        return 'bg-gray-500';
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      case 'FINISHED':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  }

  formatDate(date: string): string {
    return formatDate(date, 'dd MMM yyyy', 'en-US');
  }

  calculateProgress(): number {
    if (!this.project?.tasks?.length) return 0;
    const finishedTasks = this.project.tasks.filter((task: any) => task.status === 'FINISHED').length;
    return (finishedTasks / this.project.tasks.length) * 100;
  }

  goBack(): void {
    this.router.navigate(['/projects/my-projects']);
  }


}

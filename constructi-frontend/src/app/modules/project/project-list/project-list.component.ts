import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];

  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe(
      (data) => {
        this.projects = data;
        console.log('Projects list:', this.projects);
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }


  viewProject(id: number): void {
    this.router.navigate(['/projects', id, 'details']);
  }
}

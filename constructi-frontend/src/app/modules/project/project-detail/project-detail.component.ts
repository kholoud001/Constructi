import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProjectService} from '../project.service';

@Component({
  selector: 'app-project-detail',
  standalone: false,
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit {
  project: any;

  constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProjectDetails(projectId);
  }

  loadProjectDetails(projectId: number): void {
    this.projectService.getProjectDetails(projectId).subscribe((data) => {
      this.project = data;
    });
  }
}

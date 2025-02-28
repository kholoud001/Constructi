import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {SubtaskService} from '../subtask.service';

@Component({
  selector: 'app-subtask-detail',
  templateUrl: './subtask-detail.component.html',
  styleUrls: ['./subtask-detail.component.css'],
  standalone:false
})
export class SubtaskDetailComponent implements OnInit {
  subtask: any;

  constructor(
    private route: ActivatedRoute,
    private subtaskService: SubtaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const subtaskId = this.route.snapshot.params['id'];
    this.subtaskService.getSubtaskById(subtaskId).subscribe((data) => {
      this.subtask = data;
    });
  }

  goBack(): void {
    this.router.navigate(['/subtasks/parent', this.subtask.parentTaskId]);
  }
}

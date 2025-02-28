import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {SubtaskService} from '../subtask.service';

@Component({
  selector: 'app-subtask-add',
  templateUrl: './subtask-add.component.html',
  styleUrls: ['./subtask-add.component.css'],
  standalone:false,
})
export class SubtaskAddComponent implements OnInit {
  subtask: any = {
    description: '',
    status: 'IN_PROGRESS',
    beginDate: '',
    dateEndEstimated: '',
    parentTaskId: null,
  };
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private subtaskService: SubtaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const subtaskId = this.route.snapshot.params['id'];
    this.subtask.parentTaskId = +this.route.snapshot.params['parentTaskId'];

    if (subtaskId) {
      this.isEditMode = true;
      this.subtaskService.getSubtaskById(subtaskId).subscribe((data) => {
        this.subtask = data;
      });
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.subtaskService.updateSubtask(this.subtask.id, this.subtask).subscribe(() => {
        this.router.navigate(['/subtasks/parent', this.subtask.parentTaskId]);
      });
    } else {
      this.subtaskService.createSubtask(this.subtask).subscribe(() => {
        this.router.navigate(['/subtasks/parent', this.subtask.parentTaskId]);
      });
    }
  }
}

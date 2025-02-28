import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {SubtaskService} from '../subtask.service';

@Component({
  selector: 'app-subtask-list',
  templateUrl: './subtask-list.component.html',
  styleUrls: ['./subtask-list.component.css'],
  standalone:false
})
export class SubtaskListComponent implements OnInit {
  subtasks: any[] = [];
  parentTaskId: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private subtaskService: SubtaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.parentTaskId = +this.route.snapshot.params['parentTaskId'];
    this.loadSubtasks();
  }

  loadSubtasks(): void {
    // this.subtaskService.getSubtasksByParentTaskId(this.parentTaskId).subscribe((data) => {
    //   this.subtasks = data;
    // });
  }

  viewSubtask(subtaskId: number): void {
    this.router.navigate(['/subtasks/detail', subtaskId]);
  }

  editSubtask(subtaskId: number): void {
    this.router.navigate(['/subtasks/edit', subtaskId]);
  }

  deleteSubtask(subtaskId: number): void {
    this.subtaskService.deleteSubtask(subtaskId).subscribe(() => {
      this.loadSubtasks();
    });
  }

  approveSubtask(subtaskId: number): void {
    this.subtaskService.approveSubtask(subtaskId).subscribe(() => {
      this.loadSubtasks();
    });
  }

  addSubtask(): void {
    this.router.navigate(['/subtasks/add', this.parentTaskId]);
  }
}

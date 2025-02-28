import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import {
  faChevronRight,
  faPlus,
  faPencil,
  faSpinner,
  faCheck,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import {ProjectService} from '../../project/project.service';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.css'],
})
export class TaskAddComponent implements OnInit {
  // Icons
  faChevronRight = faChevronRight;
  faPlus = faPlus;
  faPencil = faPencil;
  faSpinner = faSpinner;
  faCheck = faCheck;
  faChevronDown = faChevronDown;

  // Component state
  task: any = {
    description: '',
    status: '',
    beginDate: null,
    dateEndEstimated: null,
    effectiveTime: null, // Can be null
    budgetLimit: null,
    projectId: null,
  };
  projects: any[] = []; // Array to hold the list of projects
  isEditMode = false;
  isSubmitting = false;
  showSuccessToast = false;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private projectService: ProjectService, // Inject ProjectService
    private router: Router
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.params['id'];
    if (taskId) {
      this.isEditMode = true;
      this.loadTask(taskId);
    }
    this.loadProjects(); // Load the list of projects
  }

  loadTask(taskId: number): void {
    this.taskService.getTaskById(taskId).subscribe({
      next: (data) => {
        this.task = {
          ...data,
          beginDate: data.beginDate ? new Date(data.beginDate).toISOString().split('T')[0] : null,
          dateEndEstimated: data.dateEndEstimated ? new Date(data.dateEndEstimated).toISOString().split('T')[0] : null,
        };
      },
      error: (error) => {
        console.error('Error loading task:', error);
        // Handle error (show toast notification, redirect, etc.)
      },
    });
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        // Handle error (show toast notification, etc.)
      },
    });
  }

  onSubmit(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    const operation = this.isEditMode
      ? this.taskService.updateTask(this.task.id, this.task)
      : this.taskService.createTask(this.task);

    operation.subscribe({
      next: () => {
        this.showSuccessToast = true;
        setTimeout(() => {
          this.showSuccessToast = false;
          this.router.navigate(['/tasks']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error saving task:', error);
        this.isSubmitting = false;
        // Handle error (show toast notification, etc.)
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import {
  faChevronRight,
  faPlus,
  faPencil,
  faSpinner,
  faCheck,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.css'],
  standalone: false,
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
    priority: 'MEDIUM',
    dueDate: null
  };
  isEditMode = false;
  isSubmitting = false;
  showSuccessToast = false;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.params['id'];
    if (taskId) {
      this.isEditMode = true;
      this.loadTask(taskId);
    }
  }

  loadTask(taskId: number): void {
    this.taskService.getTaskById(taskId).subscribe({
      next: (data) => {
        this.task = {
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : null
        };
      },
      error: (error) => {
        console.error('Error loading task:', error);
        // Handle error (show toast notification, redirect, etc.)
      }
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
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../task.service';
import Swal from 'sweetalert2';
import {
  faListCheck,
  faPlus,
  faSpinner,
  faClipboardList,
  faEye,
  faPencil,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: false,
})
export class TaskListComponent implements OnInit {
  // Icons
  faListCheck = faListCheck;
  faPlus = faPlus;
  faSpinner = faSpinner;
  faClipboardList = faClipboardList;
  faEye = faEye;
  faPencil = faPencil;
  faTrash = faTrash;

  tasks: any[] = [];
  isLoading = true;

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading = false;
        this.showErrorAlert('Failed to load tasks', 'Please try again later.');
      }
    });
  }

  viewTask(taskId: number): void {
    this.router.navigate(['/tasks/detail', taskId]);
  }

  editTask(taskId: number): void {
    this.router.navigate(['/tasks/edit', taskId]);
  }

  confirmDelete(task: any): void {
    Swal.fire({
      title: 'Delete Task?',
      text: 'Are you sure you want to delete this task? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium text-white rounded-lg',
        cancelButton: 'px-4 py-2 text-sm font-medium rounded-lg'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteTask(task.id);
      }
    });
  }

  deleteTask(taskId: number): void {
    const loadingAlert = this.showLoadingAlert('Deleting task...');

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.showSuccessAlert('Task deleted successfully');
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.showErrorAlert('Failed to delete task', 'Please try again later.');
      }
    });
  }

  addTask(): void {
    this.router.navigate(['/tasks/add']);
  }

  private showLoadingAlert(message: string) {
    return Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl'
      }
    });
  }

  private showSuccessAlert(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      timer: 2000,
      showConfirmButton: false,
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl'
      }
    });
  }

  private showErrorAlert(title: string, message: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc2626',
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium text-white rounded-lg'
      }
    });
  }
}

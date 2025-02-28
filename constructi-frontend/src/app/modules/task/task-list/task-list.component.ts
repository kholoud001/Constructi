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
  faTrash,
  faChevronDown,
  faChevronUp,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import {SubtaskService} from '../../subtask/subtask.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: false,
})
export class TaskListComponent implements OnInit {
  faListCheck = faListCheck;
  faPlus = faPlus;
  faSpinner = faSpinner;
  faClipboardList = faClipboardList;
  faEye = faEye;
  faPencil = faPencil;
  faTrash = faTrash;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faCheckCircle = faCheckCircle;

  tasks: any[] = [];
  isLoading = true;

  constructor(
    private taskService: TaskService,
    private subtaskService: SubtaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data.map(task => ({
          ...task,
          showSubtasks: false,
          subtasks: [],
          subtasksLoading: false
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading = false;
        this.showErrorAlert('Failed to load tasks', 'Please try again later.');
      }
    });
  }

  toggleSubtasks(task: any): void {
    task.showSubtasks = !task.showSubtasks;
    if (task.showSubtasks && task.subtasks.length === 0) {
      this.loadSubtasks(task);
    }
  }

  loadSubtasks(task: any): void {
    task.subtasksLoading = true;
    this.subtaskService.getSubtasksByParentTaskId(task.id).subscribe({
      next: (data) => {
        task.subtasks = data;
        task.subtasksLoading = false;
      },
      error: (error) => {
        console.error('Error loading subtasks:', error);
        task.subtasksLoading = false;
        this.showErrorAlert('Failed to load subtasks', 'Please try again later.');
      }
    });
  }

  addSubtask(parentTaskId: number): void {
    this.router.navigate(['/subtasks/add', parentTaskId]);
  }

  confirmDeleteSubtask(subtask: any): void {
    Swal.fire({
      title: 'Delete Subtask?',
      text: 'Are you sure you want to delete this subtask? This action cannot be undone.',
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
        this.deleteSubtask(subtask);
      }
    });
  }

  deleteSubtask(subtask: any): void {
    this.subtaskService.deleteSubtask(subtask.id).subscribe({
      next: () => {
        this.showSuccessAlert('Subtask deleted successfully');
        this.loadSubtasks(subtask.parentTaskId);
      },
      error: (error) => {
        console.error('Error deleting subtask:', error);
        this.showErrorAlert('Failed to delete subtask', 'Please try again later.');
      }
    });
  }

  confirmApproveSubtask(subtask: any): void {
    Swal.fire({
      title: 'Approve Subtask?',
      text: 'Are you sure you want to approve this subtask?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium text-white rounded-lg',
        cancelButton: 'px-4 py-2 text-sm font-medium rounded-lg'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveSubtask(subtask);
      }
    });
  }

  approveSubtask(subtask: any): void {
    this.subtaskService.approveSubtask(subtask.id).subscribe({
      next: () => {
        this.showSuccessAlert('Subtask approved successfully');
        this.loadSubtasks(subtask.parentTaskId);
      },
      error: (error) => {
        console.error('Error approving subtask:', error);
        this.showErrorAlert('Failed to approve subtask', 'Please try again later.');
      }
    });
  }



  viewSubtask(subtaskId: number): void {
    this.router.navigate(['/subtasks/detail', subtaskId]);
  }

  editSubtask(subtaskId: number): void {
    this.router.navigate(['/subtasks/edit', subtaskId]);
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

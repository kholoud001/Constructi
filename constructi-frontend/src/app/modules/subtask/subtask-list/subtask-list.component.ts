import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubtaskService } from '../subtask.service';
import Swal from 'sweetalert2';
import {
  faListCheck,
  faPlus,
  faSpinner,
  faEye,
  faPencil,
  faTrash,
  faCheckCircle,
  faArrowLeft,
  faClipboardList,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

interface Subtask {
  id: number;
  description: string;
  status: string;
  approved: boolean;
  parentTaskId: number;
}

@Component({
  selector: 'app-subtask-list',
  templateUrl: './subtask-list.component.html',
  styleUrls: ['./subtask-list.component.css'],
  standalone: false
})
export class SubtaskListComponent implements OnInit {
  // Icons
  faListCheck = faListCheck;
  faPlus = faPlus;
  faSpinner = faSpinner;
  faEye = faEye;
  faPencil = faPencil;
  faTrash = faTrash;
  faCheckCircle = faCheckCircle;
  faArrowLeft = faArrowLeft;
  faClipboardList = faClipboardList;
  faTimesCircle = faTimesCircle;

  subtasks: Subtask[] = [];
  parentTaskId: number | undefined = undefined;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private subtaskService: SubtaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.parentTaskId = +this.route.snapshot.params['parentTaskId'];

    if (isNaN(this.parentTaskId)) {
      console.error('Invalid parentTaskId');
      this.showErrorAlert('Invalid Task ID', 'The parent task ID is invalid.');
      return;
    }
    this.loadSubtasks();
  }

  loadSubtasks(): void {
    if (this.parentTaskId === undefined) {
      console.warn("No parentTaskId provided, skipping API call.");
      return;
    }

    this.isLoading = true;
    this.subtaskService.getSubtasksByParentTaskId(this.parentTaskId).subscribe({
      next: (data) => {
        this.subtasks = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading subtasks", error);
        this.isLoading = false;
        this.showErrorAlert('Failed to load subtasks', 'Please try again later.');
      }
    });
  }

  viewSubtask(subtaskId: number): void {
    this.router.navigate(['/subtasks/detail', subtaskId]);
  }

  editSubtask(subtaskId: number): void {
    this.router.navigate(['/subtasks/edit', subtaskId]);
  }

  confirmDelete(subtask: Subtask): void {
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
        this.deleteSubtask(subtask.id);
      }
    });
  }

  deleteSubtask(subtaskId: number): void {
    const loadingAlert = this.showLoadingAlert('Deleting subtask...');

    this.subtaskService.deleteSubtask(subtaskId).subscribe({
      next: () => {
        Swal.close();
        this.showSuccessAlert('Subtask deleted successfully');
        this.loadSubtasks();
      },
      error: (error) => {
        Swal.close();
        console.error('Error deleting subtask:', error);
        this.showErrorAlert('Failed to delete subtask', 'Please try again later.');
      }
    });
  }

  confirmApprove(subtask: Subtask): void {
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
        this.approveSubtask(subtask.id);
      }
    });
  }

  approveSubtask(subtaskId: number): void {
    const loadingAlert = this.showLoadingAlert('Approving subtask...');

    this.subtaskService.approveSubtask(subtaskId).subscribe({
      next: () => {
        Swal.close();
        this.showSuccessAlert('Subtask approved successfully');
        this.loadSubtasks();
      },
      error: (error) => {
        Swal.close();
        console.error('Error approving subtask:', error);
        this.showErrorAlert('Failed to approve subtask', 'Please try again later.');
      }
    });
  }

  addSubtask(): void {
    this.router.navigate(['/subtasks/add', this.parentTaskId]);
  }

  goBack(): void {
    this.router.navigate(['/tasks/detail', this.parentTaskId]);
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

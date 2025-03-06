import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubtaskService } from '../subtask.service';
import Swal from 'sweetalert2';
import {
  faClipboardList,
  faCalendarDay,
  faCalendarCheck,
  faCheckCircle,
  faTimesCircle,
  faArrowLeft,
  faEdit,
  faTrash,
  faExclamationTriangle,
  faClock,
  faHourglass,
  faCheck,
  faBan
} from '@fortawesome/free-solid-svg-icons';

interface Subtask {
  id: number;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  beginDate: string;
  dateEndEstimated: string;
  approved: boolean;
  parentTaskId: number;
  originalDateEndEstimated?: string

}

@Component({
  selector: 'app-subtask-detail',
  templateUrl: './subtask-detail.component.html',
  styleUrls: ['./subtask-detail.component.css'],
  standalone: false
})
export class SubtaskDetailComponent implements OnInit {
  subtask: Subtask | null = null;
  loading = true;
  error: string | null = null;

  faClipboardList = faClipboardList;
  faCalendarDay = faCalendarDay;
  faCalendarCheck = faCalendarCheck;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faArrowLeft = faArrowLeft;
  faEdit = faEdit;
  faTrash = faTrash;
  faExclamationTriangle = faExclamationTriangle;
  faClock = faClock;


  constructor(
    private route: ActivatedRoute,
    private subtaskService: SubtaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSubtask();
  }

  loadSubtask(): void {
    const subtaskId = this.route.snapshot.params['id'];
    this.loading = true;
    this.error = null;

    this.subtaskService.getSubtaskById(subtaskId).subscribe({
      next: (data) => {
        this.subtask = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load subtask details. Please try again.';
        this.loading = false;
        console.error('Error loading subtask:', err);

        Swal.fire({
          title: 'Error!',
          text: 'Failed to load subtask details.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  goBack(): void {
    if (this.subtask) {
      this.router.navigate(['/subtasks/parent', this.subtask.parentTaskId]);
    } else {
      this.router.navigate(['/subtasks']);
    }
  }

  getStatusIcon(status: string): any {
    switch (status) {
      case 'PENDING':
        return faClock;
      case 'IN_PROGRESS':
        return faHourglass;
      case 'COMPLETED':
        return faCheck;
      case 'CANCELLED':
        return faBan;
      default:
        return faClock;
    }
  }

  approveSubtask(): void {
    if (!this.subtask) return;

    Swal.fire({
      title: 'Approve Subtask',
      text: 'Are you sure you want to approve this subtask?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.subtaskService.approveSubtask(this.subtask!.id).subscribe({
          next: (response) => {
            this.loading = false;
            this.subtask!.approved = true;

            Swal.fire({
              title: 'Approved!',
              text: 'The subtask has been approved successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            this.loading = false;
            console.error('Error approving subtask:', err);

            Swal.fire({
              title: 'Error!',
              text: 'Failed to approve the subtask.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  editSubtask(): void {
    if (!this.subtask) return;
    this.router.navigate(['/subtasks/edit', this.subtask.id]);
  }

  confirmDelete(): void {
    if (!this.subtask) return;

    Swal.fire({
      title: 'Delete Subtask',
      text: 'Are you sure you want to delete this subtask? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteSubtask();
      }
    });
  }

  deleteSubtask(): void {
    if (!this.subtask) return;

    this.loading = true;
    this.subtaskService.deleteSubtask(this.subtask.id).subscribe({
      next: (response) => {
        this.loading = false;

        Swal.fire({
          title: 'Deleted!',
          text: 'The subtask has been deleted successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        this.router.navigate(['/subtasks/parent', this.subtask!.parentTaskId]);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error deleting subtask:', err);

        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete the subtask.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}

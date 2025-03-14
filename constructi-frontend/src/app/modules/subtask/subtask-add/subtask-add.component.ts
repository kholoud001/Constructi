import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SubtaskService } from '../subtask.service';
import {
  faPlus,
  faEdit,
  faSave,
  faTimes,
  faFileAlt,
  faFlag,
  faCalendarDay,
  faCalendarCheck,
  faClock,
  faHourglass,
  faCheck,
  faBan,
  faExclamationTriangle,
  faPlayCircle
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

interface Subtask {
  id?: number;
  description: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'FINISHED';
  beginDate: string;
  dateEndEstimated: string;
  effectiveTime: number | null;
  parentTaskId: number | null;
}

@Component({
  selector: 'app-subtask-add',
  templateUrl: './subtask-add.component.html',
  styleUrls: ['./subtask-add.component.css'],
  standalone: false,
})
export class SubtaskAddComponent implements OnInit {
  @ViewChild('subtaskForm') subtaskForm!: NgForm;

  subtask: Subtask = {
    description: '',
    status: 'IN_PROGRESS',
    beginDate: '',
    dateEndEstimated: '',
    effectiveTime: null,
    parentTaskId: null,
  };

  isEditMode = false;
  isSubmitting = false;
  isLoading = false;

  faPlus = faPlus;
  faEdit = faEdit;
  faSave = faSave;
  faTimes = faTimes;
  faFileAlt = faFileAlt;
  faFlag = faFlag;
  faCalendarDay = faCalendarDay;
  faCalendarCheck = faCalendarCheck;
  faClock = faClock;
  faHourglass = faHourglass;
  faCheck = faCheck;
  faBan = faBan;
  faExclamationTriangle = faExclamationTriangle;
  faPlayCircle = faPlayCircle;

  constructor(
    private route: ActivatedRoute,
    private subtaskService: SubtaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const subtaskId = this.route.snapshot.params['id'];
    const parentTaskId = this.route.snapshot.params['parentTaskId'];

    if (parentTaskId) {
      this.subtask.parentTaskId = +parentTaskId;
    }

    if (subtaskId) {
      this.isEditMode = true;
      this.loadSubtask(subtaskId);
    } else {
      const today = new Date();
      this.subtask.beginDate = today.toISOString().split('T')[0];

      // Set default end date to 7 days from now
      const endDate = new Date();
      endDate.setDate(today.getDate() + 7);
      this.subtask.dateEndEstimated = endDate.toISOString().split('T')[0];
    }
  }

  loadSubtask(subtaskId: number): void {
    this.isLoading = true;

    this.subtaskService.getSubtaskById(subtaskId).subscribe({
      next: (data) => {
        this.subtask = {
          ...data,
          beginDate: data.beginDate ? new Date(data.beginDate).toISOString().split('T')[0] : null,
          dateEndEstimated: data.dateEndEstimated ? new Date(data.dateEndEstimated).toISOString().split('T')[0] : null,
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading subtask:', error);
        this.handleError(error, 'Failed to load subtask details.');
      },
    });
  }

  onSubmit(): void {
    if (this.subtaskForm.invalid) {
      Object.keys(this.subtaskForm.controls).forEach(key => {
        const control = this.subtaskForm.controls[key];
        control.markAsTouched();
      });

      Swal.fire({
        title: 'Formulaire Invalide',
        text: 'Veuillez remplir correctement tous les champs requis.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });

      return;
    }

    if (this.isSubmitting || this.isLoading) return;

    if (new Date(this.subtask.dateEndEstimated) < new Date(this.subtask.beginDate)) {
      Swal.fire({
        title: 'Dates Invalides',
        text: 'La date de fin estimée ne peut pas être antérieure à la date de début.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.isSubmitting = true;

    const loadingSwal = Swal.fire({
      title: this.isEditMode ? 'Mise à jour...' : 'Création...',
      text: 'Veuillez patienter pendant que nous enregistrons votre sous-tâche.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const operation = this.isEditMode
      ? this.subtaskService.updateSubtask(this.subtask.id!, this.subtask)
      : this.subtaskService.createSubtask(this.subtask);

    operation.subscribe({
      next: () => {
        Swal.close();

        Swal.fire({
          title: 'Success!',
          text: `Subtask ${this.isEditMode ? 'updated' : 'created'} successfully.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(['/subtasks/parent', this.subtask.parentTaskId]);
        });
      },
      error: (error) => {
        Swal.close();
        this.isSubmitting = false;
        this.handleError(error);
      },
    });
  }

  cancel(): void {
    if (this.subtask.parentTaskId) {
      this.router.navigate(['/subtasks/parent', this.subtask.parentTaskId]);
    } else {
      this.router.navigate(['/subtasks']);
    }
  }

  getStatusIcon(status: string): any {
    switch (status) {
      case 'NOT_STARTED':
        return faClock;
      case 'IN_PROGRESS':
        return faHourglass;
      case 'FINISHED':
        return faCheck;
      default:
        return faClock;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'NOT_STARTED':
        return 'Not Started';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'FINISHED':
        return 'Finished';
      default:
        return status;
    }
  }

  private handleError(error: any, defaultMessage: string = 'An unexpected error occurred. Please try again.'): void {
    let errorMessage = defaultMessage;

    if (error.error) {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (typeof error.error === 'object') {
        errorMessage = Object.values(error.error).join('\n');
      }
    }

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc2626',
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium text-white rounded-lg'
      }
    });

    console.error('Error:', error);
  }
}

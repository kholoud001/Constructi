import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubtaskService } from '../subtask.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subtask-add',
  templateUrl: './subtask-add.component.html',
  styleUrls: ['./subtask-add.component.css'],
  standalone: false,
})
export class SubtaskAddComponent implements OnInit {
  subtask: any = {
    description: '',
    status: 'IN_PROGRESS',
    beginDate: '',
    dateEndEstimated: '',
    effectiveTime: null,
    parentTaskId: null,
  };
  isEditMode = false;
  isSubmitting = false;

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
      this.loadSubtask(subtaskId);
    }
  }

  loadSubtask(subtaskId: number): void {
    this.subtaskService.getSubtaskById(subtaskId).subscribe({
      next: (data) => {
        this.subtask = {
          ...data,
          beginDate: data.beginDate ? new Date(data.beginDate).toISOString().split('T')[0] : null,
          dateEndEstimated: data.dateEndEstimated ? new Date(data.dateEndEstimated).toISOString().split('T')[0] : null,
        };
      },
      error: (error) => {
        console.error('Error loading subtask:', error);
        Swal.fire('Error', 'Failed to load subtask details.', 'error');
      },
    });
  }

  onSubmit(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    const operation = this.isEditMode
      ? this.subtaskService.updateSubtask(this.subtask.id, this.subtask)
      : this.subtaskService.createSubtask(this.subtask);

    operation.subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          text: 'Subtask saved successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(['/subtasks/parent', this.subtask.parentTaskId]);
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        this.handleError(error);
      },
    });
  }

  private handleError(error: any): void {
    let errorMessage = 'An unexpected error occurred. Please try again.';

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

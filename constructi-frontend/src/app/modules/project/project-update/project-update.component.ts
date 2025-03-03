import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import Swal from 'sweetalert2';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-project-update',
  templateUrl: './project-update.component.html',
  styleUrls: ['./project-update.component.css'],
  standalone: false,
})
export class ProjectUpdateComponent implements OnInit {
  projectForm!: FormGroup;
  projectId!: number;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.projectId = +this.route.snapshot.paramMap.get('id')!; // Get project ID from the route
    this.initForm();
    this.loadProject();
  }

  private initForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(255)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      state: ['', [Validators.required]],
      initialBudget: ['', [Validators.required, Validators.min(0.01)]],
    });
  }

  private loadProject(): void {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project) => {
        // Populate the form with the fetched project data
        this.projectForm.patchValue({
          name: project.name,
          description: project.description,
          startDate: project.startDate.split('T')[0], // Format date for input[type="date"]
          endDate: project.endDate.split('T')[0], // Format date for input[type="date"]
          state: project.state,
          initialBudget: project.initialBudget,
        });
      },
      error: (error) => {
        console.error('Error loading project:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load project details. Please try again.',
          confirmButtonColor: '#dc2626',
          heightAuto: false,
          customClass: {
            popup: 'rounded-xl',
            confirmButton: 'px-4 py-2 text-sm font-medium text-white rounded-lg',
          },
        }).then(() => {
          this.router.navigate(['/projects']);
        });
      },
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const projectData = this.projectForm.value;

      // Format dates to ISO string
      projectData.startDate = new Date(projectData.startDate).toISOString();
      projectData.endDate = new Date(projectData.endDate).toISOString();

      this.projectService.updateProject(this.projectId, projectData).subscribe({
        next: () => {
          this.isSubmitting = false;
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Project has been updated successfully.',
            confirmButtonColor: '#16a34a',
            heightAuto: false,
            customClass: {
              popup: 'rounded-xl',
              confirmButton: 'px-4 py-2 text-sm font-medium text-white rounded-lg',
            },
          }).then(() => {
            this.router.navigate(['/projects']);
          });
        },
        error: (error) => {
          this.isSubmitting = false;
          let errorMessage = 'Failed to update project. Please try again.';

          if (error.error?.message) {
            errorMessage = error.error.message;
          }

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonColor: '#dc2626',
            heightAuto: false,
            customClass: {
              popup: 'rounded-xl',
              confirmButton: 'px-4 py-2 text-sm font-medium text-white rounded-lg',
            },
          });
        },
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.projectForm.controls).forEach((key) => {
        const control = this.projectForm.get(key);
        control?.markAsTouched();
      });

      Swal.fire({
        icon: 'error',
        title: 'Form Invalid',
        text: 'Please check all required fields and try again.',
        confirmButtonColor: '#dc2626',
        heightAuto: false,
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'px-4 py-2 text-sm font-medium text-white rounded-lg',
        },
      });
    }
  }


  protected readonly faArrowLeft = faArrowLeft;
}

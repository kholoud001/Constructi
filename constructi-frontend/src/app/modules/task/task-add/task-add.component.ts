import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { ProjectService } from '../../project/project.service';
import {
  faChevronRight,
  faPlus,
  faPencil,
  faSpinner,
  faCheck,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.css'],
  standalone: false,

})
export class TaskAddComponent implements OnInit {
  faChevronRight = faChevronRight;
  faPlus = faPlus;
  faPencil = faPencil;
  faSpinner = faSpinner;
  faCheck = faCheck;
  faChevronDown = faChevronDown;

  task: any = {
    description: '',
    status: '',
    beginDate: null,
    dateEndEstimated: null,
    effectiveTime: null,
    budgetLimit: null,
    projectId: null,
  };
  projects: any[] = [];
  isEditMode = false;
  isSubmitting = false;
  showSuccessToast = false;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.params['id'];
    if (taskId) {
      this.isEditMode = true;
      this.loadTask(taskId);
    }
    this.loadProjects();
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
        Swal.fire('Error', 'Failed to load task details.', 'error');
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
        Swal.fire('Error', 'Failed to load projects.', 'error');
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
        Swal.fire({
          title: 'Succès !',
          text: 'Tâche enregistrée avec succès.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        setTimeout(() => {
          this.showSuccessToast = false;
          this.router.navigate(['/tasks']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        if (error.status === 400) {
          if (typeof error.error === 'object') {
            let errorMessage = '';
            Object.keys(error.error).forEach(key => {
              errorMessage += `<p><b>${key}:</b> ${error.error[key]}</p>`;
            });

            Swal.fire({
              title: 'Erreur de Validation',
              html: errorMessage,
              icon: 'error'
            });
          } else {
            Swal.fire({
              title: 'Erreur',
              text: error.error,
              icon: 'error'
            });
          }
        } else {
          Swal.fire({
            title: 'Erreur',
            text: 'Quelque chose a mal tourné. Veuillez réessayer plus tard.',
            icon: 'error'
          });
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}

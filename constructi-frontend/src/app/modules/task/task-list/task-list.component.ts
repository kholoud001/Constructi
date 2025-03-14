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
  faCheckCircle,
  faCalendarPlus,
  faUserCheck,
  faTimesCircle,
  faCalendarDay,
  faFilter,
  faSort,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { SubtaskService } from '../../subtask/subtask.service';
import { UserService } from '../../user/user.service';

interface Task {
  id: number;
  description: string;
  status: string;
  progress: number;
  dateEndEstimated: string;
  assignedTo?: string;
  showSubtasks: boolean;
  subtasks: Subtask[];
  subtasksLoading: boolean;
}

interface Subtask {
  id: number;
  description: string;
  status: string;
  approved: boolean;
  parentTaskId: number;
}

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
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faCheckCircle = faCheckCircle;
  faCalendarPlus = faCalendarPlus;
  faUserCheck = faUserCheck;
  faTimesCircle = faTimesCircle;
  faCalendarDay = faCalendarDay;
  faFilter = faFilter;
  faSort = faSort;
  faSearch = faSearch;

  tasks: Task[] = [];
  isLoading = true;

  constructor(
    private taskService: TaskService,
    private subtaskService: SubtaskService,
    private userService: UserService,
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
        console.error('Erreur lors du chargement des tâches :', error);
        this.isLoading = false;
        this.showErrorAlert('Échec du chargement des tâches', 'Veuillez réessayer plus tard.');
      }
    });
  }

  toggleSubtasks(task: Task): void {
    task.showSubtasks = !task.showSubtasks;
    if (task.showSubtasks && task.subtasks.length === 0) {
      this.loadSubtasks(task);
    }
  }

  loadSubtasks(task: Task): void {
    task.subtasksLoading = true;
    this.subtaskService.getSubtasksByParentTaskId(task.id).subscribe({
      next: (data) => {
        task.subtasks = data;
        task.subtasksLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des sous-tâches :', error);
        task.subtasksLoading = false;
        this.showErrorAlert('Échec du chargement des sous-tâches', 'Veuillez réessayer plus tard.');
      }
    });
  }

  addSubtask(parentTaskId: number): void {
    this.router.navigate(['/subtasks/add', parentTaskId]);
  }

  confirmDeleteSubtask(subtask: Subtask): void {
    Swal.fire({
      title: 'Supprimer la Sous-tâche ?',
      text: 'Êtes-vous sûr de vouloir supprimer cette sous-tâche ? Cette action ne peut pas être annulée.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-la',
      cancelButtonText: 'Annuler',
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

  deleteSubtask(subtask: Subtask): void {
    const loadingAlert = this.showLoadingAlert('Suppression de la sous-tâche...');

    this.subtaskService.deleteSubtask(subtask.id).subscribe({
      next: () => {
        Swal.close();
        this.showSuccessAlert('Sous-tâche supprimée avec succès');
        // Reload the subtasks for the parent task
        const parentTask = this.tasks.find(t => t.id === subtask.parentTaskId);
        if (parentTask) {
          this.loadSubtasks(parentTask);
        }
      },
      error: (error) => {
        Swal.close();
        console.error('Erreur lors de la suppression de la sous-tâche :', error);
        this.showErrorAlert('Échec de la suppression de la sous-tâche', 'Veuillez réessayer plus tard.');
      }
    });
  }

  confirmApproveSubtask(subtask: Subtask): void {
    Swal.fire({
      title: 'Approuver la Sous-tâche ?',
      text: 'Êtes-vous sûr de vouloir approuver cette sous-tâche ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, approuvez-la',
      cancelButtonText: 'Annuler',
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

  approveSubtask(subtask: Subtask): void {
    const loadingAlert = this.showLoadingAlert('Approbation de la sous-tâche...');

    this.subtaskService.approveSubtask(subtask.id).subscribe({
      next: () => {
        Swal.close();
        this.showSuccessAlert('Sous-tâche approuvée avec succès');
        // Reload the subtasks for the parent task
        const parentTask = this.tasks.find(t => t.id === subtask.parentTaskId);
        if (parentTask) {
          this.loadSubtasks(parentTask);
        }
      },
      error: (error) => {
        Swal.close();
        console.error('Erreur lors de l\'approbation de la sous-tâche :', error);
        this.showErrorAlert('Échec de l\'approbation de la sous-tâche', 'Veuillez réessayer plus tard.');
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

  confirmDelete(task: Task): void {
    Swal.fire({
      title: 'Supprimer la Tâche ?',
      text: 'Êtes-vous sûr de vouloir supprimer cette tâche et toutes ses sous-tâches ? Cette action ne peut pas être annulée.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-la',
      cancelButtonText: 'Annuler',
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
    const loadingAlert = this.showLoadingAlert('Suppression de la tâche...');

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        Swal.close();
        this.showSuccessAlert('Tâche supprimée avec succès');
        this.loadTasks();
      },
      error: (error) => {
        Swal.close();
        console.error('Erreur lors de la suppression de la tâche :', error);
        this.showErrorAlert('Échec de la suppression de la tâche', 'Veuillez réessayer plus tard.');
      }
    });
  }

  addTask(): void {
    this.router.navigate(['/tasks/add']);
  }

  prolongSubtask(subtaskId: number): void {
    Swal.fire({
      title: 'Prolonger la Sous-tâche',
      input: 'date',
      inputLabel: 'Nouvelle Date de Fin',
      inputAttributes: {
        required: 'true'
      },
      showCancelButton: true,
      confirmButtonText: 'Prolonger',
      cancelButtonText: 'Annuler',
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
        const newEndDate = result.value;
        const loadingAlert = this.showLoadingAlert('Prolongation de la sous-tâche...');

        this.subtaskService.prolongSubtask(subtaskId, newEndDate).subscribe({
          next: () => {
            Swal.close();
            this.showSuccessAlert('Sous-tâche prolongée avec succès');
            // Trouver et recharger les sous-tâches de la tâche parente
            for (const task of this.tasks) {
              if (task.subtasks.some(s => s.id === subtaskId)) {
                this.loadSubtasks(task);
                break;
              }
            }
          },
          error: (error) => {
            Swal.close();
            let errorMessage = 'Échec de la prolongation de la sous-tâche. Veuillez réessayer plus tard.';

            if (error.error) {
              if (typeof error.error === 'string') {
                errorMessage = error.error;
              }
              else if (error.error.message) {
                errorMessage = error.error.message;
              }
            }
            this.showErrorAlert('Error', errorMessage);
          }
        });
      }
    });
  }

  assignTaskToWorker(taskId: number): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        const userOptions = users.reduce((acc, user) => {
          if (user.id !== undefined) {
            acc[user.id] = `${user.fname} ${user.lname}`;
          }
          return acc;
        }, {} as { [key: number]: string });

        Swal.fire({
          title: 'Assigner une tâche à un travailleur',
          input: 'select',
          inputOptions: userOptions,
          inputLabel: 'Sélectionner un travailleur',
          inputAttributes: {
            required: 'true'
          },
          showCancelButton: true,
          confirmButtonText: 'Assigner',
          cancelButtonText: 'Annuler',
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
            const workerId = result.value;
            const loadingAlert = this.showLoadingAlert('Assignation de la tâche...');

            this.taskService.assignTaskToWorker(taskId, workerId).subscribe({
              next: () => {
                Swal.close();
                this.showSuccessAlert('Tâche assignée avec succès');
                this.loadTasks();
              },
              error: (error) => {
                Swal.close();
                console.error('Erreur lors de l\'assignation de la tâche :', error);
                this.showErrorAlert('Échec de l\'assignation de la tâche', 'Veuillez réessayer plus tard.');
              }
            });
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        this.showErrorAlert('Échec du chargement des utilisateurs', 'Veuillez réessayer plus tard.');
      }
    });
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

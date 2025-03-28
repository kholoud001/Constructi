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
      this.showErrorAlert('ID de Tâche invalide', 'L\'ID de la tâche parente est invalide.');
      return;
    }
    this.loadSubtasks();
  }

  loadSubtasks(): void {
    if (this.parentTaskId === undefined) {
      console.warn("Aucun parentTaskId fourni, saut de l'appel API.");
      return;
    }

    this.isLoading = true;
    this.subtaskService.getSubtasksByParentTaskId(this.parentTaskId).subscribe({
      next: (data) => {
        this.subtasks = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erreur lors du chargement des sous-tâches", error);
        this.isLoading = false;
        this.showErrorAlert('Erreur lors du chargement des sous-tâches', 'Veuillez réessayer plus tard.');
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
      title: 'Supprimer la Sous-tâche?',
      text: 'Êtes-vous sûr de vouloir supprimer cette sous-tâche? Cette action ne peut pas être annulée.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
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
        this.deleteSubtask(subtask.id);
      }
    });
  }

  deleteSubtask(subtaskId: number): void {
    const loadingAlert = this.showLoadingAlert('Suppression de la sous-tâche...');

    this.subtaskService.deleteSubtask(subtaskId).subscribe({
      next: () => {
        Swal.close();
        this.showSuccessAlert('Sous-tâche supprimée avec succès');
        this.loadSubtasks();
      },
      error: (error) => {
        Swal.close();
        console.error('Erreur lors de la suppression de la sous-tâche:', error);
        this.showErrorAlert('Erreur lors de la suppression de la sous-tâche', 'Veuillez réessayer plus tard.');
      }
    }); 
  }

  confirmApprove(subtask: Subtask): void {
    Swal.fire({
      title: 'Approuver la Sous-tâche?',
      text: 'Êtes-vous sûr de vouloir approuver cette sous-tâche?',
      icon: 'question', 
      showCancelButton: true,
      confirmButtonText: 'Oui, approuver',
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
        this.approveSubtask(subtask.id);
      }
    });
  }

  approveSubtask(subtaskId: number): void {
    const loadingAlert = this.showLoadingAlert('Approbation de la sous-tâche...');

    this.subtaskService.approveSubtask(subtaskId).subscribe({
      next: () => {
        Swal.close();
        this.showSuccessAlert('Sous-tâche approuvée avec succès');
        this.loadSubtasks();
      },
      error: (error) => {
        Swal.close();
        console.error('Erreur lors de l\'approbation de la sous-tâche:', error);
        this.showErrorAlert('Échec de l\'approbation de la sous-tâche', 'Veuillez réessayer plus tard.');
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
      title: 'Succès',
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

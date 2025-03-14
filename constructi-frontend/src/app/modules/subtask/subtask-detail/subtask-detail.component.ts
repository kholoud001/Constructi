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
  faBan, faHistory
} from '@fortawesome/free-solid-svg-icons';

interface Subtask {
  id: number;
  description: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'FINISHED' ;
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
        this.error = 'Échec du chargement des détails de la sous-tâche. Veuillez réessayer.';
        this.loading = false;
        console.error('Erreur lors du chargement de la sous-tâche:', err);

        Swal.fire({
          title: 'Erreur !',
          text: 'Échec du chargement des détails de la sous-tâche.',
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

  approveSubtask(): void {
    if (!this.subtask) return;

    Swal.fire({
      title: 'Approuver la sous-tâche',
      text: 'Êtes-vous sûr de vouloir approuver cette sous-tâche ?',
      icon: 'question', 
      showCancelButton: true,
      confirmButtonText: 'Oui, approuver !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.subtaskService.approveSubtask(this.subtask!.id).subscribe({
          next: (response) => {
            this.loading = false;
            this.subtask!.approved = true;

            Swal.fire({
              title: 'Approuvée !',
              text: 'La sous-tâche a été approuvée avec succès.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            this.loading = false;
            console.error('Erreur lors de l\'approbation de la sous-tâche:', err);

            Swal.fire({
              title: 'Erreur !',
              text: 'Échec de l\'approbation de la sous-tâche.',
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
      title: 'Supprimer la sous-tâche',
      text: 'Êtes-vous sûr de vouloir supprimer cette sous-tâche ? Cette action est irréversible.',
      icon: 'warning', 
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
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
          title: 'Supprimée !',
          text: 'La sous-tâche a été supprimée avec succès.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        this.router.navigate(['/subtasks/parent', this.subtask!.parentTaskId]);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur lors de la suppression de la sous-tâche:', err);

        Swal.fire({
          title: 'Erreur !',
          text: 'Échec de la suppression de la sous-tâche.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  protected readonly faHistory = faHistory;
}

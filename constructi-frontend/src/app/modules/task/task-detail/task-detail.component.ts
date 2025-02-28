import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import {
  faSpinner,
  faExclamationTriangle,
  faArrowLeft,
  faCalendarAlt,
  faClipboardList,
  faTag,
  faUserCircle,
  faInfoCircle,
  faClock,
  faEdit,
  faTrash,
  faMoneyBill,
  faProjectDiagram,
  faHourglassHalf,
  faFileInvoiceDollar
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

interface Task {
  id: number;
  description: string;
  status: 'FINISHED' | 'IN_PROGRESS' | 'PENDING';
  beginDate: string;
  dateEndEstimated: string;
  budgetLimit: number;
  effectiveTime: number;
  projectId: number;
  totalPaid: number;
  userEmail: string;
  userId: number;
}

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css'],
  standalone: false
})
export class TaskDetailComponent implements OnInit {
  taskId!: number;
  task: Task | null = null;
  loading = false;
  error: string | null = null;

  faSpinner = faSpinner;
  faExclamationTriangle = faExclamationTriangle;
  faArrowLeft = faArrowLeft;
  faCalendarAlt = faCalendarAlt;
  faClipboardList = faClipboardList;
  faTag = faTag;
  faUserCircle = faUserCircle;
  faClock = faClock;
  faEdit = faEdit;
  faTrash = faTrash;
  faMoneyBill = faMoneyBill;
  faProjectDiagram = faProjectDiagram;
  faHourglassHalf = faHourglassHalf;
  faFileInvoiceDollar = faFileInvoiceDollar;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchTaskDetails();
  }

  fetchTaskDetails(): void {
    this.loading = true;
    this.error = null;

    this.taskService.getTaskById(this.taskId).subscribe({
      next: (data) => {
        this.task = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load task details.';
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'FINISHED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }


  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  editTask(taskId: number): void {
    this.router.navigate(['/tasks/edit', taskId]);
  }


  deleteTask(): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(this.taskId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Supprimé !',
              text: 'La tâche a été supprimée avec succès.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/tasks']);
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'Erreur !',
              text: "La tâche n'a pas pu être supprimée.",
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }
}

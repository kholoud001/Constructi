import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  faCreditCard,
  faFileInvoiceDollar,
  faMoneyBillWave,
  faChartLine,
  faClipboardList,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faCalendarAlt,
  faClock, faCalendarCheck, faPhone, faEnvelope, faUser, faArrowLeft, faTimes
} from '@fortawesome/free-solid-svg-icons';
import { TaskService } from '../task.service';
import {InvoiceService} from '../../invoice/invoice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-payement-process',
  templateUrl: './task-payement-process.component.html',
  styleUrls: ['./task-payement-process.component.css']
})
export class TaskPayementProcessComponent implements OnInit {
  taskId: string | null = null;
  taskDetails: any = null;
  loading: boolean = true;
  paymentProcessing: boolean = false;
  isPaymentModalOpen = false;


  faClipboardList = faClipboardList;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faSpinner = faSpinner;
  faClock = faClock;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faCalendarAlt = faCalendarAlt;
  faCalendarCheck = faCalendarCheck;
  protected readonly faCreditCard = faCreditCard;
  protected readonly faFileInvoiceDollar = faFileInvoiceDollar;
  protected readonly faChartLine = faChartLine;
  protected readonly faMoneyBillWave = faMoneyBillWave;
  protected readonly faArrowLeft = faArrowLeft;


  paymentData = {
    userId: 0,
    amount: 0,
    justificationFile: null as File | null,
    projectId: 0,
    taskId: 0
  };


  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
    private invoiceService: InvoiceService,
  ) {
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.fetchTaskDetails(parseInt(this.taskId, 10));
    }
  }

  fetchTaskDetails(taskId: number) {
    this.loading = true;
    this.taskService.getTaskDetails(taskId).subscribe({
      next: (data: any) => {
        this.taskDetails = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching task details:', err);
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusIcon(status: string) {
    switch (status?.toLowerCase()) {
      case 'paid':
        return this.faCheckCircle;
      case 'pending':
        return this.faSpinner;
      case 'overdue':
        return this.faTimesCircle;
      default:
        return this.faSpinner;
    }
  }

  goBack() {
    this.router.navigate(['/projects']);
  }


  isPaymentDisabled(): boolean {
    return this.taskDetails?.budgetLimit <= this.taskDetails?.totalPaid;
  }

  openPaymentModal(task: any) {
    this.paymentData.userId = task.userId;
    this.paymentData.projectId = task.projectId;
    this.paymentData.taskId = task.id;
    this.isPaymentModalOpen = true;
  }

  closePaymentModal() {
    this.isPaymentModalOpen = false;
  }


  doPayment() {
    const userId = Number(this.paymentData.userId);
    const amount = Number(this.paymentData.amount);
    const projectId = this.paymentData.projectId;
    const taskId = this.paymentData.taskId;
    const justificationFile = this.paymentData.justificationFile;

    if (!userId || !projectId || !taskId) {
      Swal.fire({
        icon: 'warning',
        title: 'Données manquantes',
        text: 'Une erreur est survenue avec les informations de paiement.',
        confirmButtonText: 'Compris',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    if (!amount || amount <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Montant invalide',
        text: 'Le montant doit être supérieur à 0.',
        confirmButtonText: 'Compris',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    if (!justificationFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Document manquant',
        text: 'Veuillez joindre un document justificatif.',
        confirmButtonText: 'Compris',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    Swal.fire({
      title: 'Confirmer le paiement',
      html: `
      <p>Êtes-vous sûr de vouloir effectuer ce paiement ?</p>
      <br>
      <p><strong>Montant :</strong> ${amount.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}</p>
      <p><strong>Document :</strong> ${justificationFile.name}</p>
    `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.payUser(userId, amount, justificationFile, projectId, taskId); // Pass taskId
        this.closePaymentModal();
      }
    });
  }


  payUser(userId: number, amount: number, fileInput: File, projectId: number, taskId: number) {
    Swal.fire({
      title: 'Traitement en cours',
      text: 'Veuillez patienter pendant le traitement du paiement...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.invoiceService.paySomeone(userId, amount, fileInput, projectId, taskId).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Paiement réussi',
          text: `Le paiement de ${amount}€ a été effectué avec succès.`,
          confirmButtonText: 'Fermer',
          confirmButtonColor: '#3B82F6'
        });
      },
      error: (err) => {
        let errorMessage = 'Une erreur est survenue lors du traitement du paiement.';

        if (err.status === 400) {
          errorMessage = 'Les informations de paiement sont invalides.';
        } else if (err.status === 403) {
          errorMessage = 'Vous n\'avez pas les droits nécessaires pour effectuer ce paiement.';
        } else if (err.status === 404) {
          errorMessage = 'Utilisateur, projet ou tâche non trouvé.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Erreur de paiement',
          text: errorMessage,
          confirmButtonText: 'Fermer',
          confirmButtonColor: '#EF4444'
        });
        console.error('Erreur de paiement:', err);
      }
    });
  }


  private readonly VALID_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  private readonly MAX_SIZE = 25 * 1024 * 1024;


  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!this.VALID_TYPES.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Please upload a PDF, DOC, or image file (JPEG, PNG, GIF, WEBP)'
        });
        return;
      }

      if (file.size > this.MAX_SIZE) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'File size should be less than 25MB'
        });
        return;
      }

      this.paymentData.justificationFile = file;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.imagePreview = null;
      }
    }
  }

  imagePreview: string | null = null;

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = document.querySelector('.border-dashed');
    dropZone?.classList.add('drag-over');
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = document.querySelector('.border-dashed');
    dropZone?.classList.remove('drag-over');
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = document.querySelector('.border-dashed');
    dropZone?.classList.remove('drag-over');

    const files = event.dataTransfer?.files;
    if (files?.length) {
      const event = {target: {files: files}};
      this.handleFileInput(event);
    }
  }


  protected readonly faTimes = faTimes;
}

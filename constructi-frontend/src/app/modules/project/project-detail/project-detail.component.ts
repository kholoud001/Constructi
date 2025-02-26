import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../project.service';
import Swal from 'sweetalert2';
import { UserService } from '../../user/user.service';
import {
  faEnvelope, faUser, faCalendar, faPhone, faDollarSign, faImage, faFile,
  faTasks, faTools, faChevronDown, faProjectDiagram, faCloudUpload,
  faClock, faExclamationTriangle, faBoxOpen, faClipboardList, faTimes, faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';
import { InvoiceService } from '../../invoice/invoice.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent implements OnInit {

  faCalendar = faCalendar;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faDollarSign = faDollarSign;
  faTasks = faTasks;
  faTools = faTools;
  faChevronDown = faChevronDown;
  faProjectDiagram = faProjectDiagram;
  faClock = faClock;
  faExclamationTriangle = faExclamationTriangle;
  faBoxOpen = faBoxOpen;
  faClipboardList = faClipboardList;
  faTimes = faTimes;
  faCloudUpload = faCloudUpload
  faImage = faImage;
  faFile = faFile;
  faExchangeAlt = faExchangeAlt;


  project: any;
  progress: number = 0;
  alertMessage: string = '';
  user: any;
  userName: string = '';
  userEmail: string = '';
  userPhone: string = '';
  showUserDetails: boolean = false;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  isPaymentModalOpen = false;
  isDragging = false;

  paymentData = {
    userId: 0,
    amount: 0,
    justificationFile: null as File | null,
    projectId: 0,
    taskId: 0
  };

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private userService: UserService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.projectService.getProjectDetails(id).subscribe((data) => {
      this.project = data;
      this.progress = data.progress || 0;

      if (this.project.tasks && this.project.tasks.length > 0) {
        this.project.tasks.forEach((task: any) => {
          if (task.invoices && task.invoices.length > 0) {
            task.totalPaid = task.invoices.reduce((sum: number, invoice: any) => sum + invoice.amount, 0);
          } else {
            task.totalPaid = task.totalPaid || 0;
          }
        });
      }

      console.log("projets => ", this.project);

      if (this.project.initialBudget < this.project.actualBudget) {
        this.alertMessage = `⚠️ Alert: The actual budget (${this.project.actualBudget}) is higher than the initial budget (${this.project.initialBudget}). Please review expenses.`;
        Swal.fire({
          icon: 'warning',
          title: 'Budget Alert',
          text: this.alertMessage,
        });
      }

      this.userService.getUserById(this.project.userId).subscribe((userData) => {
        this.user = userData;
        this.userName = userData.lname;
        this.userEmail = userData.email;
        this.userPhone = userData.cell;
      });
    });
  }

  toggleUserDetails(): void {
    this.showUserDetails = !this.showUserDetails;
    const detailsElement = document.querySelector('.animate-fade-in');
    if (detailsElement) {
      detailsElement.classList.add('transition-all', 'duration-300');
    }
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
      <p><strong>Montant :</strong> ${amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
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
      const event = { target: { files: files } };
      this.handleFileInput(event);
    }
  }

}

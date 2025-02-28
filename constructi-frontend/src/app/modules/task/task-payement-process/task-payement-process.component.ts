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
  faClock, faCalendarCheck, faPhone, faEnvelope, faUser, faArrowLeft, faTimes, faImage, faFile, faCloudUpload
} from '@fortawesome/free-solid-svg-icons';
import { TaskService } from '../task.service';
import {InvoiceService} from '../../invoice/invoice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-payement-process',
  templateUrl: './task-payement-process.component.html',
  styleUrls: ['./task-payement-process.component.css'],
  standalone:false
})
export class TaskPayementProcessComponent implements OnInit {
  taskId: string | null = null;
  taskDetails: any = null;
  loading: boolean = true;
  paymentProcessing: boolean = false;
  isPaymentModalOpen = false;
  isDragging = false;
  imagePreview: string | null = null;


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
  protected readonly faImage = faImage;
  protected readonly faFile = faFile;


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
    this.taskService.getTaskWithInvoices(taskId).subscribe({
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

  // Method to open the payment modal
  openPaymentModal() {
    this.isPaymentModalOpen = true;
      // Populate paymentData with valid IDs
      this.paymentData = {
        userId: this.taskDetails?.userId || 0, // Replace with the correct property
        amount: 0,
        justificationFile: null,
        projectId: this.taskDetails?.projectId || 0, // Replace with the correct property
        taskId: this.taskDetails?.id || 0, // Replace with the correct property
      };
      this.isPaymentModalOpen = true;

  }

// Method to close the payment modal
  closePaymentModal() {
    this.isPaymentModalOpen = false;
    this.resetPaymentData();
  }

// Method to handle file input
  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.paymentData.justificationFile = file;
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.imagePreview = null;
      }
    }
  }

// Method to reset payment data
  resetPaymentData() {
    this.paymentData = {
      userId: 0,
      amount: 0,
      justificationFile: null,
      projectId: 0,
      taskId: 0,
    };
    this.imagePreview = null;
  }

  doPayment() {
    if (!this.paymentData.justificationFile || this.paymentData.amount <= 0) {
      Swal.fire('Error', 'Please fill all required fields.', 'error');
      return;
    }

    console.log('Payment Data:', this.paymentData); // Log the payment data

    this.paymentProcessing = true;
    this.invoiceService
      .paySomeone(
        this.paymentData.userId,
        this.paymentData.amount,
        this.paymentData.justificationFile,
        this.paymentData.projectId,
        this.paymentData.taskId
      )
      .subscribe({
        next: () => {
          Swal.fire('Success', 'Payment processed successfully!', 'success');
          this.closePaymentModal();
          this.fetchTaskDetails(Number(this.taskId)); // Refresh task details
        },
        error: (err) => {
          console.error('Error processing payment:', err);
          Swal.fire('Error', 'Failed to process payment.', 'error');
        },
        complete: () => {
          this.paymentProcessing = false;
        },
      });
  }

  protected readonly faTimes = faTimes;
  protected readonly faCloudUpload = faCloudUpload;
}

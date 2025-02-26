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

  processPayment() {

  }
}

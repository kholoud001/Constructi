import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  faClock,
  faCalendarCheck,
  faPhone,
  faEnvelope,
  faUser,
  faArrowLeft,
  faTimes,
  faImage,
  faFile,
  faCloudUpload,
} from '@fortawesome/free-solid-svg-icons';
import { MaterialService } from '../material.service';
import { InvoiceService } from '../../invoice/invoice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-material-invoice-history',
  templateUrl: './material-invoice-history.component.html',
  styleUrls: ['./material-invoice-history.component.css'],
  standalone:false,
})
export class MaterialInvoiceHistoryComponent implements OnInit {
  materialId: string | null = null;
  materialDetails: any = null;
  loading: boolean = true;
  paymentProcessing: boolean = false;
  isPaymentModalOpen = false;
  isDragging = false;
  imagePreview: string | null = null;

  // Icons
  faClipboardList = faClipboardList;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faSpinner = faSpinner;
  faClock = faClock;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faCalendarAlt = faCalendarAlt;
  faCalendarCheck = faCalendarCheck;
  faCreditCard = faCreditCard;
  faFileInvoiceDollar = faFileInvoiceDollar;
  faChartLine = faChartLine;
  faMoneyBillWave = faMoneyBillWave;
  faArrowLeft = faArrowLeft;
  faImage = faImage;
  faFile = faFile;
  faTimes = faTimes;
  faCloudUpload = faCloudUpload;

  paymentData = {
    userId: 0,
    amount: 0,
    justificationFile: null as File | null,
    materialId: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService,
    private router: Router,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.materialId = this.route.snapshot.paramMap.get('id');
    if (this.materialId) {
      this.fetchMaterialDetails(parseInt(this.materialId, 10));
    }
  }

  fetchMaterialDetails(materialId: number) {
    this.loading = true;
    this.materialService.getMaterialById(materialId).subscribe({
      next: (material) => {
        this.materialDetails = material;
        this.fetchInvoicesByMaterialId(materialId);
      },
      error: (err) => {
        console.error('Error fetching material details:', err);
        this.loading = false;
      },
    });
  }

  fetchInvoicesByMaterialId(materialId: number) {
    this.materialService.getInvoicesByMaterialId(materialId).subscribe({
      next: (invoices) => {
        this.materialDetails.invoices = invoices; // Add invoices to materialDetails
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching invoices:', err);
        this.loading = false;
      },
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
    this.router.navigate(['/materials']);
  }

  openPaymentModal() {
    this.isPaymentModalOpen = true;
    this.paymentData = {
      userId: this.materialDetails?.userId || 0, // Replace with the correct property
      amount: 0,
      justificationFile: null,
      materialId: this.materialDetails?.id || 0,
    };
  }

  closePaymentModal() {
    this.isPaymentModalOpen = false;
    this.resetPaymentData();
  }

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

  resetPaymentData() {
    this.paymentData = {
      userId: 0,
      amount: 0,
      justificationFile: null,
      materialId: 0,
    };
    this.imagePreview = null;
  }

  doPayment() {
    if (!this.paymentData.justificationFile || this.paymentData.amount <= 0) {
      Swal.fire('Error', 'Please fill all required fields.', 'error');
      return;
    }

    this.paymentProcessing = true;
    this.materialService
      .createMaterialInvoice(
        this.paymentData.materialId,
        this.paymentData.amount,
        this.paymentData.justificationFile
      )
      .subscribe({
        next: () => {
          Swal.fire('Success', 'Payment processed successfully!', 'success');
          this.closePaymentModal();
          this.fetchMaterialDetails(Number(this.materialId)); // Refresh material details
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
}

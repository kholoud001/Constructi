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
  faEnvelope,
  faUser,
  faArrowLeft,

} from '@fortawesome/free-solid-svg-icons';
import { MaterialService } from '../material.service';
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
  totalMaterialValue: number = 0;
  totalPaid: number = 0;
  remainingBudget: number = 0;

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


  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService,
    private router: Router,
  ) {
  }

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
        console.log('Material received:', material);
        this.materialDetails = material;
        console.log("material details " +material)

        this.totalMaterialValue = material.priceUnit * material.quantity;

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
        this.materialDetails.invoices = invoices;

        // Calculer le montant total payé
        this.totalPaid = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);

        // Calculer le reste à payer
        this.remainingBudget = this.totalMaterialValue - this.totalPaid;

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

  openCreateInvoicePopup(materialId: number, materialName: string, totalValue: number): void {
    Swal.fire({
      title: 'Créer une facture pour ' + materialName,
      html:
        `<p>Valeur totale du matériau : ${totalValue.toFixed(2)}</p>` +
        `<input id="amount" type="number" class="swal2-input" placeholder="Montant">` +
        `<input id="justificationFile" type="file" class="swal2-file" accept=".pdf,.doc,.docx,.jpg,.png">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Créer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const amount = (document.getElementById('amount') as HTMLInputElement).value;
        const justificationFile = (document.getElementById('justificationFile') as HTMLInputElement).files?.[0];

        if (!amount || !justificationFile) {
          Swal.showValidationMessage('Veuillez remplir tous les champs');
          return false;
        }

        return { amount: parseFloat(amount), justificationFile };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { amount, justificationFile } = result.value;

        if (amount > this.remainingBudget) {
          Swal.fire('Erreur', `Le montant du paiement ne doit pas dépasser le reste à payer (${this.remainingBudget.toFixed(2)})`, 'error');
          return;
        }

        this.paymentProcessing = true;
        this.materialService.createMaterialInvoice(materialId, amount, justificationFile).subscribe({
          next: (invoice) => {
            Swal.fire('Succès', 'Facture créée avec succès', 'success');
            this.fetchMaterialDetails(materialId);
          },
          error: (err) => {
            console.error('Error creating invoice:', err);
            this.showErrorAlert('Erreur de création', err.error || 'Impossible de créer la facture.');
          },
          complete: () => {
            this.paymentProcessing = false;
          },
        });
      }
    });
  }

  showErrorAlert(title: string, message: string): void {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'OK'
    });
  }

}

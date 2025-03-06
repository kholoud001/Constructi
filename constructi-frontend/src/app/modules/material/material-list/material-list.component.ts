import { Component, OnInit } from '@angular/core';
import {InvoiceResponseDTO, MaterialResponseDTO, MaterialService} from '../material.service';
import Swal from 'sweetalert2';
import {
  faPlus,
  faEdit,
  faTrash,
  faBox,
  faCoins,
  faWarehouse,
  faCalculator,
  faSearch,
  faSync
} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.css'],
  standalone: false
})
export class MaterialListComponent implements OnInit {
  materials: MaterialResponseDTO[] = [];
  loading = false;
  searchTerm = '';
  selectedMaterialInvoices: InvoiceResponseDTO[] = [];

  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faBox = faBox;
  faCoins = faCoins;
  faWarehouse = faWarehouse;
  faCalculator = faCalculator;
  faSearch = faSearch;
  faSync = faSync;

  constructor(
    private materialService: MaterialService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.loading = true;
    this.materialService.getAllMaterials().subscribe({
      next: (data) => {
        this.materials = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching materials:', err);
        this.loading = false;
        this.showErrorAlert('Erreur de chargement', 'Impossible de charger la liste des matériaux.');
      },
    });
  }

  deleteMaterial(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.materialService.deleteMaterial(id).subscribe({
          next: () => {
            this.materials = this.materials.filter((material) => material.id !== id);
            Swal.fire(
              'Supprimé !',
              'Le matériel a été supprimé avec succès.',
              'success'
            );
          },
          error: (err) => {
            console.error('Error deleting material:', err);
            this.showErrorAlert('Erreur de suppression', 'Impossible de supprimer le matériel.');
          },
        });
      }
    });
  }


  refreshList(): void {
    this.loadMaterials();
  }

  getStockStatus(quantity: number): string {
    if (quantity <= 0) return 'bg-red-100 text-red-800';
    if (quantity <= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }

  showMaterialInvoices(id: number) {
    this.router.navigate(['/materials', id, 'invoices']);
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
        this.materialService.createMaterialInvoice(materialId, amount, justificationFile).subscribe({
          next: (invoice) => {
            Swal.fire('Succès', 'Facture créée avec succès', 'success');
          },
          error: (err) => {
            console.error('Error creating invoice:', err);
            this.showErrorAlert('Erreur de création', err.error || 'Impossible de créer la facture.');
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

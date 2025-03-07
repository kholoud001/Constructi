import { Component, OnInit } from '@angular/core';
import { ProviderResponseDTO, ProviderService } from '../provider.service';
import Swal from 'sweetalert2';

import {
  faBuilding,
  faPlus,
  faSpinner,
  faEdit,
  faTrash,
  faPhone,
  faMapMarkerAlt,
  faSearch,
  faFilter,
  faSort,
  faSync
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.css'],
  standalone: false,
})
export class ProviderListComponent implements OnInit {
  providers: ProviderResponseDTO[] = [];
  filteredProviders: ProviderResponseDTO[] = [];
  isLoading = true;
  searchTerm = '';

  faBuilding = faBuilding;
  faPlus = faPlus;
  faSpinner = faSpinner;
  faEdit = faEdit;
  faTrash = faTrash;
  faPhone = faPhone;
  faMapMarkerAlt = faMapMarkerAlt;
  faSearch = faSearch;
  faFilter = faFilter;
  faSort = faSort;
  faSync = faSync;

  constructor(private providerService: ProviderService) {}

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders(): void {
    this.isLoading = true;
    this.providerService.getAllProviders().subscribe({
      next: (data) => {
        this.providers = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading providers:', error);
        this.isLoading = false;
        this.showErrorAlert('Failed to load providers', 'Please try again later.');
      },
    });
  }

  refreshList(): void {
    this.loadProviders();
  }

  // Apply search filter
  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProviders = [...this.providers];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredProviders = this.providers.filter(provider =>
      provider.name.toLowerCase().includes(searchTermLower) ||
      provider.phone.toLowerCase().includes(searchTermLower) ||
      provider.address.toLowerCase().includes(searchTermLower)
    );
  }

  // Watch for changes to searchTerm
  ngDoCheck() {
    this.applyFilter();
  }

  deleteProvider(id: number): void {
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
        this.providerService.deleteProvider(id).subscribe({
          next: () => {
            this.providers = this.providers.filter((provider) => provider.id !== id);
            this.applyFilter();
            Swal.fire(
              'Supprimé !',
              'Le fournisseur a été supprimé avec succès.',
              'success'
            );
          },
          error: (err) => {
            console.error('Error deleting provider:', err);
            this.showErrorAlert('Erreur de suppression', 'Impossible de supprimer le fournisseur.');
          },
        });
      }
    });
  }

  private showErrorAlert(title: string, message: string): void {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'OK'
    });
  }
}

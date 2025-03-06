import { Component, OnInit } from '@angular/core';
import { ProviderResponseDTO, ProviderService } from '../provider.service';
import type { ActivatedRoute } from "@angular/router"
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
  faSort
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.css'],
  standalone: false,
})
export class ProviderListComponent implements OnInit {
  providers: ProviderResponseDTO[] = [];
  isLoading = true;

  faBuilding = faBuilding;
  faPlus = faPlus;
  faSpinner = faSpinner;
  faEdit = faEdit;
  faTrash = faTrash;
  faPhone = faPhone;
  faMapMarkerAlt = faMapMarkerAlt;


  constructor(private providerService: ProviderService) {}

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders(): void {
    this.isLoading = true;
    this.providerService.getAllProviders().subscribe({
      next: (data) => {
        console.log("Providers:", data);
        this.providers = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading providers:', error);
        this.isLoading = false;
        this.showErrorAlert('Failed to load providers', 'Please try again later.');
      },
    });
  }

  deleteProvider(id: number): void {
    Swal.fire({
      title: 'Delete Provider?',
      text: 'Are you sure you want to delete this provider? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium text-white rounded-lg',
        cancelButton: 'px-4 py-2 text-sm font-medium rounded-lg'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const loadingAlert = this.showLoadingAlert('Deleting provider...');

        this.providerService.deleteProvider(id).subscribe({
          next: () => {
            Swal.close();
            this.showSuccessAlert('Provider deleted successfully');
            this.loadProviders(); // Refresh the list
          },
          error: (error) => {
            Swal.close();
            console.error('Error deleting provider:', error);
            this.showErrorAlert('Failed to delete provider', 'Please try again later.');
          },
        });
      }
    });
  }

  private showLoadingAlert(message: string) {
    return Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl'
      }
    });
  }

  private showSuccessAlert(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      timer: 2000,
      showConfirmButton: false,
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl'
      }
    });
  }

  private showErrorAlert(title: string, message: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc2626',
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium text-white rounded-lg'
      }
    });
  }
}

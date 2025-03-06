import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ProviderRequestDTO, ProviderService} from '../provider.service';

@Component({
  selector: 'app-provider-form',
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.css'],
  standalone:false,

})
export class ProviderFormComponent implements OnInit {
  providerForm: FormGroup;
  isEditMode = false;
  providerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private providerService: ProviderService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.providerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.providerId = this.route.snapshot.params['id'];
    if (this.providerId) {
      this.isEditMode = true;
      this.providerService.getProviderById(this.providerId).subscribe({
        next: (provider) => {
          this.providerForm.patchValue(provider);
        },
        error: (error) => {
          console.error('Error loading provider:', error);
        },
      });
    }
  }

  onSubmit(): void {
    if (this.providerForm.valid) {
      const providerData: ProviderRequestDTO = this.providerForm.value;
      if (this.isEditMode && this.providerId) {
        this.providerService.updateProvider(this.providerId, providerData).subscribe({
          next: () => {
            this.router.navigate(['/providers']);
          },
          error: (error) => {
            console.error('Error updating provider:', error);
          },
        });
      } else {
        this.providerService.createProvider(providerData).subscribe({
          next: () => {
            this.router.navigate(['/providers']);
          },
          error: (error) => {
            console.error('Error creating provider:', error);
          },
        });
      }
    }
  }
}

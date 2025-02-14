import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import {Router, RouterLink} from '@angular/router';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    FontAwesomeModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  faEnvelope = faEnvelope;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) return;

    this.isLoading = true;
    this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Succès!',
          text: response?.message || 'Un lien de réinitialisation a été envoyé à votre adresse e-mail.',
          icon: 'success',
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        Swal.fire({
          title: 'Erreur',
          text: err.error?.message || 'Une erreur est survenue. Veuillez réessayer.',
          icon: 'error',
        });
      },
      complete: () => (this.isLoading = false),
    });
  }

  get emailControl() {
    return this.forgotPasswordForm.get('email');
  }
}

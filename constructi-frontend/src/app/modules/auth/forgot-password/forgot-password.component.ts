import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;

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
      next: () => {
        Swal.fire('Succès!', 'Un lien de réinitialisation a été envoyé à votre adresse e-mail.', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        Swal.fire('Erreur', 'Une erreur est survenue. Veuillez réessayer.', 'error');
      },
      complete: () => (this.isLoading = false)
    });
  }

  get emailControl() {
    return this.forgotPasswordForm.get('email');
  }

}

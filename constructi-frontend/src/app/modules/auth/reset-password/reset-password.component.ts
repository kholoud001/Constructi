import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // ✅ Use queryParamMap for reliability
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token') ?? '';
      console.log('Token from URL:', this.token);

      if (!this.token) {
        Swal.fire('Erreur', 'Lien de réinitialisation invalide.', 'error');
        this.router.navigate(['/login']);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir correctement le formulaire.', 'error');
      return;
    }

    this.authService.resetPassword(this.token, this.resetPasswordForm.value.password).subscribe({
      next: () => {
        Swal.fire('Succès', 'Votre mot de passe a été réinitialisé.', 'success');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur de réinitialisation:', error);
        Swal.fire('Erreur', 'Impossible de réinitialiser le mot de passe.', 'error');
      }
    });
  }

  get formErrors() {
    return this.resetPasswordForm.errors;
  }
}

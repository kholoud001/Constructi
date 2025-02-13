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
  token = '';
  email = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token') ?? '';
      this.email = params.get('email') ?? localStorage.getItem('userEmail') ?? '';
      this.resetPasswordForm.patchValue({ email: this.email });

      if (!this.token) {
        Swal.fire('Erreur', 'Lien de réinitialisation invalide.', 'error');
        this.router.navigate(['/auth/login']);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir correctement le formulaire.', 'error');
      return;
    }

    const { password } = this.resetPasswordForm.getRawValue();
    this.authService.resetPassword(this.token, password, this.email).subscribe({
      next: () => {
        Swal.fire('Succès', 'Votre mot de passe a été réinitialisé.', 'success');
        this.router.navigate(['/auth/login']);
      },
      error: () => Swal.fire('Erreur', 'Impossible de réinitialiser le mot de passe.', 'error')
    });
  }

  get formErrors() {
    return this.resetPasswordForm.errors;
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import {Router, RouterLink} from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {AppStateService} from '../../../shared/services/app-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule,
    RouterLink
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  isLoading = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private appStateService: AppStateService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs correctement', 'error');
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe(
      response => {
        localStorage.setItem('token', response.token);

        Swal.fire({
          title: 'Succès',
          text: 'Connexion réussie',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          const userRole = this.authService.getUserRole();
          this.redirectToDashboard(userRole);
        });
      },
      error => {
        Swal.fire('Erreur', 'Identifiants incorrects', 'error');
      }
    );
  }

  redirectToDashboard(role: string | null) {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/dashboard/admin']);
        break;
      case 'ARCHITECT':
        this.router.navigate(['/dashboard/architect']);
        break;
      case 'WORKER':
        this.router.navigate(['/dashboard/worker']);
        break;
      default:
        this.router.navigate(['/unauthorized']);
        break;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}

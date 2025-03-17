import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import {Router, RouterLink} from '@angular/router';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faEnvelope, faPhone, faLock, faDollarSign, faBriefcase, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    FontAwesomeModule,
    RouterLink
  ],
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faLock = faLock;
  faDollarSign = faDollarSign;
  faBriefcase = faBriefcase;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      cell: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      rateHourly: [null, [Validators.required, Validators.min(10), Validators.max(200)]],
      contratType: ['FULL_TIME', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.register(this.registerForm.value).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Inscription réussie!',
          text: 'Vous serez redirigé vers la liste des utilisateurs.',
          timer: 3000,
          timerProgressBar: true
        }).then(() => {
          this.router.navigate(['/admin/users']);
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Échec de l\'inscription',
          text: 'Veuillez réessayer plus tard.',
        });
      }
    );
  }

}

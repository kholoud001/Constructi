import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../user/user.model';
import {
  faUser,
  faPhone,
  faSave,
  faTimes,
  faUserEdit,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import {UserService} from '../../user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update',
  standalone: false,
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit {
  user: User | null = null;
  profileForm: FormGroup;

  // Icons
  faUser = faUser;
  faPhone = faPhone;
  faSave = faSave;
  faTimes = faTimes;
  faUserEdit = faUserEdit;
  faLock = faLock;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.profileForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      cell: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.loadCurrentUserProfile();
  }

  loadCurrentUserProfile(): void {
    this.userService.getCurrentUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          fname: user.fname,
          lname: user.lname,
          cell: user.cell,
        });
      },
      error: (error) => {
        console.error('Failed to load user profile:', error);
      },
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.user) {
      const updatedUser = { ...this.profileForm.value };
      this.userService.updateCurrentUserProfile(this.user.id!, updatedUser).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);

          Swal.fire({
            title: 'Success!',
            text: 'Profile updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = '/profile/card';
            }
          });
        },
        error: (error) => {
          console.error('Failed to update profile:', error);

          Swal.fire({
            title: 'Error!',
            text: 'Failed to update profile. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
    } else {
      Object.keys(this.profileForm.controls).forEach((key) => {
        const control = this.profileForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}

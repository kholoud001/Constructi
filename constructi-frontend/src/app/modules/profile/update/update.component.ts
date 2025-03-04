import { Component, type OnInit } from "@angular/core"
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import type { User } from "../../user/user.model"
import {
  faUser,
  faEnvelope,
  faPhone,
  faFileContract,
  faSave,
  faTimes,
  faUserEdit,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons"
import {UserService} from '../../user/user.service';

@Component({
  selector: "app-update",
  standalone: false,
  templateUrl: "./update.component.html",
  styleUrls: ["./update.component.css"],
})
export class UpdateComponent implements OnInit {
  user: User | null = null
  profileForm: FormGroup

  faUser = faUser
  faEnvelope = faEnvelope
  faPhone = faPhone
  faFileContract = faFileContract
  faSave = faSave
  faTimes = faTimes
  faUserEdit = faUserEdit
  faDollarSign = faDollarSign

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.profileForm = this.fb.group({
      fname: ["", Validators.required],
      lname: ["", Validators.required],
      cell: ["", [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      email: ["", [Validators.required, Validators.email]],
      rateHourly: ["", [Validators.required, Validators.min(0)]],
      contratType: ["", Validators.required],
    })
  }

  ngOnInit(): void {
    this.loadCurrentUserProfile()
  }

  loadCurrentUserProfile(): void {
    this.userService.getCurrentUserProfile().subscribe({
      next: (user) => {
        this.user = user
        this.profileForm.patchValue(user)
      },
      error: (error) => {
        console.error("Failed to load user profile:", error)
      },
    })
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.user) {
      const updatedUser: User = { ...this.user, ...this.profileForm.value }
      this.userService.updateCurrentUserProfile(updatedUser).subscribe({
        next: (response) => {
          console.log("Profile updated successfully:", response)
          alert("Profile updated successfully!")
        },
        error: (error) => {
          console.error("Failed to update profile:", error)
          alert("Failed to update profile. Please try again.")
        },
      })
    } else {
      // Mark all form controls as touched to trigger validation messages
      Object.keys(this.profileForm.controls).forEach((key) => {
        const control = this.profileForm.get(key)
        control?.markAsTouched()
      })
    }
  }
}


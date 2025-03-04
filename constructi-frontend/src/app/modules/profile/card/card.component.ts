import { Component, type OnInit } from "@angular/core"
import type { User } from "../../user/user.model"
import {
  faUser,
  faEnvelope,
  faPhone,
  faCheckCircle,
  faTimesCircle,
  faEdit,
  faFileContract,
  faDownload,
  faBriefcase, faTrash, faLockOpen,
} from "@fortawesome/free-solid-svg-icons"
import {UserService} from '../../user/user.service';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: "app-card",
  standalone: false,
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
  user: User | null = null

  faUser = faUser
  faEnvelope = faEnvelope
  faPhone = faPhone
  faCheckCircle = faCheckCircle
  faTimesCircle = faTimesCircle
  faEdit = faEdit
  faFileContract = faFileContract
  faDownload = faDownload
  faBriefcase = faBriefcase

  constructor(
    private userService: UserService,
    private authService:AuthService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUserProfile()
  }

  loadCurrentUserProfile(): void {
    this.userService.getCurrentUserProfile().subscribe({
      next: (user) => {
        this.user = user
      },
      error: (error) => {
        console.error("Failed to load user profile:", error)
      },
    })
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  protected readonly faTrash = faTrash;
  protected readonly faLockOpen = faLockOpen;
}


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { faUser, faEnvelope, faUserTag, faPhone, faFileContract, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-edit',
  standalone: false,
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  faUser = faUser;
  faEnvelope = faEnvelope;
  faUserTag = faUserTag;
  faPhone = faPhone;
  faFileContract = faFileContract;
  faUserEdit = faUserEdit;

  user$: Observable<User> | undefined;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      const id = Number(userId);
      if (!isNaN(id)) {
        this.user$ = this.userService.getUserById(id);
      } else {
        console.error('Invalid user ID');
        this.router.navigate(['/admin/users']);
      }
    }
  }

  onSubmit(user: User): void {
    this.userService.updateUser(user.id, user).subscribe(() => {
      this.router.navigate(['/admin/users']);
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }
}

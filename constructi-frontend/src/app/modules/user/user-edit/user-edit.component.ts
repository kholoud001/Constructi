import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { faUser, faEnvelope, faUserTag, faPhone, faFileContract, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

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
  roles: { id: number, roleType: string }[] = [];

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

    this.userService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  onSubmit(user: User): void {
    this.userService.updateUser(user.id, user).subscribe({
      next: () => {
        Swal.fire({
          title: 'Succès !',
          text: 'L\'utilisateur a été mis à jour avec succès !',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/admin/users']);
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Erreur !',
          text: 'Il y a eu une erreur lors de la mise à jour de l\'utilisateur.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    });
  }


  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }

  getRoleName(roleId: number): string {
    const role = this.roles.find(r => r.id === roleId);
    return role ? role.roleType : 'Unknown';
  }

}

import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import Swal from 'sweetalert2';
import {Router, RouterLink} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUsers,
  faUser,
  faEnvelope,
  faUserTag,
  faEdit,
  faTrash,
  faCircle,
  faTimesCircle, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

interface User {
  active: boolean;
  id?: number;
  fname: string;
  lname: string;
  cell: string;
  email: string;
  password?: string;
  contratType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'FREELANCE';
  roleId: number;
  role?: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [NgForOf, RouterLink, FontAwesomeModule, NgClass, NgIf],
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  faUsers = faUsers;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faUserTag = faUserTag;
  faEdit = faEdit;
  faTrash = faTrash;
  faCircle = faCircle;
  faTimesCircle = faTimesCircle;
  faCheckCircle = faCheckCircle;

  constructor(private userService: UserService,
              protected router:Router) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(data => {
      console.log('Backend Response:', data);
      this.users = data.map(user => ({
        ...user,
        role: this.getRoleName(user.roleId)
      }));
    });
  }

  getRoleName(roleId: number): string {
    const roles: { [key: number]: string } = {
      1: 'Admin',
      2: 'ARCHITECT',
      3: 'WORKER',
    };
    return roles[roleId] ?? 'Unknown';
  }


  deleteUser(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Non, annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe(
          () => {
            Swal.fire(
              'Supprimé!',
              'L\'utilisateur a été supprimé avec succès.',
              'success'
            );
            this.users = this.users.filter(user => user.id !== id);
          },
          (error) => {
            Swal.fire(
              'Erreur!',
              'Une erreur s\'est produite lors de la suppression.',
              'error'
            );
          }
        );
      }
    });
  }

  activateUser(id: number): void {
    this.userService.activateUser(id).subscribe({
      next: (response) => {
        const user = this.users.find(u => u.id === id);
        if (user) {
          user.active = true;
        }
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response,
        });
      },
      error: (error) => {
        console.error('Activate User Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to activate user. Please try again.',
        });
      },
    });
  }

  deactivateUser(id: number): void {
    this.userService.deactivateUser(id).subscribe({
      next: (response) => {
        const user = this.users.find(u => u.id === id);
        if (user) {
          user.active = false;
        }
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response, // Plain text response
        });
      },
      error: (error) => {
        console.error('Deactivate User Error:', error); // Debugging
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to deactivate user. Please try again.',
        });
      },
    });
  }

}

import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {NgForOf} from '@angular/common';
import Swal from 'sweetalert2';

interface User {
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
  imports: [NgForOf],
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(data => {
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
            // Handle error (optional)
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



}

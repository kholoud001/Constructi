import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router'; // for fetching user by ID

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
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;

  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the user ID from the URL
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    // Fetch the user details based on the ID
    this.userService.getUserById(userId).subscribe(user => {
      this.user = {
        ...user,
        role: this.getRoleName(user.roleId) // Setting role based on roleId
      };
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
}

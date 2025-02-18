import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { faArrowLeft, faIdCard, faUser, faEnvelope, faPhone, faFileContract, faUserTag } from '@fortawesome/free-solid-svg-icons';

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
  faArrowLeft = faArrowLeft;
  faIdCard = faIdCard;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faFileContract = faFileContract;
  faUserTag = faUserTag;

  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getUserById(userId).subscribe(user => {
      this.user = {
        ...user,
        role: this.getRoleName(user.roleId)
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../project.service';
import Swal from 'sweetalert2';
import {UserService} from '../../user/user.service';
import {
  faEnvelope, faUser, faCalendar, faPhone, faDollarSign,
  faTasks, faTools, faChevronDown, faProjectDiagram,
  faClock, faExclamationTriangle, faBoxOpen, faClipboardList
} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent implements OnInit {

  faCalendar = faCalendar;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faDollarSign = faDollarSign;
  faTasks = faTasks;
  faTools = faTools;
  faChevronDown = faChevronDown;
  faProjectDiagram = faProjectDiagram;
  faClock = faClock;
  faExclamationTriangle = faExclamationTriangle;
  faBoxOpen = faBoxOpen;
  faClipboardList = faClipboardList;

  project: any;
  progress: number = 0;
  alertMessage: string = '';
  user: any;
  userName: string = '';
  userEmail: string = '';
  userPhone: string = '';
  showUserDetails: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.projectService.getProjectDetails(id).subscribe((data) => {
      this.project = data;
      this.progress = data.progress || 0;

      if (this.project.initialBudget < this.project.actualBudget) {
        this.alertMessage = `⚠️ Alert: The initial budget (${this.project.initialBudget}) is higher than the actual budget (${this.project.actualBudget}). Please review expenses.`;
        Swal.fire({
          icon: 'warning',
          title: 'Budget Alert',
          text: this.alertMessage,
        });
      }

      this.userService.getUserById(this.project.userId).subscribe((userData) => {
        this.user = userData;
        this.userName = userData.lname
        this.userEmail = userData.email;
        this.userPhone = userData.cell;
      });
    });
  }

  toggleUserDetails(): void {
    this.showUserDetails = !this.showUserDetails;
    const detailsElement = document.querySelector('.animate-fade-in');
    if (detailsElement) {
      detailsElement.classList.add('transition-all', 'duration-300');
    }
  }


}

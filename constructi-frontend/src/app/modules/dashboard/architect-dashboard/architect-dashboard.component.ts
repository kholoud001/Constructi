import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {User} from '../../user/user.model';
import {InvoiceService} from '../../invoice/invoice.service';
import {TaskService} from '../../task/task.service';
import {UserService} from '../../user/user.service';
import {ProjectService} from '../../project/project.service';

interface Task {
  id: number;
  title: string;
  description: string;
  deadline: Date;
  status: 'Pending' | 'In Progress' | 'Completed';
  project: Project;
}

interface Project {
  id: number;
  name: string;
  client: string;
}

interface Invoice {
  id: number;
  project: Project;
  date: Date;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

@Component({
  selector: 'app-architect-dashboard',
  standalone: false,
  templateUrl: './architect-dashboard.component.html',
  styleUrl: './architect-dashboard.component.css'
})
export class ArchitectDashboardComponent implements OnInit {
  activeTab: 'tasks' | 'invoices' | 'profile' = 'tasks';
  profileForm!: FormGroup;

  architect: User = {
    id: 0,
    fname: '',
    lname: '',
    cell: '',
    email: '',
    contratType: 'FULL_TIME',
    roleId: 2,
    active: true
  };

  tasks: {
    project: any;
    description: any; id: any; title: any; deadline: Date; projectId: any; status: any }[] = [];
  invoices: Invoice[] = [];

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private taskService: TaskService,
    private userService: UserService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.initProfileForm();
    this.fetchArchitectProfile();
    this.fetchTasks();
    this.fetchInvoices();
  }

  get activeTasks(): Task[] {
    return this.tasks.filter(task => task.status !== 'FINISHED');
  }

  get completedTasks(): Task[] {
    return this.tasks.filter(task => task.status === 'FINISHED');
  }


  initProfileForm(): void {
    this.profileForm = this.fb.group({
      fname: [this.architect.fname, Validators.required],
      lname: [this.architect.lname, Validators.required],
      email: [this.architect.email, [Validators.required, Validators.email]],
      cell: [this.architect.cell],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(8)]]
    });
  }

  fetchArchitectProfile(): void {
    this.userService.getCurrentUserProfile().subscribe(
      (user: User) => {
        this.architect = user;
        this.initProfileForm();
      },
      (error) => {
        console.error('Error fetching architect profile:', error);
      }
    );
  }

  fetchTasks(): void {
    this.taskService.getAssignedTasks().subscribe(
      (tasks: any[]) => {
        // console.log("tasks =>", tasks);
        this.tasks = tasks.map(task => ({
          id: task.id,
          title: task.description,
          description: task.description,
          deadline: new Date(task.dateEndEstimated),
          status: task.status,
          projectId: task.projectId,
          project: { id: task.projectId, name: 'Loading...', client: 'Loading...' }
        }));

        this.tasks.forEach(task => {
          this.projectService.getMyProjectTasks(task.projectId).subscribe(
            (project: any) => {
              task.project = project;
            },
            (error) => {
              console.error('Error fetching project details:', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }


  fetchInvoices(): void {
      this.invoiceService.getMyInvoices(this.architect.id).subscribe(
        (invoices: any[]) => {
          console.log("invoices =>", invoices);

          this.invoices = invoices.map(invoice => ({
            id: invoice.id,
            project: {
              id: invoice.project.id,
              name: invoice.project.name,
              client: invoice.project.client
            },
            date: new Date(invoice.date),
            amount: invoice.amount,
            status: invoice.status
          }));
        },
        (error) => {
          console.error('Error fetching invoices:', error);
        }
      );

  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const updatedUser: Partial<User> = {
        fname: this.profileForm.value.fname,
        lname: this.profileForm.value.lname,
        cell: this.profileForm.value.cell,
        email: this.profileForm.value.email
      };

      if (this.architect.id != null) {
        this.userService.updateCurrentUserProfile(this.architect.id, updatedUser).subscribe(
          (user: User) => {
            this.architect = user;
            this.profileForm.patchValue({
              currentPassword: '',
              newPassword: ''
            });
            alert('Profile updated successfully!');
          },
          (error) => {
            console.error('Error updating profile:', error);
          }
        );
      }
    }
  }

  viewTaskInvoices(taskId: number): void {
    this.taskService.getTaskWithInvoices(taskId).subscribe(
      (taskWithInvoices: any) => {
        console.log('Task Invoices:', taskWithInvoices);
        // You can implement further logic to display the invoices
      },
      (error) => {
        console.error('Error fetching task invoices:', error);
      }
    );
  }
}

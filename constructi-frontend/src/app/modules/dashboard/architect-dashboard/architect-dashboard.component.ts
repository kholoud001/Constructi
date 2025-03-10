import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {User} from '../../user/user.model';
import {InvoiceService} from '../../invoice/invoice.service';
import {TaskService} from '../../task/task.service';
import {UserService} from '../../user/user.service';
import {ProjectService} from '../../project/project.service';
import {forkJoin} from 'rxjs';

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

    this.fetchArchitectProfile()
      .then(() => {
        this.fetchTasks();
        this.fetchInvoices();
      })
      .catch((error) => {
        console.error('Error fetching architect profile:', error);
      });
  }


  get activeTasks(): Task[] {
    return this.tasks.filter(task => task.status !== 'FINISHED');
  }

  get completedTasks(): Task[] {
    return this.tasks.filter(task => task.status === 'FINISHED');
  }

  get projects(): Project[] {
    const projectIds = new Set(this.tasks.map(task => task.project.id));
    return Array.from(projectIds).map(id => {
      const task = this.tasks.find(t => t.project.id === id);
      return task ? task.project : { id: 0, name: '', client: '' };
    });
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

  fetchArchitectProfile(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getCurrentUserProfile().subscribe(
        (user: User) => {
          console.log("profile ",user)
          this.architect = user;
          this.initProfileForm();
          resolve(); // Resolve the promise once the profile is fetched
        },
        (error) => {
          console.error('Error fetching architect profile:', error);
          reject(error); // Reject the promise if there's an error
        }
      );
    });
  }

  fetchInvoices(): void {
    if (!this.architect.taskIds || this.architect.taskIds.length === 0) {
      console.log('No tasks assigned to the architect. Skipping invoice fetch.');
      return;
    }

    // Fetch invoices for each task assigned to the architect
    const invoiceObservables = this.architect.taskIds.map(taskId =>
      this.taskService.getTaskWithInvoices(taskId)
    );

    // Combine all invoice observables into a single observable
    forkJoin(invoiceObservables).subscribe(
      (taskInvoicesArray: any[][]) => {
        // Flatten the array of arrays into a single array of invoices
        this.invoices = taskInvoicesArray.flat().map(taskInvoices => ({
          id: taskInvoices.id,
          project: {
            id: taskInvoices.project.id,
            name: taskInvoices.project.name,
            client: taskInvoices.project.client
          },
          date: new Date(taskInvoices.date),
          amount: taskInvoices.amount,
          status: taskInvoices.status
        }));

        console.log("Invoices fetched for tasks:", this.invoices);
      },
      (error) => {
        console.error('Error fetching invoices for tasks:', error);
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

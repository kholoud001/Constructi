import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../user/user.model';
import { TaskService } from '../../task/task.service';
import { UserService } from '../../user/user.service';
import { ProjectService } from '../../project/project.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import {
  faFileInvoice, faReceipt, faCreditCard, faExclamationCircle,
  faCheckCircle, faClock, faDollarSign, faFileAlt, faCalendar, faTimes
} from '@fortawesome/free-solid-svg-icons';
import {icon, IconDefinition} from '@fortawesome/fontawesome-svg-core';


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
}

interface Invoice {
  id: number;
  amount: number;
  emissionDate: string;
  justificationPath: string;
  materialId: number | null;
  projectId: number | null;
  state: 'PAID' | 'PENDING' | 'OVERDUE';
  taskId: number | null;
  userId: number | null;
  task?: {
    id: number;
    title: string;
  };
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

  faFileInvoice = faFileInvoice;
  faReceipt = faReceipt;
  faCreditCard = faCreditCard;
  faExclamationCircle = faExclamationCircle;
  faCheckCircle = faCheckCircle;
  faClock = faClock;
  faDollarSign = faDollarSign;
  faFileAlt = faFileAlt;
  faCalendar = faCalendar;
  faTimes = faTimes;



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
      cell: [this.architect.cell],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  fetchArchitectProfile(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getCurrentUserProfile().subscribe(
        (user: User) => {
          // console.log("profile ",user)
          this.architect = user;
          this.initProfileForm();
          resolve();
        },
        (error) => {
          console.error('Error fetching architect profile:', error);
          reject(error);
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
      (taskInvoicesArray: any[]) => {
        // console.log('Task Invoices Array:', taskInvoicesArray);
        // Flatten the array of task objects into a single array of invoices
        this.invoices = taskInvoicesArray.flatMap((taskWithInvoices: any) => {
          if (Array.isArray(taskWithInvoices.invoices)) {
            return taskWithInvoices.invoices.map((invoice: any) => ({
              id: invoice.id,
              amount: invoice.amount,
              emissionDate: new Date(invoice.emissionDate),
              justificationPath: invoice.justificationPath,
              materialId: invoice.materialId,
              projectId: invoice.projectId,
              state: invoice.state,
              taskId: taskWithInvoices.id,
              userId: invoice.userId,
              task: {
                id: taskWithInvoices.id,
                title: taskWithInvoices.description || 'No Title'
              }
            }));
          } else {
            console.warn('Expected an array of invoices, but got:', taskWithInvoices.invoices);
            return [];
          }
        });

        // console.log("Invoices fetched for tasks:", this.invoices);
      },
      (error) => {
        console.error('Error fetching invoices for tasks:', error);
      }
    );
  }


  fetchTasks(): void {
    this.taskService.getAssignedTasks().subscribe(
      (tasks: any[]) => {
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
        password: this.profileForm.value.password
      };

      if (this.architect.id != null) {
        this.userService.updateCurrentUserProfile(this.architect.id, updatedUser).subscribe(
          (user: User) => {
            this.architect = user;
            this.profileForm.patchValue({
              password: ''
            });
            Swal.fire({
              icon: 'success',
              title: 'Profile Updated!',
              text: 'Your profile has been updated successfully.',
              confirmButtonColor: '#3b82f6',
            });
          },
          (error) => {
            console.error('Error updating profile:', error);
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: error.error?.message || 'An error occurred while updating your profile.',
              confirmButtonColor: '#ef4444', // Red color
            });
          }
        );
      }
    }
  }


  renderIcon(iconDefinition: any, classes: string = ''): string {
    return icon(iconDefinition, { classes }).html[0];
  }

  viewTaskInvoices(taskId: number): void {
    this.taskService.getTaskWithInvoices(taskId).subscribe(
      (taskWithInvoices: any) => {
        console.log('Task Invoices:', taskWithInvoices);

        // Helper function to get status badge styling
        const getStatusBadge = (status: string) => {
          const statusMap: Record<string, { color: string, icon: any }> = {
            'FINISHED': { color: 'bg-green-100 text-green-800', icon: faCheckCircle },
            'IN_PROGRESS': { color: 'bg-yellow-100 text-yellow-800', icon: faClock },
            'NOT_STARTED': { color: 'bg-red-100 text-red-800', icon: faExclamationCircle },
            'default': { color: 'bg-gray-100 text-gray-800', icon: faFileAlt }
          };

          const statusStyle = statusMap[status] || statusMap['default'];
          return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.color}">
                    ${this.renderIcon(statusStyle.icon, 'mr-1')}
                    ${status}
                  </span>`;
        };

        // Helper function for invoice state badge
        const getInvoiceStateBadge = (state: string) => {
          const stateMap: Record<string, { color: string, icon: any }> = {
            'PAID': { color: 'bg-green-100 text-green-800', icon: faCheckCircle },
            'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: faClock },
            'OVERDUE': { color: 'bg-red-100 text-red-800', icon: faExclamationCircle },
            'default': { color: 'bg-gray-100 text-gray-800', icon: faFileInvoice }
          };

          const stateStyle = stateMap[state] || stateMap['default'];
          return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stateStyle.color}">
                    ${this.renderIcon(stateStyle.icon, 'mr-1')}
                    ${state}
                  </span>`;
        };

        const invoicesHtml = taskWithInvoices.invoices.map((invoice: any) => `
          <div class="invoice-item bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center mb-2">
                  ${this.renderIcon(faFileInvoice, 'text-indigo-500 mr-2')}
                  <span class="font-medium">Inv-${invoice.id || 'N/A'}</span>
                </div>
                <div class="flex items-center text-gray-600 mb-1">
                  ${this.renderIcon(faDollarSign, 'text-gray-500 mr-1')}
                  <span class="font-semibold text-gray-800">${invoice.amount}</span>
                </div>
                <div class="flex items-center text-gray-600 mb-1">
                  ${this.renderIcon(faCalendar, 'text-gray-500 mr-1')}
                  <span>${invoice.emissionDate}</span>
                </div>
              </div>
              <div>
                ${getInvoiceStateBadge(invoice.state)}
              </div>
            </div>
          </div>
        `).join('');

        Swal.fire({
          title: `<div class="flex items-center">${this.renderIcon(faReceipt, 'text-indigo-500 mr-2')}<strong>Task Invoices</strong></div>`,
          icon: 'info',
          html: `
          <div class="task-info bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <p class="flex items-center text-gray-700 mb-2">
                  ${this.renderIcon(faFileAlt, 'text-gray-600 mr-2')}
                  <span class="text-sm font-medium">Description:</span>
                </p>
                <p class="ml-6 text-gray-800">${taskWithInvoices.description}</p>
              </div>
              <div>
                <p class="flex items-center text-gray-700 mb-2">
                  ${this.renderIcon(faExclamationCircle, 'text-gray-600 mr-2')}
                  <span class="text-sm font-medium">Status:</span>
                </p>
                <div class="ml-6">${getStatusBadge(taskWithInvoices.status)}</div>
              </div>
              <div>
                <p class="flex items-center text-gray-700 mb-2">
                  ${this.renderIcon(faCreditCard, 'text-gray-600 mr-2')}
                  <span class="text-sm font-medium">Budget Limit:</span>
                </p>
                <p class="ml-6 font-semibold text-gray-800">$${taskWithInvoices.budgetLimit}</p>
              </div>
              <div>
                <p class="flex items-center text-gray-700 mb-2">
                  ${this.renderIcon(faDollarSign, 'text-gray-600 mr-2')}
                  <span class="text-sm font-medium">Total Paid:</span>
                </p>
                <p class="ml-6 font-semibold ${parseFloat(taskWithInvoices.totalPaid) > parseFloat(taskWithInvoices.budgetLimit) ? 'text-red-600' : 'text-green-600'}">
                  $${taskWithInvoices.totalPaid}
                </p>
              </div>
            </div>
          </div>
          <div class="invoices-list">
            <div class="flex items-center mb-3">
              ${this.renderIcon(faFileInvoice, 'text-indigo-500 mr-2')}
              <h4 class="text-lg font-medium">Invoices</h4>
            </div>
            <div class="max-h-60 overflow-y-auto pr-1">
              ${invoicesHtml || '<p class="text-gray-500 text-center py-4">No invoices found</p>'}
            </div>
          </div>
          `,
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: `${this.renderIcon(faTimes, 'mr-1')} Close`,
          confirmButtonAriaLabel: 'Close',
          customClass: {
            popup: 'custom-swal-popup max-w-2xl',
            title: 'custom-swal-title text-lg font-semibold text-gray-800',
            htmlContainer: 'custom-swal-html overflow-hidden',
            confirmButton: 'custom-swal-confirm-button bg-indigo-600 hover:bg-indigo-700'
          }
        });
      },
      (error) => {
        console.error('Error fetching task invoices:', error);
        Swal.fire({
          icon: 'error',
          title: `<div class="flex items-center">${this.renderIcon(faExclamationCircle, 'text-red-500 mr-2')}<strong>Error</strong></div>`,
          text: 'Failed to fetch task invoices. Please try again.',
          customClass: {
            popup: 'border border-red-100',
            title: 'text-red-700',
            confirmButton: 'bg-red-600 hover:bg-red-700'
          }
        });
      }
    );
  }

}

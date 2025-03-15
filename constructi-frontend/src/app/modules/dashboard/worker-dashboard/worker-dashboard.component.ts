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
import { icon } from '@fortawesome/fontawesome-svg-core';
import { InvoiceService } from '../../invoice/invoice.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

pdfMake.vfs = pdfFonts.vfs;

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
  selector: 'app-worker-dashboard',
  templateUrl: './worker-dashboard.component.html',
  styleUrls: ['./worker-dashboard.component.css'],
  standalone:false
})
export class WorkerDashboardComponent implements OnInit {
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

  worker: User = {
    id: 0,
    fname: '',
    lname: '',
    cell: '',
    email: '',
    contratType: 'FULL_TIME',
    roleId: 3, 
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
    private projectService: ProjectService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.initProfileForm();
    this.fetchWorkerProfile()
      .then(() => {
        this.fetchTasks();
        this.fetchInvoices();
      })
      .catch((error) => {
        console.error('Error fetching worker profile:', error);
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
      fname: [this.worker.fname, Validators.required],
      lname: [this.worker.lname, Validators.required],
      cell: [this.worker.cell],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  fetchWorkerProfile(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getCurrentUserProfile().subscribe(
        (user: User) => {
          this.worker = user;
          this.initProfileForm();
          resolve();
        },
        (error) => {
          console.error('Error fetching worker profile:', error);
          reject(error);
        }
      );
    });
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

  fetchInvoices(): void {
    if (!this.worker.taskIds || this.worker.taskIds.length === 0) {
      console.log('No tasks assigned to the worker. Skipping invoice fetch.');
      return;
    }

    const invoiceObservables = this.worker.taskIds.map(taskId =>
      this.taskService.getTaskWithInvoices(taskId)
    );

    forkJoin(invoiceObservables).subscribe(
      (taskInvoicesArray: any[]) => {
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
      },
      (error) => {
        console.error('Error fetching invoices for tasks:', error);
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

      if (this.worker.id != null) {
        this.userService.updateCurrentUserProfile(this.worker.id, updatedUser).subscribe(
          (user: User) => {
            this.worker = user;
            this.profileForm.patchValue({
              password: ''
            });
            Swal.fire({
              icon: 'success',
              title: 'Profil Modifié!',
              text: 'Votre profil a été modifié avec succès.',
              confirmButtonColor: '#3b82f6',
            });
          },
          (error) => {
            console.error('Error updating profile:', error);
            Swal.fire({
              icon: 'error',
              title: 'Échec de la mise à jour',
              text: error.error?.message || 'Une erreur est survenue lors de la mise à jour de votre profil.',
              confirmButtonColor: '#ef4444',
            });
          }
        );
      }
    }
  }

  viewTaskInvoices(taskId: number): void {
    this.taskService.getTaskWithInvoices(taskId).subscribe(
      (taskWithInvoices: any) => {
        console.log('Task Invoices:', taskWithInvoices);

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
                  <span class="font-medium">Fact-${invoice.id || 'N/A'}</span>
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
          title: `<div class="flex items-center">${this.renderIcon(faReceipt, 'text-indigo-500 mr-2')}<strong>Factures de la tâche</strong></div>`,
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
                  <span class="text-sm font-medium">Statut:</span>
                </p>
                <div class="ml-6">${getStatusBadge(taskWithInvoices.status)}</div>
              </div>
              <div>
                <p class="flex items-center text-gray-700 mb-2">
                  ${this.renderIcon(faCreditCard, 'text-gray-600 mr-2')}
                    <span class="text-sm font-medium">Budget Limite:</span>
                </p>
                <p class="ml-6 font-semibold text-gray-800">$${taskWithInvoices.budgetLimit}</p>
              </div>
              <div>
                <p class="flex items-center text-gray-700 mb-2">
                  ${this.renderIcon(faDollarSign, 'text-gray-600 mr-2')}
                  <span class="text-sm font-medium">Total Payé:</span>
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
              <h4 class="text-lg font-medium">Factures</h4>
            </div>
            <div class="max-h-60 overflow-y-auto pr-1">
              ${invoicesHtml || '<p class="text-gray-500 text-center py-4">Aucune facture trouvée</p>'}
            </div>
          </div>
          `,
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: `${this.renderIcon(faTimes, 'mr-1')} Fermer`,
          confirmButtonAriaLabel: 'Fermer',
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
          title: `<div class="flex items-center">${this.renderIcon(faExclamationCircle, 'text-red-500 mr-2')}<strong>Erreur</strong></div>`,
          text: 'Échec de la récupération des factures de la tâche. Veuillez réessayer.',
          customClass: {
            popup: 'border border-red-100',
            title: 'text-red-700',
            confirmButton: 'bg-red-600 hover:bg-red-700'
          }
        });
      }
    );
  }

  downloadInvoice(invoiceId: number): void {
    this.invoiceService.downloadInvoice(invoiceId).subscribe(
      (invoice: any) => {
        console.log('Invoice Data:', invoice);
        this.generatePdf(invoice);
      },
      (error) => {
        console.error('Error downloading invoice:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Échec de la récupération de la facture. Veuillez réessayer.',
        });
      }
    );
  }

  async generatePdf(invoice: any): Promise<void> {
    try {
      const docDefinition: TDocumentDefinitions = {
        content: [
          {
            columns: [
              {
                text: 'INVOICE',
                alignment: 'right',
                style: 'header'
              }
            ]
          },
          { canvas: [ { type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 2 } ] },
          { text: '\n' },
          {
            columns: [
              {
                width: 'auto',
                stack: [
                  { text: 'Invoice Details', style: 'subheader' },
                  {
                    columns: [
                      { width: 'auto', text: `Invoice ID: ${invoice.id || 'N/A'}`, margin: [5, 2, 0, 0] }
                    ]
                  },
                  {
                    columns: [
                      { width: 'auto', text: `Emission Date: ${invoice.emissionDate || 'N/A'}`, margin: [5, 2, 0, 0] }
                    ]
                  },
                  {
                    columns: [
                      { width: 'auto', text: `User ID: ${invoice.userId || 'N/A'}`, margin: [5, 2, 0, 0] }
                    ]
                  },
                  {
                    columns: [
                      { width: 'auto', text: `Task ID: ${invoice.taskId || 'N/A'}`, margin: [5, 2, 0, 0] }
                    ]
                  },
                ]
              },
              {
                width: '*',
                stack: [
                  { text: 'Amount', style: 'subheader', alignment: 'right' },
                  { text: `$${invoice.amount || 'N/A'}`, style: 'amount', alignment: 'right' },
                  { text: `Status: ${invoice.state || 'N/A'}`, style: 'status', alignment: 'right' },
                ]
              }
            ]
          },
        ],
        footer: {
          columns: [
            { text: 'Thank you for your business!', alignment: 'center', style: 'footer' }
          ]
        },
        styles: {
          header: {
            fontSize: 28,
            bold: true,
            color: '#2c3e50'
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5] as [number, number, number, number],
            color: '#34495e'
          },
          amount: {
            fontSize: 20,
            bold: true,
            color: '#16a085'
          },
          status: {
            fontSize: 14,
            italics: true,
            color: '#7f8c8d'
          },
          footer: {
            fontSize: 10,
            color: '#7f8c8d',
            margin: [0, 10, 0, 0] as [number, number, number, number],
          }
        },
        defaultStyle: {
          fontSize: 12,
          color: '#333'
        }
      };

      pdfMake.createPdf(docDefinition).download(`invoice_${invoice.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Échec de la génération du PDF. Veuillez réessayer.',
      });
    }
  }

  renderIcon(iconDefinition: any, classes: string = ''): string {
    return icon(iconDefinition, { classes }).html[0];
  }

}

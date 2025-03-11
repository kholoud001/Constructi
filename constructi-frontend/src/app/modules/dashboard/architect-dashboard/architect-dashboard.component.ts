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
import {icon} from '@fortawesome/fontawesome-svg-core';
import {InvoiceService} from '../../invoice/invoice.service';
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
    private projectService: ProjectService,
    private invoiceService: InvoiceService
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
          title: 'Error',
          text: 'Failed to fetch invoice. Please try again.',
        });
      }
    );
  }

  async generatePdf(invoice: any): Promise<void> {
    // Function to convert an image URL to a base64 data URL
    // const fetchImageAsDataURL = async (url: string): Promise<string> => {
    //   const response = await fetch(url);
    //   const blob = await response.blob();
    //   return new Promise((resolve, reject) => {
    //     const reader = new FileReader();
    //     reader.onloadend = () => resolve(reader.result as string);
    //     reader.onerror = reject;
    //     reader.readAsDataURL(blob);
    //   });
    // };

    try {
      // Convert the logo URL to a base64 data URL
      // const logoUrl = 'https://media-hosting.imagekit.io//6a2add728e6e44d0/logo-black.png?Expires=1835622901&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=bBxCKQPMzfwgT8unST5rHsIifcRRIK3EnjtU8CS0kMNtN69IdALPdrWqRRdOLiDSHPLcxNSzNLZS4OPrNayTcmBUzB~5W0IkGsXK5L3E8wnAbhLhfnu3S2hukRJL~XpKoZUvX~L~fmob5fUw5jrmYsvH2~hhnqu2tvuiMfclnuQF2g8g2KQNFIBJPfMZTeOlyk06eRRRv00rbnB6LOwlLEIWkRQi2rFaEO1KSxb~sNVG62ica2mCsvMNozqBwjTWzortH1icmlhE9m72HwRabjO6CAexLd7-dgbjlofeFmG2SgDGmahh2F73Q7w4jfpGvT8EHcfwifbeXkfW2JCOlA__';
      // const logoDataURL = await fetchImageAsDataURL(logoUrl);

      // Define icons as data URLs (you may need to replace these with actual icon data URLs)
      // const icons = {
      //   invoice: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABCUlEQVR4nO2UQU7DMBBF3wVYcANOAeIQrOAMbOAKHIkjcJAKLsGSLhFbJCpxCaGq6gVgAWKDxtJYsT0Zx1nQv7Q0lv/z52fGCfwpgCmwBHbAJ6DAHngC5gM5Y2AFXAI3wAb4Ap6BKXBu688t+JuJXTsGHhK5GyJUgSKRXAEPwMI8RXAFvDrJH8C1E78DXpyNXoErgGsnuXLi3LwKYGZJe+AcmAEHk1sCJ8A9cLD1sxjAyAmqgBvg1vQN8G5yC+A0BeBZ9G7aKXDmtKlPMUvNi3rwDLw57VXzol70aT6oB2MBhgIkm/+/AUK/6D8A+OZjAZKDNhZAA0wGAQQXjQVoTK4ZzPkGCKcXxGOutecAAAAASUVORK5CYII=',
      //   calendar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA2klEQVR4nO2UQQrCMBBFcwc9g3oE8SbqUhFX4lVE8CCC4ELduBc8guhSPIDoRqEmMGAkTZNJU3DhLNPkvzzm/0CVlBLQAGbABjgBV2APLIAu8BJ5DcwBPXAGbsAWGALVogKgBaQ5MQHqvxhXgWHO4SPQyTGuAOOChrP/GZt3n8/ZEL0Cc2VjAzjKmk+hCHgHekrGfeAuAStN4wh4ABMl477MRUArGiNgJGuekjHwlLmIjxHwkjVNxsCnFIAWGRcxzgOIL6UAtMjYFAFoFxkXMU4y/v8Bwiv6BYBvXgpAMi4FkGScFOADFzgXQIbf8AQAAAAASUVORK5CYII=',
      //   user: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABWUlEQVR4nO2UPUsDQRCGn0MEESxE/AEWdoKFjYVgYeGPsLESbPwLNhYiFlrZCYKFhYUgFhYiCoqIH6hRiGgMaMQvxGIHFuZgvdxe7mRBfGG53X1n3p2ZnYX/BqAGGAZ2gCxwB1wDu8AoUF2OfxMwADwBvgdPwDhQWYp5FbAI5Eu8vADMAbVhzHuAhxLGLrLA1JfmLcBNGcYuboEO37wDuI/AfAjzHPUh5vXARQTGLs4BBt+8GziMwXwfqPLMG4GzGMxdnAKNnnkbcB2juQWWPfM6IB2jeTqIqQrYitHcAhOeeTWwGqO5BZY887IvWQALnnkFsByDsQWWPPMY3+AXMOuZx/UNfgIznnmcSTYUMI/yJxsOmEeV5GQR8yiSvFfEvNwk7xUxLzXJe0XMwyZ5r4R52CTvlTD3k7wXwjzTBmyUYJwCWsMk+d8D+AA+gDfgGdgDhoDKb2v+W/EO8QdHzVvgE/UAAAAASUVORK5CYII=',
      //   task: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nO2UQQrCMBBFcwc9g3oE8SbqUhFX4lVE8CCC4ELduBc8guhSPIDoRqEmMGAkTZNJU3DhLNPkvzzm/0CVlBLQAGbABjgBV2APLIAu8BJ5DcwBPXAGbsAWGALVogKgBaQ5MQHqvxhXgWHO4SPQyTGuAOOChrP/GZt3n8/ZEL0Cc2VjAzjKmk+hCHgHekrGfeAuAStN4wh4ABMl477MRUArGiNgJGuekjHwlLmIjxHwkjVNxsCnFIAWGRcxzgOIL6UAtMjYFAFoFxkXMU4y/v8Bwiv6BYBvXgpAMi4FkGScFOADFzgXQIbf8AQAAAAASUVORK5CYII='
      // };

      const docDefinition: TDocumentDefinitions = {
        content: [
          {
            columns: [
              // {
              //   image: logoDataURL, // Use the base64 data URL here
              //   width: 150,
              // },
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
                      // { width: 20, image: icons.invoice, fit: [20, 20] },
                      { width: 'auto', text: `Invoice ID: ${invoice.id || 'N/A'}`, margin: [5, 2, 0, 0] }
                    ]
                  },
                  {
                    columns: [
                      // { width: 20, image: icons.calendar, fit: [20, 20] },
                      { width: 'auto', text: `Emission Date: ${invoice.emissionDate || 'N/A'}`, margin: [5, 2, 0, 0] }
                    ]
                  },
                  {
                    columns: [
                      // { width: 20, image: icons.user, fit: [20, 20] },
                      { width: 'auto', text: `User ID: ${invoice.userId || 'N/A'}`, margin: [5, 2, 0, 0] }
                    ]
                  },
                  {
                    columns: [
                      // { width: 20, image: icons.task, fit: [20, 20] },
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
        title: 'Error',
        text: 'Failed to generate PDF. Please try again.',
      });
    }
  }

}

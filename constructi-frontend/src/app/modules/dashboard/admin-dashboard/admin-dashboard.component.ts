import { Component, OnInit } from "@angular/core";
import {
  faProjectDiagram,
  faTasks,
  faUsers,
  faPlus,
  faUserPlus,
  faBoxes,
  faTruck,
  faEye,
  faEdit,
  faTrash, faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import {ProjectService} from '../../project/project.service';
import {MaterialService} from '../../material/material.service';
import {UserService} from '../../user/user.service';
import {TaskService} from '../../task/task.service';
import {ProviderService} from '../../provider/provider.service';
import {InvoiceService} from '../../invoice/invoice.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
  standalone: false,
})
export class AdminDashboardComponent implements OnInit {
  faProjectDiagram = faProjectDiagram;
  faTasks = faTasks;
  faUsers = faUsers;
  faPlus = faPlus;
  faUserPlus = faUserPlus;
  faBoxes = faBoxes;
  faTruck = faTruck;
  faEye = faEye;
  faEdit = faEdit;
  faTrash = faTrash;
  protected readonly faFileInvoice = faFileInvoice;



  recentProjects: any[] = [];
  materials: any[] = [];
  users: any[] = [];
  tasks: any[] = [];
  providers: any[] = [];
  invoices: any[] = [];
  totalProjects: number = 0;
  totalTasks: number = 0;
  totalUsers:number=0;
  totalFinishedTasks: number=0;

  constructor(
    private projectService: ProjectService,
    private materialService: MaterialService,
    private userService: UserService,
    private taskService: TaskService,
    private providerService: ProviderService,
    private invoiceService: InvoiceService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.projectService.getProjects().subscribe((projects) => {
      this.totalProjects = projects.length;

      this.recentProjects = projects.map(project => {
        let state = 'NOT_STARTED';

        if (project.progress > 0 && project.progress < 100) {
          state = 'IN_PROGRESS';
        } else if (project.progress === 100) {
          state = 'FINISHED';
        }

        return { ...project, state };
      }).slice(0, 4);
    });


    this.taskService.getAllTasks().subscribe((tasks) => {
      this.totalTasks = tasks.length;
      this.tasks = tasks.filter(task => task.status === "FINISHED");
        this.totalFinishedTasks = this.tasks.length;
         this.tasks = tasks.slice(0, 4);

    });


    this.materialService.getAllMaterials().subscribe((materials) => {
      this.materials = materials;
    });

    this.userService.getUsers().subscribe((users) => {
      this.totalUsers = users.filter(user => user.active).length;
    });


    this.taskService.getAllTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });

    this.providerService.getAllProviders().subscribe((providers) => {
      this.providers = providers;
    });

    this.invoiceService.getMyInvoices(1).subscribe((invoices) => { 
      this.invoices = invoices;
    });
  }

  viewProject(id: number): void {
    this.router.navigate(['/projects', id, 'details']);
  }

  editProject(id: number): void {
    this.router.navigate(['/projects', id, 'edit']);
  }

  deleteProject(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Vous ne pourrez pas revenir en arrière !', 
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.deleteProject(id).subscribe({
          next: () => {
            this.recentProjects = this.recentProjects.filter(project => project.id !== id);
            this.totalProjects--;
            Swal.fire('Supprimé !', 'Le projet a été supprimé.', 'success');
          },
          error: (err) => {
            console.error('Erreur lors de la suppression du projet:', err);
            Swal.fire('Erreur !', 'Échec de la suppression du projet.', 'error');
          },
        });
      }
    });
  }

  viewTask(id: number): void {
    this.router.navigate(['/tasks', 'detail', id]);
  }

  editTask(id: number): void {
    this.router.navigate(['/tasks', 'edit', id]);
  }

  deleteTask(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Vous ne pourrez pas revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(id).subscribe({
          next: () => {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.totalTasks--;
            Swal.fire('Supprimé !', 'La tâche a été supprimée.', 'success');
          },
          error: (err) => {
            console.error('Erreur lors de la suppression de la tâche:', err);
            Swal.fire('Erreur !', 'Échec de la suppression de la tâche.', 'error');
          },
        });
      }
    });
  }



  viewTaskInvoices(taskId: number): void {
    this.router.navigate(['/tasks', 'task-payment-details', taskId]);
  }
}

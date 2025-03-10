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
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {ProjectService} from '../../project/project.service';
import {MaterialService} from '../../material/material.service';
import {UserService} from '../../user/user.service';
import {TaskService} from '../../task/task.service';
import {ProviderService} from '../../provider/provider.service';
import {InvoiceService} from '../../invoice/invoice.service';


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


  recentProjects: any[] = [];
  materials: any[] = [];
  users: any[] = [];
  tasks: any[] = [];
  providers: any[] = [];
  invoices: any[] = [];
  totalProjects: number = 0;
  totalTasks: number = 0;
  totalUsers:number=0;

  constructor(
    private projectService: ProjectService,
    private materialService: MaterialService,
    private userService: UserService,
    private taskService: TaskService,
    private providerService: ProviderService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.projectService.getProjects().subscribe((projects) => {
      this.totalProjects = projects.length;
      this.recentProjects = projects.slice(0, 4);
    });

    this.taskService.getAllTasks().subscribe((tasks) => {
      this.totalTasks = tasks.length;
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

    this.invoiceService.getMyInvoices(1).subscribe((invoices) => { // Replace 1 with the actual user ID
      this.invoices = invoices;
    });
  }


  viewProject(id: number): void {
    console.log(`Viewing project with ID: ${id}`);
    // Implement navigation logic
  }

  editProject(id: number): void {
    console.log(`Editing project with ID: ${id}`);
    // Implement edit logic
  }

  deleteProject(id: number): void {
    console.log(`Deleting project with ID: ${id}`);
    // Implement delete logic with confirmation
  }

  editMaterial(id: number): void {
    console.log(`Editing material with ID: ${id}`);
    // Implement edit logic
  }

  deleteMaterial(id: number): void {
    console.log(`Deleting material with ID: ${id}`);
    // Implement delete logic with confirmation
  }

  viewWorkerInvoices(): void {
    console.log("Viewing worker invoices");
    // Implement navigation logic
  }

  viewProviderInvoices(): void {
    console.log("Viewing provider invoices");
    // Implement navigation logic
  }

  viewProjectBudgets(): void {
    console.log("Viewing project budgets");
    // Implement navigation logic
  }

  viewExpenseAnalysis(): void {
    console.log("Viewing expense analysis");
    // Implement navigation logic
  }

  viewTask(id: number) {

  }

  editTask(id: number) {

  }

  deleteTask(id: number) {

  }


}

import { Component } from "@angular/core"
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
} from "@fortawesome/free-solid-svg-icons"

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
  standalone:false,
})
export class AdminDashboardComponent {
  // Icons
  faProjectDiagram = faProjectDiagram
  faTasks = faTasks
  faUsers = faUsers
  faPlus = faPlus
  faUserPlus = faUserPlus
  faBoxes = faBoxes
  faTruck = faTruck
  faEye = faEye
  faEdit = faEdit
  faTrash = faTrash

  // Recent projects with progress
  recentProjects = [
    {
      id: 1,
      name: "Résidence Les Oliviers",
      progress: 75,
      status: "En cours",
    },
    {
      id: 2,
      name: "Centre Commercial Atlantis",
      progress: 30,
      status: "En cours",
    },
    {
      id: 3,
      name: "Rénovation Hôtel de Ville",
      progress: 10,
      status: "En attente",
    },
  ]

  // Materials
  materials = [
    { id: 1, name: "Béton armé", type: "Matériel", quantity: 500 },
    { id: 2, name: "Acier de construction", type: "Matériel", quantity: 1200 },
    { id: 3, name: "Équipe Alpha", type: "Main-d'œuvre", quantity: 8 },
  ]

  // Admin actions
  openCreateProjectModal(): void {
    console.log("Opening create project modal")
    // Implement modal opening logic
  }

  openAddUserModal(): void {
    console.log("Opening add user modal")
    // Implement modal opening logic
  }

  openAddMaterialModal(): void {
    console.log("Opening add material modal")
    // Implement modal opening logic
  }

  openAddProviderModal(): void {
    console.log("Opening add provider modal")
    // Implement modal opening logic
  }

  viewProject(id: number): void {
    console.log(`Viewing project with ID: ${id}`)
    // Implement navigation logic
  }

  editProject(id: number): void {
    console.log(`Editing project with ID: ${id}`)
    // Implement edit logic
  }

  deleteProject(id: number): void {
    console.log(`Deleting project with ID: ${id}`)
    // Implement delete logic with confirmation
  }

  editMaterial(id: number): void {
    console.log(`Editing material with ID: ${id}`)
    // Implement edit logic
  }

  deleteMaterial(id: number): void {
    console.log(`Deleting material with ID: ${id}`)
    // Implement delete logic with confirmation
  }

  viewWorkerInvoices(): void {
    console.log("Viewing worker invoices")
    // Implement navigation logic
  }

  viewProviderInvoices(): void {
    console.log("Viewing provider invoices")
    // Implement navigation logic
  }

  viewProjectBudgets(): void {
    console.log("Viewing project budgets")
    // Implement navigation logic
  }

  viewExpenseAnalysis(): void {
    console.log("Viewing expense analysis")
    // Implement navigation logic
  }
}


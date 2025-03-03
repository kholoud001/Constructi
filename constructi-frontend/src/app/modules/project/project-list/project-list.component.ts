import { Component, type OnInit } from "@angular/core"
import Swal from "sweetalert2"
import {ProjectService} from '../project.service';
import {Router} from '@angular/router';
import {faCalendar} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.css"],
  standalone:false
})
export class ProjectListComponent implements OnInit {
  projects: any[] = []
  paginatedProjects: any[] = []
  currentPage = 1
  itemsPerPage = 6
  totalPages = 1
  loading = true

  faCalendar=faCalendar;

  constructor(
    private projectService: ProjectService,
    protected router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProjects()
  }

  loadProjects(): void {
    this.loading = true
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data
        this.totalPages = Math.ceil(this.projects.length / this.itemsPerPage)
        this.updatePaginatedProjects()
        this.loading = false
      },
      error: (error) => {
        console.error("Error fetching projects:", error)
        this.loading = false
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load projects. Please try again.",
          confirmButtonColor: "#dc2626",
          heightAuto: false,
          customClass: {
            popup: "rounded-xl",
            confirmButton: "px-4 py-2 text-sm font-medium text-white rounded-lg",
          },
        })
      },
    })
  }

  viewProject(id: number): void {
    this.router.navigate(["/projects", id, "details"])
  }

  editProject(id: number): void {
    this.router.navigate(["/projects", id, "edit"])
  }

  deleteProject(id: number): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this project!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      heightAuto: false,
      customClass: {
        popup: "rounded-xl",
        confirmButton: "px-4 py-2 text-sm font-medium text-white rounded-lg",
        cancelButton: "px-4 py-2 text-sm font-medium rounded-lg",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.deleteProject(id).subscribe({
          next: () => {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "The project has been deleted.",
              confirmButtonColor: "#16a34a",
              heightAuto: false,
              customClass: {
                popup: "rounded-xl",
                confirmButton: "px-4 py-2 text-sm font-medium text-white rounded-lg",
              },
            })
            this.loadProjects()
          },
          error: (error) => {
            console.error("Error deleting project:", error)
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to delete project. Please try again.",
              confirmButtonColor: "#dc2626",
              heightAuto: false,
              customClass: {
                popup: "rounded-xl",
                confirmButton: "px-4 py-2 text-sm font-medium text-white rounded-lg",
              },
            })
          },
        })
      }
    })
  }

  updatePaginatedProjects(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    this.paginatedProjects = this.projects.slice(startIndex, endIndex)
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--
      this.updatePaginatedProjects()
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++
      this.updatePaginatedProjects()
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page
      this.updatePaginatedProjects()
    }
  }

  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = []
    const maxPagesToShow = 5

    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      const leftBound = Math.max(2, this.currentPage - 1)
      const rightBound = Math.min(this.totalPages - 1, this.currentPage + 1)

      if (leftBound > 2) {
        pages.push("...")
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i)
      }

      if (rightBound < this.totalPages - 1) {
        pages.push("...")
      }

      pages.push(this.totalPages)
    }

    return pages
  }

  getStatusClass(status: string): string {
    switch (status.toUpperCase()) {
      case "FINISHED":
        return "bg-green-100 text-green-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "NOT_STARTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  getProgressColor(progress: number): string {
    if (progress < 25) return "#ef4444"
    if (progress < 50) return "#f97316"
    if (progress < 75) return "#eab308"
    return "#22c55e"
  }

  
}


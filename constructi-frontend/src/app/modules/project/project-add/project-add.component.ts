import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProjectService } from "../project.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-project-add",
  templateUrl: "./project-add.component.html",
  styleUrls: ["./project-add.component.css"],
  standalone: false,
})
export class ProjectAddComponent {
  projectForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    protected router: Router,
  ) {
    this.initForm();
  }

  private initForm(): void {
    const today = new Date().toISOString().split("T")[0];

    this.projectForm = this.fb.group(
      {
        name: ["", [Validators.required, Validators.maxLength(100)]],
        description: ["", [Validators.maxLength(255)]],
        startDate: [today, [Validators.required]],
        endDate: ["", [Validators.required]],
        state: ["", [Validators.required]],
        initialBudget: ["", [Validators.required, Validators.min(0.01)]],
      },
      { validators: this.dateValidator },
    );
  }

  // Date Validator
  private dateValidator(group: FormGroup): { [key: string]: any } | null {
    const start = group.get("startDate")?.value;
    const end = group.get("endDate")?.value;

    if (start && end && new Date(end) <= new Date(start)) {
      return { dateInvalid: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.projectForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const projectData = this.projectForm.value;

      projectData.startDate = new Date(projectData.startDate).toISOString();
      projectData.endDate = new Date(projectData.endDate).toISOString();

      this.projectService.createProject(projectData).subscribe({
        next: () => {
          this.isSubmitting = false;
          Swal.fire({
            icon: "success", 
            title: "Succès !",
            text: "Le projet a été créé avec succès.",
            confirmButtonColor: "#16a34a",
            heightAuto: false,
            customClass: {
              popup: "rounded-xl",
              confirmButton: "px-4 py-2 text-sm font-medium text-white rounded-lg",
            },
          }).then(() => {
            this.router.navigate(["/projects"]);
          });
        },
        error: (error) => {
          this.isSubmitting = false;
          let errorMessage = "Échec de la création du projet. Veuillez réessayer.";

          if (error.error?.message) {
            errorMessage = error.error.message;
          }

          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: errorMessage,
            confirmButtonColor: "#dc2626",
            heightAuto: false,
            customClass: {
              popup: "rounded-xl",
              confirmButton: "px-4 py-2 text-sm font-medium text-white rounded-lg",
            },
          });
        },
      });
    } else {
      // Marquer tous les champs comme touchés pour déclencher les messages de validation
      Object.keys(this.projectForm.controls).forEach((key) => {
        const control = this.projectForm.get(key);
        control?.markAsTouched();
      });

      Swal.fire({
        icon: "error",
        title: "Formulaire Invalide",
        text: "Veuillez vérifier tous les champs requis et réessayer.",
        confirmButtonColor: "#dc2626",
        heightAuto: false,
        customClass: {
          popup: "rounded-xl",
          confirmButton: "px-4 py-2 text-sm font-medium text-white rounded-lg",
        },
      });
    }
  }
}

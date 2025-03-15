import { Component,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { ActivatedRoute, Router } from "@angular/router"
import  { ProviderRequestDTO, ProviderService } from "../provider.service"
import {
  faUser,
  faPhone,
  faLocationDot,
  faSave,
  faArrowLeft,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"
import Swal from "sweetalert2"

@Component({
  selector: "app-provider-form",
  templateUrl: "./provider-form.component.html",
  styleUrls: ["./provider-form.component.css"],
  standalone: false,
})
export class ProviderFormComponent implements OnInit {
  providerForm: FormGroup
  isEditMode = false
  providerId: number | null = null
  isSubmitting = false

  faUser = faUser
  faPhone = faPhone
  faLocationDot = faLocationDot
  faSave = faSave
  faArrowLeft = faArrowLeft
  faExclamationTriangle = faExclamationTriangle

  constructor(
    private fb: FormBuilder,
    private providerService: ProviderService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.providerForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      phone: ["", [Validators.required, Validators.pattern(/^\+?[0-9\s\-$$$$]{8,20}$/)]],
      address: ["", [Validators.required, Validators.minLength(5)]],
    })
  }

  ngOnInit(): void {
    this.providerId = this.route.snapshot.params["id"]
    if (this.providerId) {
      this.isEditMode = true
      this.loadProviderData()
    }
  }

  loadProviderData(): void {
    Swal.fire({
      title: "Loading...",
      didOpen: () => {
        Swal.showLoading()
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
    })

    this.providerService.getProviderById(this.providerId!).subscribe({
      next: (provider) => {
        this.providerForm.patchValue(provider)
        Swal.close()
      },
      error: (error) => {
        console.error("Error loading provider:", error)
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Erreur lors du chargement des données du fournisseur. Veuillez réessayer.",
          confirmButtonText: "OK",
        })
      },
    })
  }

  onSubmit(): void {
    if (this.providerForm.valid) {
      this.isSubmitting = true

      Swal.fire({
        title: this.isEditMode ? "Mise à jour du Fournisseur..." : "Création du Fournisseur...",
        didOpen: () => {
          Swal.showLoading()
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
      })

      const providerData: ProviderRequestDTO = this.providerForm.value

      if (this.isEditMode && this.providerId) {
        this.providerService.updateProvider(this.providerId, providerData).subscribe({
          next: () => {
            this.isSubmitting = false
            Swal.fire({
              icon: "success",
              title: "Succès!",
              text: "Fournisseur mis à jour avec succès",
              confirmButtonText: "OK",
            }).then(() => {
              this.router.navigate(["/providers"])
            })
          },
          error: (error) => {
            this.isSubmitting = false
            console.error("Error updating provider:", error)
            Swal.fire({ 
              icon: "error",
              title: "Erreur",
              text: "Erreur lors de la mise à jour du fournisseur. Veuillez réessayer.",
              confirmButtonText: "OK",
            })
          },
        })
      } else {
        this.providerService.createProvider(providerData).subscribe({
          next: () => {
            this.isSubmitting = false
            Swal.fire({ 
              icon: "success",
              title: "Succès!",
              text: "Fournisseur créé avec succès",
              confirmButtonText: "OK",
            }).then(() => {
              this.router.navigate(["/providers"])
            })
          },
          error: (error) => {
            this.isSubmitting = false
            console.error("Error creating provider:", error)
            Swal.fire({
              icon: "error",
              title: "Erreur",
              text: "Erreur lors de la création du fournisseur. Veuillez réessayer.",
              confirmButtonText: "OK",
            })
          },
        })
      }
    } else {
      this.markFormGroupTouched(this.providerForm)

      Swal.fire({
        icon: "warning",
        title: "Erreur de validation",
        text: "Veuillez remplir tous les champs requis correctement.",
        confirmButtonText: "OK",
      })
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup)
      }
    })
  }

  goBack(): void {
    this.router.navigate(["/providers"])
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.providerForm.get(controlName)
    return !!(control && control.touched && control.hasError(errorName))
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.providerForm.get(controlName)
    return !!(control && control.touched && control.invalid)
  }

  isControlValid(controlName: string): boolean {
    const control = this.providerForm.get(controlName)
    return !!(control && control.touched && control.valid)
  }
}


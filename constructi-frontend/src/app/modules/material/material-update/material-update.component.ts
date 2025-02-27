import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService, MaterialResponseDTO, MaterialRequestDTO, ProviderResponseDTO } from '../material.service';
import Swal from 'sweetalert2';
import {
  faBox,
  faSave,
  faArrowLeft,
  faCoins,
  faBoxes,
  faWarehouse,
  faBuilding,
  faProjectDiagram
} from '@fortawesome/free-solid-svg-icons';
import {ProjectService} from '../../project/project.service';

@Component({
  selector: 'app-material-update',
  standalone: false,
  templateUrl: './material-update.component.html',
  styleUrls: ['./material-update.component.css']
})
export class MaterialUpdateComponent implements OnInit {
  materialForm!: FormGroup;
  loading = false;
  providers: ProviderResponseDTO[] = [];
  projects: any[] = [];
  materialId!: number;
  material!: MaterialResponseDTO;

  faBox = faBox;
  faSave = faSave;
  faArrowLeft = faArrowLeft;
  faCoins = faCoins;
  faBoxes = faBoxes;
  faWarehouse = faWarehouse;
  faBuilding = faBuilding;
  faProjectDiagram = faProjectDiagram;

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.materialForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      priceUnit: [null, [Validators.required, Validators.min(0)]],
      providerId: ['', Validators.required],
      projectId: ['', Validators.required] // Remove Validators.min(1) for select input
    });

    this.materialId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.materialId) {
      this.loadMaterial(this.materialId);
    }
    this.loadProviders();
    this.loadProjects();
  }

  loadMaterial(id: number): void {
    this.materialService.getMaterialById(id).subscribe({
      next: (data) => {
        this.material = data;
        this.materialForm.patchValue({
          name: data.name,
          quantity: data.quantity,
          priceUnit: data.priceUnit,
          providerId: data.providerId,
          projectId: data.projectId
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement du matériel :', error);
        Swal.fire('Erreur', 'Impossible de charger le matériel', 'error');
      }
    });
  }

  loadProviders(): void {
    this.materialService.getAllProviders().subscribe({
      next: (data) => {
        this.providers = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des fournisseurs :', error);
        Swal.fire('Erreur', 'Impossible de charger la liste des fournisseurs', 'error');
      }
    });
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data; // Store projects in the array
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets :', error);
        Swal.fire('Erreur', 'Impossible de charger la liste des projets', 'error');
      }
    });
  }

  onSubmit(): void {
    if (this.materialForm.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir correctement tous les champs.', 'error');
      return;
    }
    this.loading = true;
    const updatedMaterial: MaterialRequestDTO = this.materialForm.value;
    this.materialService.updateMaterial(this.materialId, updatedMaterial).subscribe({
      next: (data) => {
        Swal.fire('Succès', 'Le matériel a été mis à jour avec succès.', 'success').then(() => {
          this.router.navigate(['/materials']);
        });
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du matériel :', error);
        Swal.fire('Erreur', 'Une erreur est survenue lors de la mise à jour du matériel.', 'error');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/materials']);
  }

  // Getters pour accéder aux contrôles dans le template
  get name() {
    return this.materialForm.get('name');
  }
  get quantity() {
    return this.materialForm.get('quantity');
  }
  get priceUnit() {
    return this.materialForm.get('priceUnit');
  }
  get providerId() {
    return this.materialForm.get('providerId');
  }
  get projectId() {
    return this.materialForm.get('projectId');
  }
}

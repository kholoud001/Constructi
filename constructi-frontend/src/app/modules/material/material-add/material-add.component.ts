import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialService, ProviderResponseDTO } from '../material.service';
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
  selector: 'app-material-add',
  templateUrl: './material-add.component.html',
  styleUrls: ['./material-add.component.css'],
  standalone: false
})
export class MaterialAddComponent implements OnInit {
  materialForm!: FormGroup;
  loading = false;
  providers: ProviderResponseDTO[] = [];
  projects: any[] = [];

  // Icons
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.materialForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      priceUnit: ['', [Validators.required, Validators.min(0)]],
      providerId: ['', [Validators.required]],
      projectId: ['', [Validators.required]]
    });

    this.loadProviders();
    this.loadProjects(); // Load projects on component initialization
  }

  private loadProviders(): void {
    this.materialService.getAllProviders().subscribe({
      next: (data) => {
        this.providers = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des fournisseurs:', err);
      }
    });
  }

  private loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data; 
      },
      error: (err) => {
        console.error('Erreur lors du chargement des projets:', err);
      }
    });
  }

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

  goBack(): void {
    this.router.navigate(['/materials']);
  }

  onSubmit(): void {
    if (this.materialForm.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir correctement tous les champs.', 'error');
      return;
    }

    this.loading = true;

    this.materialService.createMaterial(this.materialForm.value).subscribe({
      next: () => {
        Swal.fire('Succès', 'Matériel ajouté avec succès.', 'success').then(() => {
          this.router.navigate(['/materials']);
        });
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du matériel:', err);
        Swal.fire('Erreur', 'Une erreur est survenue lors de l\'ajout du matériel.', 'error');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

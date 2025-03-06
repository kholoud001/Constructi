import { Component, type OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router";
import  { ProviderResponseDTO, ProviderService } from "../provider.service"
import {
  faBuilding,
  faPhone,
  faMapMarkerAlt,
  faEnvelope,
  faGlobe,
  faUser,
  faArrowLeft,
  faEdit,
  faSpinner,
  faExclamationTriangle,
  faList,
} from "@fortawesome/free-solid-svg-icons"

@Component({
  selector: "app-provider-detail",
  templateUrl: "./provider-detail.component.html",
  styleUrls: ["./provider-detail.component.css"],
  standalone: false,
})
export class ProviderDetailComponent implements OnInit {
  provider: ProviderResponseDTO | null = null
  isLoading = true

  faBuilding = faBuilding
  faPhone = faPhone
  faMapMarkerAlt = faMapMarkerAlt
  faEnvelope = faEnvelope
  faGlobe = faGlobe
  faUser = faUser
  faArrowLeft = faArrowLeft
  faEdit = faEdit
  faSpinner = faSpinner
  faExclamationTriangle = faExclamationTriangle
  faList = faList

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private providerService: ProviderService,
  ) {}

  ngOnInit(): void {
    this.loadProviderDetails()
  }

  loadProviderDetails(): void {
    const id = this.route.snapshot.params["id"]
    this.isLoading = true

    this.providerService.getProviderById(id).subscribe({
      next: (data) => {
        this.provider = data
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading provider:", error)
        this.isLoading = false
        this.provider = null
      },
    })
  }
}


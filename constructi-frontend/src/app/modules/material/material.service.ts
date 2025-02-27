import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MaterialResponseDTO {
  id: number;
  name: string;
  quantity: number;
  priceUnit: number;
  projectId: number;
  providerId: number;
}

export interface MaterialRequestDTO {
  name: string;
  quantity: number;
  priceUnit: number;
  projectId: number;
  providerId: number;
}

export interface ProviderResponseDTO {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private apiUrl = 'http://localhost:8086/materials';
  private ProviderapiUrl = 'http://localhost:8086/providers';


  constructor(private http: HttpClient) {}

  getAllMaterials(): Observable<MaterialResponseDTO[]> {
    return this.http.get<MaterialResponseDTO[]>(this.apiUrl);
  }

  getMaterialById(id: number): Observable<MaterialResponseDTO> {
    return this.http.get<MaterialResponseDTO>(`${this.apiUrl}/${id}`);
  }

  getMaterialsByProjectId(projectId: number): Observable<MaterialResponseDTO[]> {
    return this.http.get<MaterialResponseDTO[]>(`${this.apiUrl}/project/${projectId}`);
  }

  createMaterial(material: MaterialRequestDTO): Observable<MaterialResponseDTO> {
    return this.http.post<MaterialResponseDTO>(`${this.apiUrl}/add`, material);
  }

  updateMaterial(id: number, material: MaterialRequestDTO): Observable<MaterialResponseDTO> {
    return this.http.put<MaterialResponseDTO>(`${this.apiUrl}/update/${id}`, material);
  }

  deleteMaterial(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' }) as Observable<string>;
  }

  getAllProviders(): Observable<ProviderResponseDTO[]> {
    return this.http.get<ProviderResponseDTO[]>(this.ProviderapiUrl);
  }


}

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

export interface InvoiceResponseDTO {
  id: number;
  amount: number;
  emissionDate: string;
  state: string;
  justificationPath: string;
  userId: number;
  taskId: number;
  materialId: number;
}

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private apiUrl = 'http://localhost:8086/materials';
  private ProviderapiUrl = 'http://localhost:8086/providers';
  private invoiceApiUrl = 'http://localhost:8086/invoices';



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


  getInvoicesByMaterialId(materialId: number): Observable<InvoiceResponseDTO[]> {
    return this.http.get<InvoiceResponseDTO[]>(`${this.invoiceApiUrl}/material/${materialId}`);
  }

  createMaterialInvoice(materialId: number, amount: number, justificationFile: File): Observable<InvoiceResponseDTO> {
    const formData = new FormData();
    formData.append('amount', amount.toString());
    formData.append('justificationFile', justificationFile);

    return this.http.post<InvoiceResponseDTO>(`${this.invoiceApiUrl}/material/${materialId}/create`, formData);
  }

}

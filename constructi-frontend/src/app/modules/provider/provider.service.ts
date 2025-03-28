import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MaterialResponseDTO} from '../material/material.service';
import {environment} from '../../../environments/environment';

export interface ProviderResponseDTO {
  id: number;
  name: string;
  phone: string;
  address: string;
  materials?: MaterialResponseDTO[];
}

export interface ProviderRequestDTO {
  name: string;
  phone: string;
  address: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  private apiUrl = environment.providersApiUrl
  ;


  constructor(private http: HttpClient) {}

  getAllProviders(): Observable<ProviderResponseDTO[]> {
    return this.http.get<ProviderResponseDTO[]>(this.apiUrl);
  }

  getProviderById(id: number): Observable<ProviderResponseDTO> {
    return this.http.get<ProviderResponseDTO>(`${this.apiUrl}/${id}`);
  }

  createProvider(provider: ProviderRequestDTO): Observable<ProviderResponseDTO> {
    return this.http.post<ProviderResponseDTO>(`${this.apiUrl}/add`, provider);
  }

  updateProvider(id: number, provider: ProviderRequestDTO): Observable<ProviderResponseDTO> {
    return this.http.put<ProviderResponseDTO>(`${this.apiUrl}/update/${id}`, provider);
  }

  deleteProvider(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/delete/${id}`, { responseType: 'text' as 'json' });
  }

}

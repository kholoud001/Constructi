import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:8086/invoices';

  constructor(private http: HttpClient) {}

  /**
   * Pay someone and attach justification file
   */
  paySomeone(userId: number, amount: number, justificationFile: File, projectId: number, taskId: number): Observable<any> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('amount', amount.toString());
    formData.append('justificationFile', justificationFile);
    formData.append('projectId', projectId.toString());
    formData.append('taskId', taskId.toString()); // Add taskId

    return this.http.post(`${this.apiUrl}/pay`, formData);
  }
  /**
   * Get invoices for the logged-in user
   */
  getMyInvoices(userId: number): Observable<any> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get(`${this.apiUrl}/my`, { params });
  }

  /**
   * Get invoices for a specific user (Admin only)
   */
  getUserInvoices(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }
  /**
   * Download an invoice by ID
   */
  downloadInvoice1(invoiceId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${invoiceId}`, { responseType: 'blob' });
  }
  downloadInvoice(invoiceId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${invoiceId}`, { responseType: 'json' });
  }



}

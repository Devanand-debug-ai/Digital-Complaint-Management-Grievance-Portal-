import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = 'http://localhost:3000/api/complaints';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createComplaint(complaintData: any): Observable<any> {
    return this.http.post(this.apiUrl, complaintData, { headers: this.getHeaders() });
  }

  getComplaints(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  updateStatus(id: number, status: string, staffId?: number, resolutionNotes?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status, staffId, resolutionNotes }, { headers: this.getHeaders() });
  }

  submitFeedback(id: number, feedback: string, rating: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/feedback`, { feedback, rating }, { headers: this.getHeaders() });
  }

  getAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics`, { headers: this.getHeaders() });
  }
}

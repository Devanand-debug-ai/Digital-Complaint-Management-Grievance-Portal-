import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getStaffList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/staff`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, { headers: this.getHeaders() });
  }

  updateUserRole(id: number, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}/role`, { role }, { headers: this.getHeaders() });
  }

  createStaff(staffData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/staff`, staffData, { headers: this.getHeaders() });
  }

  deleteStaff(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/staff/${id}`, { headers: this.getHeaders() });
  }
}

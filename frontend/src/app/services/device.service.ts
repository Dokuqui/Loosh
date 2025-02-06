import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Device {
  id: number;
  name: string;
  type: string;
  status: boolean;
}

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private apiUrl = 'http://localhost:5095/api/Device';
  private token = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  getDevices(): Observable<Device[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.get<Device[]>(this.apiUrl, { headers });
  }

  getDevice(id: number): Observable<Device> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.get<Device>(`${this.apiUrl}/${id}`, { headers });
  }

  addDevice(device: Device): Observable<Device> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.post<Device>(`${this.apiUrl}`, device, { headers });
  }

  updateDevice(id: number, device: Device): Observable<Device> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.put<Device>(`${this.apiUrl}/${id}`, device, { headers });
  }

  deleteDevice(id: number): Observable<void> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}

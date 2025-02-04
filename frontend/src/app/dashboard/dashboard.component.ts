import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignalRService } from '../signalr/signal-r.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Device {
  id: number;
  name: string;
  type: string;
  status: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [MatToolbarModule, MatCardModule, FormsModule, CommonModule],
})
export class DashboardComponent implements OnInit {
  devices: Device[] = [];

  constructor(
    private http: HttpClient,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    this.fetchDevices();
    this.signalRService.onReceiveMessage((user, message) => {
      console.log(`${user}: ${message}`);
    });
  }

  fetchDevices(): void {
    this.http
      .get<Device[]>('http://localhost:5095/api/Device')
      .subscribe((devices) => {
        this.devices = devices;
      });
  }

  toggleDeviceStatus(device: Device): void {
    device.status = !device.status;
    this.http
      .put(`http://localhost:5095/api/Device/${device.id}`, device)
      .subscribe(() => {
        console.log('Device status updated');
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignalRService } from '../signalr/signal-r.service';

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
      .get<Device[]>('https://localhost:5000/api/device')
      .subscribe((devices) => {
        this.devices = devices;
      });
  }

  toggleDeviceStatus(device: Device): void {
    device.status = !device.status;
    this.http
      .put(`https://localhost:5000/api/device/${device.id}`, device)
      .subscribe(() => {
        console.log('Device status updated');
      });
  }
}

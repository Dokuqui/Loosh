import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../services/signal-r.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Device, DeviceService } from '../services/device.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../auth/auth.service';
import { AddDeviceDialogComponent } from '../add-device-dialog/add-device-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    FormsModule,
    CommonModule,
  ],
})
export class DashboardComponent implements OnInit {
  devices: Device[] = [];
  messages: string[] = [];

  constructor(
    private deviceService: DeviceService,
    private signalRService: SignalRService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchDevices();
    this.signalRService.onReceiveMessage((user: string, message: string) => {
      this.messages.push(`${user}: ${message}`);
    });
  }

  fetchDevices(): void {
    this.deviceService.getDevices().subscribe((devices) => {
      this.devices = devices;
    });
  }

  toggleDeviceStatus(device: Device): void {
    device.status = !device.status;
    this.deviceService.updateDevice(device.id, device).subscribe(() => {
      this.fetchDevices();
      this.signalRService.sendMessage(
        'System',
        `Device ${device.name} toggled to ${device.status ? 'On' : 'Off'}`
      );
    });
  }

  addDevice(name: string, type: string): void {
    const newDevice: Device = { id: 0, name, type, status: false };
    this.deviceService.addDevice(newDevice).subscribe(() => {
      this.fetchDevices();
      this.signalRService.sendMessage('System', `Device ${name} added`);
    });
  }

  deleteDevice(id: number): void {
    this.deviceService.deleteDevice(id).subscribe(() => {
      this.fetchDevices();
      this.signalRService.sendMessage('System', `Device ${id} deleted`);
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openAddDeviceDialog(): void {
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      height: 'auto',
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addDevice(result.name, result.type);
      }
    });
  }

}

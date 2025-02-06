// src/app/components/add-device-dialog/add-device-dialog.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-add-device-dialog',
  templateUrl: './add-device-dialog.component.html',
  styleUrls: ['./add-device-dialog.component.scss'],
  imports: [MatFormFieldModule, MatDialogModule, FormsModule, CommonModule],
})
export class AddDeviceDialogComponent {
  name = '';
  type = '';

  constructor(public dialogRef: MatDialogRef<AddDeviceDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

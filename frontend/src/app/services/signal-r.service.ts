import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private serverMessagesReceived: any;

  constructor(private ngZone: NgZone) {
    this.buildConnection();
    this.startConnection();
  }

  private buildConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5095/devicehub')
      .build();
  }

  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.error('Error while starting connection: ' + err));
  }

  public onReceiveMessage(callback: any): void {
    this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
      this.ngZone.run(() => {
        callback(user, message);
      });
    });
  }

  public sendMessage(user: string, message: string): void {
    this.hubConnection
      .invoke('SendMessage', user, message)
      .catch((err) => console.error(err));
  }
}

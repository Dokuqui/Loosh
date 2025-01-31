import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: HubConnection;

  constructor() {
    this.buildConnection();
    this.startConnection();
  }

  private buildConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:5000/devicehub')
      .build();
  }

  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.error('Error while starting connection: ' + err));
  }

  public sendMessage(user: string, message: string) {
    this.hubConnection
      .invoke('Send message', user, message)
      .catch((err) => console.log(err));
  }

  public onReceiveMessage(callback: (user: string, message: string) => void) {
    this.hubConnection.on('ReceiveMessage', callback);
  }
}

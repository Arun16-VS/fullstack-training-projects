import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SignalrService {
  private hubConnection?: signalR.HubConnection;
  private notificationSubject = new Subject<string>();
  notification$ = this.notificationSubject.asObservable();

  constructor(private authService: AuthService) {}

  start(): void {
    const token = this.authService.getToken();
    if (!token || this.hubConnection) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7001/hubs/notifications', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveNotification', (message: string) => {
      this.notificationSubject.next(message);
    });

    this.hubConnection.start().catch(err => console.error('SignalR connection error', err));
  }

  stop(): void {
    if (!this.hubConnection) return;
    this.hubConnection.stop().catch(() => undefined);
    this.hubConnection = undefined;
  }
}

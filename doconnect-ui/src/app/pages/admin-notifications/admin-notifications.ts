import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin';
import type { NotificationItem } from '../../models/notification.model';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-notifications.html',
  styleUrl: './admin-notifications.css'
})
export class AdminNotificationsComponent implements OnInit, OnDestroy {
  notifications: NotificationItem[] = [];
  errorMessage = '';
  private refreshHandle?: ReturnType<typeof setInterval>;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.refreshHandle = setInterval(() => this.loadNotifications(), 15000);
  }

  ngOnDestroy(): void {
    if (this.refreshHandle) {
      clearInterval(this.refreshHandle);
    }
  }

  loadNotifications(): void {
    this.adminService.getNotifications().subscribe({
      next: (data: NotificationItem[]) => {
        this.notifications = data;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Unable to load notifications.';
      }
    });
  }

  markAsRead(id: number): void {
    this.adminService.markNotificationRead(id).subscribe(() => this.loadNotifications());
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin';
import { AdminDashboard } from '../../models/admin-dashboard.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  dashboard?: AdminDashboard;
  errorMessage = '';
  loading = false;
  private refreshHandle?: ReturnType<typeof setInterval>;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.refreshHandle = setInterval(() => this.loadDashboard(false), 15000);
  }

  ngOnDestroy(): void {
    if (this.refreshHandle) {
      clearInterval(this.refreshHandle);
    }
  }

  loadDashboard(showLoader = true): void {
    this.loading = showLoader;

    this.adminService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.errorMessage = '';
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load admin dashboard.';
        this.loading = false;
      }
    });
  }

  markAsRead(notificationId: number): void {
    this.adminService.markNotificationRead(notificationId).subscribe(() => this.loadDashboard(false));
  }
}

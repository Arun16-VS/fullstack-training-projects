import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card fade-in">
        <div class="auth-header">
          <div class="auth-mark" aria-hidden="true">
            <span class="node top"></span>
            <span class="node left"></span>
            <span class="node right"></span>
            <span class="link left-link"></span>
            <span class="link right-link"></span>
          </div>
          <h1>Sign in</h1>
          <p class="text-muted">Access your DoConnect account</p>
        </div>

        <div *ngIf="error" class="alert alert-error">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" class="form-control"
              [class.is-invalid]="submitted && f['email'].errors"
              placeholder="you@example.com">
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" class="form-control"
              [class.is-invalid]="submitted && f['password'].errors"
              placeholder="Enter your password">
          </div>

          <button type="submit" class="btn btn-primary w-full" [disabled]="loading">
            <span *ngIf="loading">Signing in...</span>
            <span *ngIf="!loading">Sign In</span>
          </button>
        </form>

        <p class="auth-footer">
          No account? <a routerLink="/register">Create one</a>
        </p>

        <div class="demo-hint">
          <strong>Demo Admin:</strong> admin&#64;doconnect.com / Admin&#64;123
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      padding: 40px 20px;
      background:
        radial-gradient(circle at 20% 15%, rgba(223, 207, 180, 0.32), transparent 24%),
        radial-gradient(circle at 82% 78%, rgba(72, 111, 178, 0.08), transparent 28%);
    }
    .auth-card {
      width: 100%; max-width: 430px;
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 20px; padding: 40px;
      box-shadow: var(--shadow);
    }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-mark {
      position: relative; width: 68px; height: 56px; margin: 0 auto 16px;
    }
    .node {
      position: absolute; width: 12px; height: 12px; border-radius: 50%;
      background: var(--accent); box-shadow: 0 0 0 6px rgba(72, 111, 178, 0.08);
    }
    .node.top { top: 0; left: 28px; }
    .node.left { bottom: 6px; left: 10px; }
    .node.right { bottom: 6px; right: 10px; }
    .link {
      position: absolute; height: 2px; background: var(--accent);
      transform-origin: left center; border-radius: 999px;
    }
    .left-link { width: 28px; left: 22px; top: 18px; transform: rotate(32deg); }
    .right-link { width: 28px; left: 34px; top: 18px; transform: rotate(-32deg); }
    .auth-header h1 { font-size: 2rem; margin-bottom: 6px; letter-spacing: -0.02em; }
    .btn.w-full { width: 100%; justify-content: center; padding: 13px; font-size: 1rem; margin-top: 8px; }
    .auth-footer { text-align: center; margin-top: 24px; color: var(--text-secondary); font-size: 0.95rem; }
    .auth-footer a { color: var(--accent); text-decoration: none; font-weight: 600; }
    .demo-hint {
      margin-top: 20px; padding: 12px; border-radius: var(--radius-sm);
      background: #f7f1e6; border: 1px solid #e1d4be;
      font-size: 0.85rem; color: var(--text-secondary); text-align: center;
    }
    .demo-hint strong { color: var(--accent); }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    if (this.form.invalid) return;

    this.loading = true;
    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        this.router.navigate(res.role === 'Admin' ? ['/admin'] : ['/questions']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}

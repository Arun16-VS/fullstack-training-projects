import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
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
          <h1>Create account</h1>
          <p class="text-muted">Join the DoConnect community</p>
        </div>

        <div *ngIf="error" class="alert alert-error">{{ error }}</div>
        <div *ngIf="success" class="alert alert-success">{{ success }}</div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Username</label>
            <input type="text" formControlName="username" class="form-control"
              [class.is-invalid]="submitted && f['username'].errors"
              placeholder="Choose a username">
            <small *ngIf="submitted && f['username'].errors?.['required']" class="field-error">Username is required</small>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" class="form-control"
              [class.is-invalid]="submitted && f['email'].errors"
              placeholder="you@example.com">
            <small *ngIf="submitted && f['email'].errors?.['email']" class="field-error">Enter a valid email</small>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" class="form-control"
              [class.is-invalid]="submitted && f['password'].errors"
              placeholder="Minimum 6 characters">
            <small *ngIf="submitted && f['password'].errors?.['minlength']" class="field-error">Password must be at least 6 characters</small>
          </div>

          <button type="submit" class="btn btn-primary w-full" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="auth-footer">
          Already have an account? <a routerLink="/login">Sign in</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      padding: 40px 20px;
      background:
        radial-gradient(circle at 80% 18%, rgba(223, 207, 180, 0.32), transparent 24%),
        radial-gradient(circle at 18% 80%, rgba(72, 111, 178, 0.08), transparent 28%);
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
    .field-error { color: var(--danger); font-size: 0.78rem; margin-top: 4px; display: block; }
  `]
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    if (this.form.invalid) return;
    this.loading = true;

    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.success = 'Account created! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed.';
        this.loading = false;
      }
    });
  }
}

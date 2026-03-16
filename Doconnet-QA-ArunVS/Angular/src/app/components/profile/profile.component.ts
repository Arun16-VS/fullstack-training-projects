import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

const BASE = 'https://localhost:7001/api';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" *ngIf="user">
      <div class="profile-page fade-in">
        <div class="profile-header">
          <div class="profile-avatar">
            <img *ngIf="user.profilePicture" [src]="user.profilePicture" [alt]="user.username + ' profile photo'" class="profile-avatar-image">
            <span *ngIf="!user.profilePicture">{{ user.username.charAt(0).toUpperCase() }}</span>
          </div>
          <div class="profile-info">
            <h1>{{ user.username }}</h1>
            <span class="role-tag" [class.admin]="user.role === 'Admin'">{{ user.role }}</span>
            <p class="bio" *ngIf="user.bio">{{ user.bio }}</p>
            <p class="joined text-muted text-sm">Joined {{ user.createdAt | date:'MMMM yyyy' }}</p>
            <p class="network-note text-muted text-sm" *ngIf="!isOwnProfile">{{ user.followingCount || 0 }} connections made</p>
          </div>
          <div class="profile-stats">
            <div class="pstat">
              <span class="pstat-val">{{ user.questionCount }}</span>
              <span class="pstat-label">Questions</span>
            </div>
            <div class="pstat">
              <span class="pstat-val">{{ user.answerCount }}</span>
              <span class="pstat-label">Answers</span>
            </div>
            <div class="pstat">
              <span class="pstat-val">{{ user.followerCount || 0 }}</span>
              <span class="pstat-label">Followers</span>
            </div>
          </div>
          <button *ngIf="isOwnProfile" class="btn btn-ghost" (click)="editMode = !editMode">
            Edit Profile
          </button>
          <button *ngIf="showConnectAction" class="btn" [class.btn-primary]="!user.isConnected" [class.btn-ghost]="user.isConnected" (click)="toggleConnect()">
            {{ user.isConnected ? 'Connected' : 'Connect' }}
          </button>
        </div>

        <div class="edit-panel" *ngIf="editMode">
          <h3>Edit Profile</h3>
          <div class="profile-upload">
            <div class="profile-upload-preview">
              <img *ngIf="editProfilePicture" [src]="editProfilePicture" [alt]="user.username + ' preview'" class="profile-upload-image">
              <span *ngIf="!editProfilePicture">{{ user.username.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="profile-upload-actions">
              <label class="btn btn-ghost btn-sm upload-label" for="profile-picture">Choose Image</label>
              <input id="profile-picture" type="file" accept="image/*" (change)="onFileSelected($event)">
              <button *ngIf="editProfilePicture" type="button" class="btn btn-ghost btn-sm" (click)="removeProfilePicture()">Remove</button>
              <small class="text-muted text-sm">Square images look best. We save the image only for this profile.</small>
            </div>
          </div>

          <div class="form-group">
            <label>Bio</label>
            <textarea [(ngModel)]="editBio" class="form-control" rows="3"></textarea>
          </div>
          <div class="flex gap-8">
            <button class="btn btn-primary btn-sm" (click)="saveProfile()">Save</button>
            <button class="btn btn-ghost btn-sm" (click)="cancelEdit()">Cancel</button>
          </div>
        </div>

        <div class="profile-body">
          <div class="profile-section">
            <div class="section-header">
              <h2>Questions</h2>
              <span class="section-chip">{{ user.followingCount || 0 }} following</span>
            </div>
            <div *ngIf="questions.length === 0" class="empty-state" style="padding:30px 0"><p>No questions yet</p></div>
            <div *ngFor="let q of questions" class="question-item" [routerLink]="['/questions', q.questionId]">
              <div class="flex-between">
                <span class="q-title-link">{{ q.title }}</span>
                <span class="badge-resolved" *ngIf="q.isResolved">Resolved</span>
              </div>
              <div class="q-item-meta">
                <span class="stat-chip">{{ q.voteCount }} votes</span>
                <span class="stat-chip">{{ q.answerCount }} answers</span>
                <span class="text-muted text-sm">{{ q.createdAt | date:'MMM d, yyyy' }}</span>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <div class="section-header">
              <h2>Reviews ({{ reviews.length }})</h2>
              <div class="stars" *ngIf="avgRating > 0">
                <span *ngFor="let s of [1,2,3,4,5]" class="star" [class.filled]="s <= avgRating">★</span>
                <span class="avg-text">{{ avgRating.toFixed(1) }}</span>
              </div>
            </div>
            <div *ngIf="canReview" class="review-form">
              <h4>Leave a review</h4>
              <div class="star-picker">
                <span *ngFor="let s of [1,2,3,4,5]" class="star-pick"
                  [class.selected]="newRating >= s" (click)="newRating = s">★</span>
              </div>
              <textarea [(ngModel)]="newReviewContent" class="form-control" rows="3" placeholder="Add a short note about working with this user"></textarea>
              <button class="btn btn-primary btn-sm mt-8" (click)="submitReview()"
                [disabled]="!newRating || !newReviewContent.trim()">Submit Review</button>
            </div>
            <div *ngFor="let r of reviews" class="review-card">
              <div class="review-header">
                <div class="review-author">
                  <span class="mini-avatar">{{ r.username.charAt(0).toUpperCase() }}</span>
                  <strong>{{ r.username }}</strong>
                </div>
                <div class="review-stars">
                  <span *ngFor="let s of [1,2,3,4,5]" class="star" [class.filled]="s <= r.rating">★</span>
                </div>
                <span class="text-muted text-sm">{{ r.createdAt | date:'MMM d, yyyy' }}</span>
              </div>
              <p class="review-content">{{ r.content }}</p>
            </div>
            <div *ngIf="reviews.length === 0" class="empty-state" style="padding:30px 0"><p>No reviews yet</p></div>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="!user && !loading" class="empty-state"><p>User not found</p></div>
    <div *ngIf="loading" class="spinner"></div>
  `,
  styles: [`
    .profile-page { padding: 40px 0; }
    .profile-header { display: flex; align-items: flex-start; gap: 24px; flex-wrap: wrap; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 32px; margin-bottom: 28px; box-shadow: var(--shadow); }
    .profile-avatar { width: 88px; height: 88px; border-radius: 24px; background: var(--accent-glow); border: 3px solid var(--accent); color: var(--accent); font-size: 2rem; font-weight: 700; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .profile-avatar-image { width: 100%; height: 100%; object-fit: cover; }
    .profile-info { flex: 1; min-width: 220px; }
    .profile-info h1 { font-size: 1.8rem; margin-bottom: 6px; }
    .bio { margin-top: 8px; color: var(--text-secondary); }
    .network-note { margin-top: 8px; }
    .role-tag { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; background: var(--bg-secondary); color: var(--text-secondary); border: 1px solid var(--border); }
    .role-tag.admin { background: rgba(192, 86, 91, 0.08); color: var(--danger); border-color: rgba(192, 86, 91, 0.22); }
    .profile-stats { display: flex; gap: 24px; align-items: center; }
    .pstat { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 72px; }
    .pstat-val { font-family: monospace; font-size: 1.5rem; font-weight: 600; }
    .pstat-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; }
    .edit-panel, .profile-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow); }
    .edit-panel { margin-bottom: 28px; }
    .edit-panel h3 { font-size: 1rem; font-weight: 600; margin-bottom: 16px; }
    .profile-upload { display: flex; gap: 16px; align-items: center; margin-bottom: 20px; padding: 16px; background: var(--bg-secondary); border: 1px dashed var(--border-light); border-radius: var(--radius-sm); }
    .profile-upload-preview { width: 72px; height: 72px; border-radius: 18px; background: var(--accent-glow); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 700; overflow: hidden; flex-shrink: 0; }
    .profile-upload-image { width: 100%; height: 100%; object-fit: cover; }
    .profile-upload-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
    .upload-label { cursor: pointer; }
    input[type="file"] { display: none; }
    .profile-body { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .profile-section h2 { font-size: 1rem; font-weight: 600; margin-bottom: 20px; color: var(--text-secondary); }
    .section-chip { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 999px; padding: 4px 10px; color: var(--text-secondary); font-size: 0.78rem; }
    .question-item { padding: 12px 0; border-bottom: 1px solid var(--border); cursor: pointer; }
    .question-item:last-child { border-bottom: none; }
    .q-title-link { font-size: 0.96rem; color: var(--text-primary); }
    .q-item-meta { display: flex; gap: 8px; align-items: center; margin-top: 6px; flex-wrap: wrap; }
    .stat-chip { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 999px; padding: 2px 8px; font-size: 0.75rem; color: var(--text-muted); }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 8px; }
    .stars, .review-stars { display: flex; align-items: center; gap: 2px; }
    .star { color: var(--text-muted); font-size: 1rem; }
    .star.filled { color: #d4a230; }
    .avg-text { color: var(--text-secondary); font-size: 0.85rem; margin-left: 4px; }
    .star-picker { display: flex; gap: 4px; margin-bottom: 10px; }
    .star-pick { font-size: 1.5rem; color: var(--text-muted); cursor: pointer; }
    .star-pick.selected { color: #d4a230; }
    .review-form { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    .review-form h4 { font-size: 0.95rem; font-weight: 600; margin-bottom: 10px; }
    .review-card { padding: 14px 0; border-bottom: 1px solid var(--border); }
    .review-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; flex-wrap: wrap; }
    .review-author { display: flex; align-items: center; gap: 8px; }
    .mini-avatar { width: 24px; height: 24px; border-radius: 6px; background: var(--accent-glow); color: var(--accent); font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .review-content { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; }
    @media (max-width: 768px) {
      .profile-body { grid-template-columns: 1fr; }
      .profile-upload { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: any = null;
  questions: any[] = [];
  reviews: any[] = [];
  avgRating = 0;
  loading = true;
  editMode = false;
  editBio = '';
  editProfilePicture = '';
  newRating = 0;
  newReviewContent = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public authService: AuthService
  ) {}

  get isOwnProfile() { return this.authService.currentUser?.userId === this.user?.userId; }
  get canReview() { return this.authService.isLoggedIn && !this.isOwnProfile && !this.reviews.find((r: any) => r.userId === this.authService.currentUser?.userId); }
  get showConnectAction() { return this.authService.isLoggedIn && !this.isOwnProfile; }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.http.get(`${BASE}/users/${id}`).subscribe((u: any) => {
      this.user = u;
      this.editBio = u.bio || '';
      this.editProfilePicture = u.profilePicture || '';
      this.loading = false;
    });
    this.http.get(`${BASE}/questions/user/${id}`).subscribe((q: any) => this.questions = q);
    this.http.get(`${BASE}/reviews/user/${id}`).subscribe((r: any) => {
      this.reviews = r.reviews;
      this.avgRating = r.averageRating;
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.editProfilePicture = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  }

  removeProfilePicture() {
    this.editProfilePicture = '';
  }

  cancelEdit() {
    this.editBio = this.user.bio || '';
    this.editProfilePicture = this.user.profilePicture || '';
    this.editMode = false;
  }

  saveProfile() {
    this.http.put(`${BASE}/users/${this.user.userId}`, {
      bio: this.editBio,
      profilePicture: this.editProfilePicture
    }).subscribe(() => {
      this.user.bio = this.editBio;
      this.user.profilePicture = this.editProfilePicture || '';
      if (this.isOwnProfile) {
        this.authService.updateCurrentUser({ profilePicture: this.user.profilePicture });
      }
      this.editMode = false;
    });
  }

  toggleConnect() {
    this.http.post(`${BASE}/users/${this.user.userId}/connect`, {}).subscribe((res: any) => {
      this.user.isConnected = res.isConnected;
      this.user.followerCount = res.followerCount;
      this.user.followingCount = res.followingCount;
    });
  }

  submitReview() {
    this.http.post(`${BASE}/reviews`, { content: this.newReviewContent, rating: this.newRating, reviewedUserId: this.user.userId }).subscribe(() => {
      this.newReviewContent = '';
      this.newRating = 0;
      this.http.get(`${BASE}/reviews/user/${this.user.userId}`).subscribe((r: any) => {
        this.reviews = r.reviews;
        this.avgRating = r.averageRating;
      });
    });
  }
}

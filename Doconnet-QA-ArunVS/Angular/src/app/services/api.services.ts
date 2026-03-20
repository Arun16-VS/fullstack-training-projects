import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PaginatedQuestions, Question, Answer,
  User, Notification, Review, AdminStats
} from '../models/models';

const BASE = 'https://localhost:7001/api';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  constructor(private http: HttpClient) {}

  getAll(params?: any): Observable<PaginatedQuestions> {
    let p = new HttpParams();
    if (params) Object.keys(params).forEach(k => { if (params[k] != null) p = p.set(k, params[k]); });
    return this.http.get<PaginatedQuestions>(`${BASE}/questions`, { params: p });
  }

  getById(id: number): Observable<{ question: Question; answers: Answer[] }> {
    return this.http.get<{ question: Question; answers: Answer[] }>(`${BASE}/questions/${id}`);
  }

  create(data: { title: string; body: string; tags?: string; imageUrl?: string }): Observable<any> {
    return this.http.post(`${BASE}/questions`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${BASE}/questions/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${BASE}/questions/${id}`);
  }

  vote(id: number, type: 'up' | 'down'): Observable<any> {
    return this.http.post(`${BASE}/questions/${id}/vote?type=${type}`, {});
  }

  resolve(id: number, acceptedAnswerId?: number): Observable<any> {
    let url = `${BASE}/questions/${id}/resolve`;
    if (acceptedAnswerId) url += `?acceptedAnswerId=${acceptedAnswerId}`;
    return this.http.patch(url, {});
  }

  getByUser(userId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${BASE}/questions/user/${userId}`);
  }

  getPending(): Observable<Question[]> {
    return this.http.get<Question[]>(`${BASE}/questions/pending`);
  }

  setApproval(id: number, approve: boolean): Observable<any> {
    return this.http.patch(`${BASE}/questions/${id}/approval?approve=${approve}`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class AnswerService {
  constructor(private http: HttpClient) {}

  getByQuestion(questionId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${BASE}/answers/question/${questionId}`);
  }

  create(data: { body: string; imageUrl?: string; questionId: number }): Observable<any> {
    return this.http.post(`${BASE}/answers`, data);
  }

  update(id: number, data: { body: string; imageUrl?: string }): Observable<any> {
    return this.http.put(`${BASE}/answers/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${BASE}/answers/${id}`);
  }

  vote(id: number, type: 'up' | 'down'): Observable<any> {
    return this.http.post(`${BASE}/answers/${id}/vote?type=${type}`, {});
  }

  getPending(): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${BASE}/answers/pending`);
  }

  setApproval(id: number, approve: boolean): Observable<any> {
    return this.http.patch(`${BASE}/answers/${id}/approval?approve=${approve}`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getAll(params?: any): Observable<any> {
    let p = new HttpParams();
    if (params) Object.keys(params).forEach(k => { if (params[k] != null) p = p.set(k, params[k]); });
    return this.http.get(`${BASE}/users`, { params: p });
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${BASE}/users/${id}`);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${BASE}/users/${id}`, data);
  }

  toggleStatus(id: number): Observable<any> {
    return this.http.patch(`${BASE}/users/${id}/toggle-status`, {});
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${BASE}/users/${id}`);
  }

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${BASE}/users/stats`);
  }
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${BASE}/notifications`);
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${BASE}/notifications/unread-count`);
  }

  markRead(id: number): Observable<any> {
    return this.http.patch(`${BASE}/notifications/${id}/read`, {});
  }

  markAllRead(): Observable<any> {
    return this.http.patch(`${BASE}/notifications/read-all`, {});
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${BASE}/notifications/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private http: HttpClient) {}

  getByUser(userId: number): Observable<{ reviews: Review[]; averageRating: number }> {
    return this.http.get<{ reviews: Review[]; averageRating: number }>(`${BASE}/reviews/user/${userId}`);
  }

  create(data: { content: string; rating: number; reviewedUserId: number }): Observable<any> {
    return this.http.post(`${BASE}/reviews`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${BASE}/reviews/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class ImageService {
  constructor(private http: HttpClient) {}

  upload(file: File, entityType: 'question' | 'answer'): Observable<{ url: string; relativePath: string; fileName: string; contentType: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string; relativePath: string; fileName: string; contentType: string }>(
      `${BASE}/images/upload?entityType=${entityType}`,
      formData
    );
  }
}

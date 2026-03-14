import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../../models/question.model';

export interface CreateQuestionPayload {
  questionTitle: string;
  questionText: string;
  topic: string;
  image?: File | null;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private readonly apiUrl = 'https://localhost:7052';
  private readonly baseUrl = `${this.apiUrl}/api/Questions`;

  constructor(private http: HttpClient) {}

  getAll(search?: string): Observable<Question[]> {
    const params = search?.trim() ? { search: search.trim() } : undefined;
    return this.http.get<Question[]>(this.baseUrl, { params });
  }

  getTopics(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/topics`);
  }

  getById(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateQuestionPayload): Observable<Question> {
    const formData = new FormData();
    formData.append('questionTitle', data.questionTitle);
    formData.append('questionText', data.questionText);
    formData.append('topic', data.topic);

    if (data.image) {
      formData.append('image', data.image);
    }

    return this.http.post<Question>(this.baseUrl, formData);
  }

  update(id: number, data: CreateQuestionPayload): Observable<Question> {
    const formData = new FormData();
    formData.append('questionTitle', data.questionTitle);
    formData.append('questionText', data.questionText);
    formData.append('topic', data.topic);

    if (data.image) {
      formData.append('image', data.image);
    }

    return this.http.put<Question>(`${this.baseUrl}/${id}`, formData);
  }

  approve(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/approve`, {});
  }

  reject(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/reject`, {});
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  resolveImageUrl(imageUrl?: string | null): string | null {
    return imageUrl ? `${this.apiUrl}${imageUrl}` : null;
  }
}

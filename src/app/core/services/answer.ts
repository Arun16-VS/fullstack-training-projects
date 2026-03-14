import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Answer } from '../../models/answer.model';
import { Observable } from 'rxjs';

export interface CreateAnswerPayload {
  answerText: string;
  image?: File | null;
}

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  private readonly apiUrl = 'https://localhost:7052';
  private readonly baseUrl = `${this.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  getByQuestionId(questionId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.baseUrl}/questions/${questionId}/answers`);
  }

  addAnswer(questionId: number, data: CreateAnswerPayload): Observable<Answer> {
    const formData = new FormData();
    formData.append('answerText', data.answerText);

    if (data.image) {
      formData.append('image', data.image);
    }

    return this.http.post<Answer>(`${this.baseUrl}/questions/${questionId}/answers`, formData);
  }

  approve(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/answers/${id}/approve`, {});
  }

  reject(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/answers/${id}/reject`, {});
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/answers/${id}`);
  }

  resolveImageUrl(imageUrl?: string | null): string | null {
    return imageUrl ? `${this.apiUrl}${imageUrl}` : null;
  }
}

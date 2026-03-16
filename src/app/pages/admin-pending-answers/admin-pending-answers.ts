import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin';
import { AnswerService } from '../../core/services/answer';
import type { Answer } from '../../models/answer.model';

@Component({
  selector: 'app-admin-pending-answers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-pending-answers.html',
  styleUrl: './admin-pending-answers.css'
})
export class AdminPendingAnswersComponent implements OnInit {
  answers: Answer[] = [];
  errorMessage = '';

  constructor(
    private adminService: AdminService,
    public answerService: AnswerService
  ) {}

  ngOnInit(): void {
    this.loadPendingAnswers();
  }

  loadPendingAnswers(): void {
    this.adminService.getPendingAnswers().subscribe({
      next: (data: Answer[]) => {
        this.answers = data;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Unable to load pending answers.';
      }
    });
  }

  approve(id: number): void {
    this.answerService.approve(id).subscribe(() => this.loadPendingAnswers());
  }

  reject(id: number): void {
    this.answerService.reject(id).subscribe(() => this.loadPendingAnswers());
  }

  deleteAnswer(id: number): void {
    this.answerService.delete(id).subscribe(() => this.loadPendingAnswers());
  }
}

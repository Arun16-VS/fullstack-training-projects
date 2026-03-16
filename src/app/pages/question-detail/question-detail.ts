import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuestionService } from '../../core/services/question';
import { AnswerService } from '../../core/services/answer';
import { AuthService } from '../../core/services/auth';
import type { Question } from '../../models/question.model';
import type { Answer } from '../../models/answer.model';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './question-detail.html',
  styleUrl: './question-detail.css'
})
export class QuestionDetailComponent implements OnInit {
  questionId = 0;
  question?: Question;
  answers: Answer[] = [];
  answerText = '';
  selectedImage: File | null = null;
  message = '';
  error = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    public questionService: QuestionService,
    public answerService: AnswerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.questionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadQuestion();
    this.loadAnswers();
  }

  loadQuestion(): void {
    this.loading = true;
    this.questionService.getById(this.questionId).subscribe({
      next: (data: Question) => {
        this.question = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load this question.';
      }
    });
  }

  loadAnswers(): void {
    this.answerService.getByQuestionId(this.questionId).subscribe({
      next: (data: Answer[]) => {
        this.answers = data;
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedImage = input.files?.[0] || null;
  }

  addAnswer(): void {
    this.message = '';
    this.error = '';

    if (!this.authService.isLoggedIn()) {
      this.error = 'Please login to post an answer.';
      return;
    }

    if (!this.answerText.trim()) {
      this.error = 'Answer text is required.';
      return;
    }

    this.answerService.addAnswer(this.questionId, {
      answerText: this.answerText.trim(),
      image: this.selectedImage
    }).subscribe({
      next: () => {
        this.message = 'Answer submitted for admin approval';
        this.answerText = '';
        this.selectedImage = null;
        this.loadAnswers();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to add answer';
      }
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}

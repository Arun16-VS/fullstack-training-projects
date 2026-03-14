import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin';
import { QuestionService } from '../../core/services/question';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-admin-pending-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pending-questions.html',
  styleUrl: './admin-pending-questions.css'
})
export class AdminPendingQuestionsComponent implements OnInit {
  questions: Question[] = [];
  errorMessage = '';
  editingQuestionId: number | null = null;
  editForm = {
    questionTitle: '',
    questionText: '',
    topic: ''
  };
  availableTopics: string[] = [];

  constructor(
    private adminService: AdminService,
    public questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.loadTopics();
    this.loadPendingQuestions();
  }

  loadTopics(): void {
    this.questionService.getTopics().subscribe({
      next: (topics) => {
        this.availableTopics = topics;
      },
      error: () => {
        this.availableTopics = ['Technology', 'Education', 'Sports', 'Cinema', 'Health', 'Business'];
      }
    });
  }

  loadPendingQuestions(): void {
    this.adminService.getPendingQuestions().subscribe({
      next: (data: Question[]) => {
        this.questions = data;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Unable to load pending questions.';
      }
    });
  }

  approve(id: number): void {
    this.questionService.approve(id).subscribe(() => this.loadPendingQuestions());
  }

  reject(id: number): void {
    this.questionService.reject(id).subscribe(() => this.loadPendingQuestions());
  }

  deleteQuestion(id: number): void {
    this.questionService.delete(id).subscribe(() => this.loadPendingQuestions());
  }

  startEdit(question: Question): void {
    this.editingQuestionId = question.questionId;
    this.editForm = {
      questionTitle: question.questionTitle,
      questionText: question.questionText,
      topic: question.topic || this.availableTopics[0] || 'Technology'
    };
  }

  cancelEdit(): void {
    this.editingQuestionId = null;
  }

  saveEdit(questionId: number): void {
    this.questionService.update(questionId, {
      questionTitle: this.editForm.questionTitle,
      questionText: this.editForm.questionText,
      topic: this.editForm.topic
    }).subscribe(() => {
      this.editingQuestionId = null;
      this.loadPendingQuestions();
    });
  }
}

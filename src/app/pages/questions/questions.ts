import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { QuestionService } from '../../core/services/question';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './questions.html',
  styleUrl: './questions.css'
})
export class QuestionsComponent implements OnInit {
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  availableTopics: string[] = [];
  searchText = '';
  loading = false;
  errorMessage = '';
  readonly sampleQuestions: Question[] = [
    {
      questionId: -1,
      questionTitle: 'What are the best ways to start learning Angular for beginners?',
      questionText: 'Looking for a simple roadmap with projects, videos, and practice ideas.',
      topic: 'Education',
      username: 'DoConnect Team',
      answerCount: 2
    },
    {
      questionId: -2,
      questionTitle: 'Which recent sports tournaments are worth following this season?',
      questionText: 'Interested in cricket, football, and major global events.',
      topic: 'Sports',
      username: 'DoConnect Team',
      answerCount: 3
    },
    {
      questionId: -3,
      questionTitle: 'What are the most useful AI tools for students in 2026?',
      questionText: 'Need practical suggestions for writing, coding, and research support.',
      topic: 'Technology',
      username: 'DoConnect Team',
      answerCount: 4
    }
  ];

  constructor(public questionService: QuestionService) {}

  ngOnInit(): void {
    this.loadTopics();
    this.loadQuestions();
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

  loadQuestions(search?: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.questionService.getAll(search).subscribe({
      next: (data: Question[]) => {
        this.questions = data;
        this.filteredQuestions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Questions load failed', err);
        this.questions = [];
        this.filteredQuestions = [];
        this.loading = false;
        this.errorMessage = 'Unable to load questions right now.';
      }
    });
  }

  onSearch(): void {
    this.loadQuestions(this.searchText);
  }

  clearSearch(): void {
    this.searchText = '';
    this.loadQuestions();
  }

  searchByTopic(topic: string): void {
    this.searchText = topic;
    this.onSearch();
  }
}

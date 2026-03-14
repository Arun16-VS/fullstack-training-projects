import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionService } from '../../core/services/question';

@Component({
  selector: 'app-ask-question',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ask-question.html',
  styleUrl: './ask-question.css'
})
export class AskQuestionComponent implements OnInit {
  questionTitle = '';
  questionText = '';
  topic = '';
  availableTopics: string[] = [];
  readonly fallbackTopics = ['Technology', 'Education', 'Sports', 'Cinema', 'Health', 'Business'];
  selectedImage: File | null = null;
  message = '';
  error = '';
  isSubmitting = false;

  constructor(private questionService: QuestionService, private router: Router) {}

  ngOnInit(): void {
    this.questionService.getTopics().subscribe({
      next: (topics) => {
        this.availableTopics = topics.length ? topics : this.fallbackTopics;
        this.topic = this.availableTopics[0] || '';
      },
      error: () => {
        this.availableTopics = this.fallbackTopics;
        this.topic = this.availableTopics[0] || '';
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedImage = input.files?.[0] || null;
  }

  submitQuestion(): void {
    this.message = '';
    this.error = '';

    if (!this.questionTitle.trim() || !this.questionText.trim() || !this.topic.trim()) {
      this.error = 'Title, topic, and description are required.';
      return;
    }

    this.isSubmitting = true;

    const payload = {
      questionTitle: this.questionTitle.trim(),
      questionText: this.questionText.trim(),
      topic: this.topic.trim(),
      image: this.selectedImage
    };

    this.questionService.create(payload).subscribe({
      next: () => {
        this.message = 'Question submitted successfully';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/questions']), 1000);
      },
      error: (err) => {
        console.error('Ask question failed', err);
        this.isSubmitting = false;
        this.error = err?.error?.message || 'Failed to submit question';
      }
    });
  }
}

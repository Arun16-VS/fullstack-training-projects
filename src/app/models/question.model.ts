export interface Question {
  questionId: number;
  questionTitle: string;
  questionText: string;
  topic?: string;
  imageUrl?: string | null;
  answerCount?: number;
  status?: string;
  userId?: number;
  createdAt?: string;
  username?: string;
}

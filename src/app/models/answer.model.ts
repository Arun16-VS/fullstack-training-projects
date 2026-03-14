export interface Answer {
  answerId: number;
  answerText: string;
  questionId: number;
  imageUrl?: string | null;
  userId?: number;
  status?: string;
  createdAt?: string;
  username?: string;
}

export interface User {
  userId: number;
  username: string;
  email: string;
  role: string;
  bio?: string;
  profilePicture?: string;
  createdAt: string;
  isActive: boolean;
  questionCount: number;
  answerCount: number;
  followerCount?: number;
  followingCount?: number;
  isConnected?: boolean;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  userId: number;
  profilePicture?: string;
}

export interface Question {
  questionId: number;
  title: string;
  body: string;
  imageUrl?: string;
  tags?: string;
  viewCount: number;
  voteCount: number;
  isResolved: boolean;
  createdAt: string;
  updatedAt?: string;
  userId: number;
  username: string;
  answerCount: number;
  acceptedAnswerId?: number;
}

export interface Answer {
  answerId: number;
  body: string;
  voteCount: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt?: string;
  userId: number;
  username: string;
  questionId: number;
}

export interface Notification {
  notificationId: number;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  questionId?: number;
}

export interface Review {
  reviewId: number;
  content: string;
  rating: number;
  createdAt: string;
  userId: number;
  username: string;
  reviewedUserId: number;
}

export interface PaginatedQuestions {
  total: number;
  page: number;
  pageSize: number;
  questions: Question[];
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalQuestions: number;
  totalAnswers: number;
  resolvedQuestions: number;
}

import { NotificationItem } from './notification.model';

export interface AdminDashboard {
  pendingQuestionCount: number;
  pendingAnswerCount: number;
  unreadNotificationCount: number;
  recentNotifications: NotificationItem[];
}

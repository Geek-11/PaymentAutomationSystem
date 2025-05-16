import { ChatMessage } from '@/types/chat';

// Mock chat messages
export const mockMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'admin-1',
    recipientId: 'mentor-1',
    text: 'Hello John, I wanted to discuss your upcoming sessions for next week.',
    timestamp: '2025-06-15T09:30:00',
    isRead: true
  },
  {
    id: 'msg-2',
    senderId: 'mentor-1',
    recipientId: 'admin-1',
    text: 'Hi Admin, sure! I\'m available to discuss. What sessions are you referring to?',
    timestamp: '2025-06-15T09:35:00',
    isRead: true
  },
  {
    id: 'msg-3',
    senderId: 'admin-1',
    recipientId: 'mentor-1',
    text: 'We have a React advanced workshop scheduled for Tuesday and Thursday. Would you be able to cover both days?',
    timestamp: '2025-06-15T09:40:00',
    isRead: true
  },
  {
    id: 'msg-4',
    senderId: 'mentor-1',
    recipientId: 'admin-1',
    text: 'I can definitely handle Tuesday, but Thursday might be a bit tight with my other commitments. What time is the Thursday session?',
    timestamp: '2025-06-15T09:45:00',
    isRead: true
  },
  {
    id: 'msg-5',
    senderId: 'admin-1',
    recipientId: 'mentor-1',
    text: 'The Thursday session is scheduled from 3 PM to 5 PM. Would that work for you?',
    timestamp: '2025-06-15T09:50:00',
    isRead: true
  },
  {
    id: 'msg-6',
    senderId: 'mentor-1',
    recipientId: 'admin-1',
    text: 'Actually that should work fine. I\'ll rearrange some things to make it fit. Please go ahead and schedule me for both days.',
    timestamp: '2025-06-15T09:55:00',
    isRead: true
  },
  {
    id: 'msg-7',
    senderId: 'admin-1',
    recipientId: 'mentor-1',
    text: 'Great! I\'ll confirm both sessions. By the way, your latest payout has been processed. You should receive it within 1-2 business days.',
    timestamp: '2025-06-15T10:00:00',
    isRead: true
  },
  {
    id: 'msg-8',
    senderId: 'mentor-1',
    recipientId: 'admin-1',
    text: 'Excellent, thank you for letting me know about the payout. I\'ll check for it later this week.',
    timestamp: '2025-06-15T10:05:00',
    isRead: false
  },
  {
    id: 'msg-9',
    senderId: 'admin-1',
    recipientId: 'mentor-2',
    text: 'Hi Sarah, I noticed your rate for Flutter sessions is lower than our other mobile developers. Would you like us to adjust your rate?',
    timestamp: '2025-06-14T14:30:00',
    isRead: true
  },
  {
    id: 'msg-10',
    senderId: 'mentor-2',
    recipientId: 'admin-1',
    text: 'Hello! Yes, I would appreciate that. What\'s the standard rate you\'re offering now?',
    timestamp: '2025-06-14T15:45:00',
    isRead: true
  },
  {
    id: 'msg-11',
    senderId: 'admin-1',
    recipientId: 'mentor-2',
    text: 'We\'re currently offering ₹4,000 per hour for mobile development specialists with your experience level.',
    timestamp: '2025-06-14T16:00:00',
    isRead: true
  },
  {
    id: 'msg-12',
    senderId: 'mentor-2',
    recipientId: 'admin-1',
    text: 'That sounds great! I\'d be happy with that adjustment. When would the new rate take effect?',
    timestamp: '2025-06-14T16:15:00',
    isRead: true
  },
  {
    id: 'msg-13',
    senderId: 'admin-1',
    recipientId: 'mentor-2',
    text: 'We can apply it starting from your next session. I\'ll update your profile accordingly.',
    timestamp: '2025-06-14T16:20:00',
    isRead: false
  },
  {
    id: 'msg-14',
    senderId: 'admin-1',
    recipientId: 'mentor-3',
    text: 'Hi Raj, just checking if you received the payment for your data science workshop series?',
    timestamp: '2025-06-13T11:00:00',
    isRead: true
  },
  {
    id: 'msg-15',
    senderId: 'mentor-3',
    recipientId: 'admin-1',
    text: 'Yes, I received it yesterday. Thank you for following up!',
    timestamp: '2025-06-13T11:30:00',
    isRead: true
  }
];
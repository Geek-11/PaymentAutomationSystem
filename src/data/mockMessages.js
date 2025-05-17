import { ChatMessage } from '@/types/chat';

export const mockMessages = [
  {
    id: 'msg-1',
    senderId: '1',
    recipientId: '2',
    text: 'Hello Sarah, how are your sessions going?',
    timestamp: '2024-01-15T10:00:00Z'
  },
  {
    id: 'msg-2',
    senderId: '2',
    recipientId: '1',
    text: 'Hi John! Everything is going well. I completed 5 sessions this week.',
    timestamp: '2024-01-15T10:05:00Z'
  },
  {
    id: 'msg-3',
    senderId: '1',
    recipientId: '3',
    text: 'Mike, please update your availability calendar when you can.',
    timestamp: '2024-01-15T11:00:00Z'
  }
];
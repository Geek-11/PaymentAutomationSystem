export interface ChatAttachment {
  name: string;
  type: string;
  size: number;
  url?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  attachments?: ChatAttachment[];
  timestamp: string;
  isRead?: boolean;
}
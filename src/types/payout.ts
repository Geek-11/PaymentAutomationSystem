export type PayoutStatus = 'pending' | 'paid' | 'review';

export interface Payout {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorEmail?: string;
  date: string;
  sessionsCount: number;
  totalAmount: number;
  subtotal?: number;
  charges?: {
    name: string;
    amount: number;
    type: 'percentage' | 'fixed';
  }[];
  notes?: string;
  status: PayoutStatus;
  paymentMethod?: string;
  paymentDate?: string;
  receiptUrl?: string;
}
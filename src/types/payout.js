// Payout types
export const PayoutStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  REVIEW: 'review'
};

export const Payout = {
  id: '',
  mentorId: '',
  mentorName: '',
  mentorEmail: '',
  date: '',
  sessionsCount: 0,
  totalAmount: 0,
  subtotal: 0,
  charges: [],
  notes: '',
  status: PayoutStatus.PENDING,
  paymentMethod: '',
  paymentDate: '',
  receiptUrl: ''
};
export type UserRole = 'admin' | 'mentor';

export interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  role: UserRole;
  isActive: boolean;
}

export interface Mentor extends User {
  role: 'mentor';
  baseRate: number;
  specialization?: string;
  joinedAt: string;
  paymentDetails?: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
}
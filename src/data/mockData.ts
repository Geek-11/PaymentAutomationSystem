// Mock data for the application

import { Session } from '@/types/session';
import { Mentor, User } from '@/types/user';
import { Payout } from '@/types/payout';

// Mock mentors
export const mockMentors: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'mentor',
    isActive: true,
    baseRate: 4000,
    specialization: 'Web Development',
    joinedAt: '2023-01-15',
    paymentDetails: {
      accountNumber: 'XXXX-XXXX-1234',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234'
    }
  },
  {
    id: 'mentor-2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    role: 'mentor',
    isActive: true,
    baseRate: 3500,
    specialization: 'Mobile Development',
    joinedAt: '2023-02-20',
    paymentDetails: {
      accountNumber: 'XXXX-XXXX-5678',
      bankName: 'ICICI Bank',
      ifscCode: 'ICIC0005678'
    }
  },
  {
    id: 'mentor-3',
    name: 'Raj Patel',
    email: 'raj.patel@example.com',
    role: 'mentor',
    isActive: true,
    baseRate: 4500,
    specialization: 'Data Science',
    joinedAt: '2023-03-10',
    paymentDetails: {
      accountNumber: 'XXXX-XXXX-9012',
      bankName: 'SBI Bank',
      ifscCode: 'SBIN0009012'
    }
  },
  {
    id: 'mentor-4',
    name: 'Maria Garcia',
    email: 'maria.g@example.com',
    role: 'mentor',
    isActive: false,
    baseRate: 3800,
    specialization: 'UI/UX Design',
    joinedAt: '2023-04-05'
  },
  {
    id: 'mentor-5',
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    role: 'mentor',
    isActive: true,
    baseRate: 4200,
    specialization: 'DevOps',
    joinedAt: '2023-05-12',
    paymentDetails: {
      accountNumber: 'XXXX-XXXX-3456',
      bankName: 'Axis Bank',
      ifscCode: 'UTIB0003456'
    }
  }
];

// Mock users
export const mockUsers: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@edutech.com',
    role: 'admin',
    isActive: true
  },
  ...mockMentors.map(mentor => ({
    id: mentor.id,
    name: mentor.name,
    email: mentor.email,
    role: mentor.role,
    isActive: mentor.isActive
  }))
];

// Mock sessions
export const mockSessions: Session[] = [
  {
    id: 'session-1',
    mentor: {
      id: 'mentor-1',
      name: 'John Smith'
    },
    title: 'React Advanced Concepts',
    type: 'live',
    date: '2025-06-15T10:00:00',
    startTime: '10:00',
    endTime: '12:00',
    duration: 2,
    rate: 4000,
    amount: 8000,
    notes: 'Covered hooks, context, and performance optimization'
  },
  {
    id: 'session-2',
    mentor: {
      id: 'mentor-1',
      name: 'John Smith'
    },
    title: 'Code Review: E-commerce Project',
    type: 'evaluation',
    date: '2025-06-10T14:00:00',
    startTime: '14:00',
    endTime: '15:30',
    duration: 1.5,
    rate: 4000,
    amount: 6000,
    notes: 'Reviewed frontend implementation, suggested improvements'
  },
  {
    id: 'session-3',
    mentor: {
      id: 'mentor-2',
      name: 'Sarah Johnson'
    },
    title: 'Flutter Animation Workshop',
    type: 'live',
    date: '2025-06-12T11:00:00',
    startTime: '11:00',
    endTime: '13:00',
    duration: 2,
    rate: 3500,
    amount: 7000,
    notes: 'Interactive session on complex animations in Flutter'
  },
  {
    id: 'session-4',
    mentor: {
      id: 'mentor-3',
      name: 'Raj Patel'
    },
    title: 'Python Data Analysis Feedback',
    type: 'recording',
    date: '2025-06-08T09:00:00',
    startTime: '09:00',
    endTime: '10:00',
    duration: 1,
    rate: 4500,
    amount: 4500,
    notes: 'Recorded feedback on student data analysis project'
  },
  {
    id: 'session-5',
    mentor: {
      id: 'mentor-5',
      name: 'Alex Chen'
    },
    title: 'Docker & Kubernetes Setup',
    type: 'live',
    date: '2025-06-14T15:00:00',
    startTime: '15:00',
    endTime: '17:00',
    duration: 2,
    rate: 4200,
    amount: 8400,
    notes: 'Hands-on workshop for containerization and orchestration'
  },
  {
    id: 'session-6',
    mentor: {
      id: 'mentor-2',
      name: 'Sarah Johnson'
    },
    title: 'App UX Evaluation',
    type: 'evaluation',
    date: '2025-06-09T13:00:00',
    startTime: '13:00',
    endTime: '14:00',
    duration: 1,
    rate: 3500,
    amount: 3500,
    notes: 'Evaluated mobile app UX and provided recommendations'
  },
  {
    id: 'session-7',
    mentor: {
      id: 'mentor-3',
      name: 'Raj Patel'
    },
    title: 'Machine Learning Model Review',
    type: 'recording',
    date: '2025-06-11T10:00:00',
    startTime: '10:00',
    endTime: '11:30',
    duration: 1.5,
    rate: 4500,
    amount: 6750,
    notes: 'Recorded feedback on classification model implementation'
  },
  {
    id: 'session-8',
    mentor: {
      id: 'mentor-1',
      name: 'John Smith'
    },
    title: 'GraphQL Implementation',
    type: 'live',
    date: '2025-06-18T14:00:00',
    startTime: '14:00',
    endTime: '16:00',
    duration: 2,
    rate: 4000,
    amount: 8000,
    notes: 'Workshop on implementing GraphQL in a React application'
  },
  {
    id: 'session-9',
    mentor: {
      id: 'mentor-5',
      name: 'Alex Chen'
    },
    title: 'CI/CD Pipeline Feedback',
    type: 'evaluation',
    date: '2025-06-19T11:00:00',
    startTime: '11:00',
    endTime: '12:00',
    duration: 1,
    rate: 4200,
    amount: 4200,
    notes: 'Evaluated GitHub Actions workflow and suggested improvements'
  },
  {
    id: 'session-10',
    mentor: {
      id: 'mentor-2',
      name: 'Sarah Johnson'
    },
    title: 'React Native Navigation',
    type: 'live',
    date: '2025-06-20T15:00:00',
    startTime: '15:00',
    endTime: '17:00',
    duration: 2,
    rate: 3500,
    amount: 7000,
    notes: 'Hands-on session on complex navigation patterns'
  }
];

// Mock payouts
export const mockPayouts: Payout[] = [
  {
    id: 'payout-1',
    mentorId: 'mentor-1',
    mentorName: 'John Smith',
    mentorEmail: 'john.smith@example.com',
    date: '2025-06-01T12:00:00',
    sessionsCount: 4,
    totalAmount: 20000,
    subtotal: 22000,
    charges: [
      {
        name: 'Platform Fee',
        amount: 1100,
        type: 'percentage'
      },
      {
        name: 'GST',
        amount: 900,
        type: 'percentage'
      }
    ],
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    paymentDate: '2025-06-02T10:30:00'
  },
  {
    id: 'payout-2',
    mentorId: 'mentor-2',
    mentorName: 'Sarah Johnson',
    mentorEmail: 'sarah.j@example.com',
    date: '2025-06-01T14:00:00',
    sessionsCount: 3,
    totalAmount: 15000,
    subtotal: 16500,
    charges: [
      {
        name: 'Platform Fee',
        amount: 825,
        type: 'percentage'
      },
      {
        name: 'GST',
        amount: 675,
        type: 'percentage'
      }
    ],
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    paymentDate: '2025-06-02T11:15:00'
  },
  {
    id: 'payout-3',
    mentorId: 'mentor-3',
    mentorName: 'Raj Patel',
    mentorEmail: 'raj.patel@example.com',
    date: '2025-06-01T15:30:00',
    sessionsCount: 2,
    totalAmount: 11250,
    subtotal: 12375,
    charges: [
      {
        name: 'Platform Fee',
        amount: 619,
        type: 'percentage'
      },
      {
        name: 'GST',
        amount: 506,
        type: 'percentage'
      }
    ],
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    paymentDate: '2025-06-02T12:00:00'
  },
  {
    id: 'payout-4',
    mentorId: 'mentor-5',
    mentorName: 'Alex Chen',
    mentorEmail: 'alex.chen@example.com',
    date: '2025-06-02T16:45:00',
    sessionsCount: 2,
    totalAmount: 12600,
    subtotal: 13860,
    charges: [
      {
        name: 'Platform Fee',
        amount: 693,
        type: 'percentage'
      },
      {
        name: 'GST',
        amount: 567,
        type: 'percentage'
      }
    ],
    status: 'pending',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'payout-5',
    mentorId: 'mentor-1',
    mentorName: 'John Smith',
    mentorEmail: 'john.smith@example.com',
    date: '2025-06-16T10:00:00',
    sessionsCount: 2,
    totalAmount: 14400,
    subtotal: 16000,
    charges: [
      {
        name: 'Platform Fee',
        amount: 800,
        type: 'percentage'
      },
      {
        name: 'GST',
        amount: 800,
        type: 'percentage'
      }
    ],
    status: 'review',
    paymentMethod: 'Bank Transfer'
  }
];
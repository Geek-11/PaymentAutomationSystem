export const mockMentors = [
  {
    id: '2',
    name: 'Sarah Mentor',
    email: 'sarah@example.com',
    role: 'mentor',
    isActive: true,
    mentorType: 'DSA Instructor',
    specialization: 'Data Structures & Algorithms',
    joinedAt: '2024-01-01',
    paymentDetails: {
      accountNumber: '1234567890',
      bankName: 'Tech Bank',
      ifscCode: 'TECH0001234'
    }
  },
  {
    id: '3',
    name: 'Mike Mentor',
    email: 'mike@example.com',
    role: 'mentor',
    isActive: false,
    mentorType: 'Coding Instructor',
    specialization: 'Full Stack Development',
    joinedAt: '2024-01-15',
    paymentDetails: {
      accountNumber: '0987654321',
      bankName: 'Code Bank',
      ifscCode: 'CODE0005678'
    }
  }
];

export const mockSessions = [
  {
    id: 'session-1',
    userId: mockMentors[0].id,
    userName: mockMentors[0].name,
    title: 'Advanced DSA Concepts',
    type: 'live',
    date: '2025-01-15T10:00:00Z',
    startTime: '10:00',
    endTime: '12:00',
    duration: 2,
    amount: 10000,
    notes: 'Covering advanced tree and graph algorithms'
  },
  {
    id: 'session-2',
    userId: mockMentors[1].id,
    userName: mockMentors[1].name,
    title: 'React Performance Optimization',
    type: 'evaluation',
    date: '2025-01-10T14:00:00Z',
    startTime: '14:00',
    endTime: '15:30',
    duration: 1.5,
    amount: 6000,
    notes: 'Code review and performance analysis'
  }
];

export const mockPayouts = [
  {
    id: 'payout-1',
    mentorId: mockMentors[0].id,
    mentorName: mockMentors[0].name,
    mentorEmail: mockMentors[0].email,
    date: '2025-01-20T00:00:00Z',
    sessionsCount: 10,
    totalAmount: 50000,
    subtotal: 55000,
    charges: [
      {
        name: 'Platform Fee',
        amount: 2750,
        type: 'percentage'
      },
      {
        name: 'GST',
        amount: 2250,
        type: 'percentage'
      }
    ],
    status: 'paid',
    notes: 'January first half payout'
  },
  {
    id: 'payout-2',
    mentorId: mockMentors[1].id,
    mentorName: mockMentors[1].name,
    mentorEmail: mockMentors[1].email,
    date: '2025-01-15T00:00:00Z',
    sessionsCount: 6,
    totalAmount: 30000,
    subtotal: 33000,
    charges: [
      {
        name: 'Platform Fee',
        amount: 1650,
        type: 'percentage'
      },
      {
        name: 'GST',
        amount: 1350,
        type: 'percentage'
      }
    ],
    status: 'pending',
    notes: 'January first half payout'
  }
];

// Export mockMentors as mockUsers since they represent the same data
export const mockUsers = mockMentors;
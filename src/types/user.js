// // User types
// export const UserRole = {
//   ADMIN: 'admin',
//   MENTOR: 'mentor'
// };

export const MentorType = {
  DSA_INSTRUCTOR: 'DSA Instructor',
  CODING_INSTRUCTOR: 'Coding Instructor',
  CSBT_INSTRUCTOR: 'CSBT Instructor',
  INSTRUCTOR_ASSOCIATE: 'Instructor Associate'
};

// export const User = {
//   id: '',
//   name: '',
//   email: '',
//   role: UserRole.MENTOR,
//   isActive: true,
//   bankDetails: {
//     accountNumber: '',
//     ifscCode: '',
//     country: ''
//   }
// };

// export const Mentor = {
//   ...User,
//   role: UserRole.MENTOR,
//   mentorType: MentorType.INSTRUCTOR_ASSOCIATE,
//   specialization: '',
//   joinedAt: '',
//   paymentDetails: {
//     accountNumber: '',
//     bankName: '',
//     ifscCode: ''
//   }
// };

export const BASE_RATES = {
  [MentorType.DSA_INSTRUCTOR]: 5000,
  [MentorType.CODING_INSTRUCTOR]: 4000,
  [MentorType.CSBT_INSTRUCTOR]: 3000,
  [MentorType.INSTRUCTOR_ASSOCIATE]: 2000
};
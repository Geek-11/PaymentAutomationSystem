# PayoutSync - Automated Payout Management System


## 🚀 Overview

PayoutSync is a sophisticated payout management system designed for educational platforms to automate and streamline mentor compensation. The system handles session tracking, payout calculations, and real-time communication between administrators and mentors.

![Login Page]()

### Key Features

- 🔐 **Secure Authentication**: Role-based access control with separate dashboards for admins and mentors
- 💰 **Automated Payouts**: Intelligent payout calculation with tax handling and platform fee deductions
- 📊 **Analytics Dashboard**: Real-time insights into session metrics and earnings
- 💬 **Real-time Chat**: Integrated communication system using Agora RTM
- 📄 **Dynamic PDF Generation**: Automated receipt and documentation generation
- 🌙 **Dark Mode Support**: Full dark mode implementation with system preference detection
- 📱 **Responsive Design**: Seamless experience across all device sizes

## 📸 Screenshots

### Admin Dashboard
![Admin Dashboard]()
The admin dashboard provides a comprehensive overview of platform metrics, including total sessions, active mentors, and payout statistics.

### Session Management
![Session Management]()
Efficiently manage and track all mentor sessions with detailed information about duration, rates, and status.

### Mentor Management
![Mentor Management](https://i.imgur.com/GHI012.png)
Complete mentor profile management with rate settings and performance tracking.

### Sidebar Navigation
![Sidebar Navigation](https://i.imgur.com/JKL345.png)
Intuitive navigation with quick access to all major features.

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.3.1 with JavaScript
- **Styling**: Tailwind CSS with custom utility classes
- **State Management**: React Context API with custom hooks
- **Real-time Communication**: Agora RTM SDK
- **PDF Generation**: jsPDF with autotable plugin
- **Icons**: Lucide React
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Build Tool**: Vite
- **Backend**: Firebase Cloud Functions

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── mentor/         # Mentor-specific components
│   ├── chat/           # Chat system components
│   └── common/         # Shared components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   └── mentor/         # Mentor dashboard pages
├── utils/              # Utility functions
└── config/             # Configuration files
```

## 🔑 Key Features Explained

### Authentication System
- Role-based access control (Admin/Mentor)
- Protected routes with role verification
- Persistent login state
- Form validation and error handling

### Payout Management
- Automated weekly payout generation
- Platform fee and tax calculations
- Receipt generation with detailed breakdowns
- Status tracking (Pending, Under Review, Paid)
- Dispute handling system

### Session Management
- Session scheduling and tracking
- Duration calculation
- Rate management
- Status updates
- CSV import functionality

### Real-time Chat
- Direct messaging between admins and mentors
- Message history
- Unread message notifications
- Online status indicators

### Analytics
- Session statistics
- Earnings tracking
- Performance metrics
- Trend analysis

## 🔒 Security Features

- **Authentication**: Secure token-based authentication
- **Data Validation**: Input sanitization and type checking
- **Error Handling**: Global error boundaries
- **Audit Logging**: Comprehensive activity tracking
- **Rate Limiting**: API request throttling
- **Data Encryption**: End-to-end encryption for sensitive data

## 📱 Responsive Design

The application is fully responsive with optimized layouts for:
- Mobile devices (< 640px)
- Tablets (640px - 1024px)
- Desktop (> 1024px)

## 🎨 Theme Support

- System preference detection for dark/light mode
- Manual theme toggle
- Persistent theme selection
- Smooth theme transitions

## 📊 Performance Optimization

- Code splitting with React.lazy
- Memoization of expensive calculations
- Optimized re-renders with useMemo and useCallback
- Efficient state management
- Lazy loading of images and components


## 📚 Documentation

Comprehensive documentation is available for:
- API endpoints
- Component props
- Context providers
- Custom hooks
- Utility functions

## 🚀 Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to your preferred hosting platform:
   - Netlify
   - Vercel
   - Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team 
- Gopesh Goyal (Captain)
- Rahul Mahra
- Nikhil Reddy


## 🌟 Acknowledgments

- React Team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Agora for real-time communication capabilities
- Firebase for authentication and database services

## 📞 Support

For support, geekstars0110@gmail.com

---

Made with ❤️ by Team - [Geekstars] 

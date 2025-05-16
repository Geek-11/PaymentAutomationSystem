import { useState } from 'react';
import { BarChart, ArrowDown, ArrowUp, Clock, DollarSign, Calendar, Download } from 'lucide-react';
import MentorLayout from '@/components/layout/MentorLayout';
import Button from '@/components/common/Button';
import { mockSessions, mockPayouts } from '@/data/mockData';
import { mockUser } from '@/data/mockUser';
import { formatCurrency, formatDate } from '@/utils/format';
import { useNavigate } from 'react-router-dom';

const MentorDashboard = () => {
  const navigate = useNavigate();
  
  // Assume the current user is the first mentor in our mock data
  const currentUser = mockUser;
  
  // Filter sessions for the current user
  const userSessions = mockSessions.filter(
    session => session.mentor.id === currentUser.id
  );
  
  // Filter for this month's data
  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();
  
  const sessionsThisMonth = userSessions.filter(
    session => new Date(session.date).getMonth() === thisMonth && 
               new Date(session.date).getFullYear() === thisYear
  );
  
  const sessionsLastMonth = userSessions.filter(
    session => new Date(session.date).getMonth() === (thisMonth - 1 + 12) % 12 && 
               new Date(session.date).getFullYear() === (thisMonth === 0 ? thisYear - 1 : thisYear)
  );
  
  const sessionCount = sessionsThisMonth.length;
  const sessionCountDiff = sessionCount - sessionsLastMonth.length;
  const sessionCountPct = sessionsLastMonth.length ? Math.round(sessionCountDiff / sessionsLastMonth.length * 100) : 100;
  
  // Calculate total hours for this month
  const totalHours = sessionsThisMonth.reduce(
    (total, session) => total + session.duration, 0
  );
  
  // Calculate earnings for this month
  const totalEarningsThisMonth = sessionsThisMonth.reduce(
    (total, session) => total + session.amount, 0
  );
  
  // Get user's payouts
  const userPayouts = mockPayouts.filter(
    payout => payout.mentorId === currentUser.id
  );
  
  // Latest payout
  const latestPayout = userPayouts.length > 0 
    ? userPayouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;
  
  // Upcoming sessions
  const upcomingSessions = userSessions
    .filter(session => new Date(session.date) > today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  // Navigate to sessions
  const handleViewAllSessions = () => {
    navigate('/mentor/sessions');
  };
  
  // Navigate to payouts
  const handleViewAllPayouts = () => {
    navigate('/mentor/payouts');
  };
  
  return (
    <MentorLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome, {currentUser.name}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's an overview of your sessions and earnings
        </p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sessions This Month</p>
              <p className="text-2xl font-bold">{sessionCount}</p>
              <div className={`flex items-center text-xs mt-2 ${sessionCountDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {sessionCountDiff >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                <span>{Math.abs(sessionCountPct)}% from last month</span>
              </div>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hours This Month</p>
              <p className="text-2xl font-bold">{totalHours}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Across {sessionCount} sessions
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Earnings This Month</p>
              <p className="text-2xl font-bold">{formatCurrency(totalEarningsThisMonth)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Base Rate: {formatCurrency(currentUser.baseRate)}/hr
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Latest Payout */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-5 bg-purple-50 dark:bg-purple-900/30 border-b border-purple-100 dark:border-purple-900/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Latest Payout</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewAllPayouts}
              >
                View All
              </Button>
            </div>
          </div>
          
          <div className="p-5">
            {latestPayout ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payout ID</p>
                    <p className="font-medium">{latestPayout.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</p>
                    <p className="font-medium">{formatDate(latestPayout.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                    <p className={`text-sm font-medium px-2 py-1 rounded-full inline-flex ${
                      latestPayout.status === 'paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : latestPayout.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {latestPayout.status.charAt(0).toUpperCase() + latestPayout.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                    <p className="font-medium text-lg text-green-600 dark:text-green-400">
                      {formatCurrency(latestPayout.totalAmount)}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download size={14} />}
                    onClick={() => navigate(`/receipt/${latestPayout.id}`)}
                  >
                    Download Receipt
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No payout records found</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Upcoming Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-5 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-100 dark:border-blue-900/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Upcoming Sessions</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewAllSessions}
              >
                View All
              </Button>
            </div>
          </div>
          
          <div className="p-5">
            {upcomingSessions.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="py-3">
                    <h3 className="font-medium">{session.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(session.date)}
                      </div>
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(session.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No upcoming sessions</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            onClick={() => navigate('/mentor/sessions')}
            className="justify-start"
          >
            <Clock size={16} className="mr-2" />
            View All Sessions
          </Button>
          <Button 
            onClick={() => navigate('/mentor/payouts')}
            variant="secondary"
            className="justify-start"
          >
            <DollarSign size={16} className="mr-2" />
            Payment History
          </Button>
          <Button 
            onClick={() => navigate('/chat')}
            variant="outline"
            className="justify-start"
          >
            <Clock size={16} className="mr-2" />
            Contact Admin
          </Button>
          <Button 
            onClick={() => navigate('/mentor/profile')}
            variant="outline"
            className="justify-start"
          >
            <Clock size={16} className="mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>
    </MentorLayout>
  );
};

export default MentorDashboard;
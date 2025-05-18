import { useState, useEffect } from 'react';
import { 
  BarChart, ArrowDown, ArrowUp, Clock, DollarSign, Calendar, Download 
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import MentorLayout from '@/components/layout/MentorLayout';
import Button from '@/components/common/Button';
import { formatCurrency, formatDate } from '@/utils/format';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const MentorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;

      try {
        const sessionsRef = collection(db, 'sessions');
        const q = query(sessionsRef, where('userId', '==', user.id));
        const querySnapshot = await getDocs(q);

        const fetchedSessions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setSessions(fetchedSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  const sessionsThisMonth = sessions.filter(
    session => new Date(session.date).getMonth() === thisMonth && 
               new Date(session.date).getFullYear() === thisYear
  );

  const sessionsLastMonth = sessions.filter(
    session => new Date(session.date).getMonth() === (thisMonth - 1 + 12) % 12 &&
               new Date(session.date).getFullYear() === (thisMonth === 0 ? thisYear - 1 : thisYear)
  );

  const sessionCount = sessionsThisMonth.length;
  const sessionCountDiff = sessionCount - sessionsLastMonth.length;
  const sessionCountPct = sessionsLastMonth.length
    ? Math.round(sessionCountDiff / sessionsLastMonth.length * 100)
    : 100;

  const totalHours = sessionsThisMonth.reduce(
    (total, session) => total + session.duration, 0
  );

  const totalEarningsThisMonth = sessionsThisMonth.reduce(
    (total, session) => total + session.amount, 0
  );

  const upcomingSessions = sessions
    .filter(session => new Date(session.date) > today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  if (isLoading) {
    return (
      <MentorLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500"></div>
        </div>
      </MentorLayout>
    );
  }

  return (
    <MentorLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's an overview of your sessions and earnings
        </p>
      </div>

      {/* Stats Cards */}
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
                From completed sessions
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-5 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-100 dark:border-blue-900/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upcoming Sessions</h3>
            <Button variant="outline" size="sm" onClick={() => navigate('/mentor/sessions')}>
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

      {/* Quick Links */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button onClick={() => navigate('/mentor/sessions')} className="justify-start">
            <Clock size={16} className="mr-2" />
            View All Sessions
          </Button>
          <Button onClick={() => navigate('/mentor/payouts')} variant="secondary" className="justify-start">
            <DollarSign size={16} className="mr-2" />
            Payment History
          </Button>
          <Button onClick={() => navigate('/chat')} variant="outline" className="justify-start">
            <Clock size={16} className="mr-2" />
            Contact Admin
          </Button>
          <Button onClick={() => navigate('/mentor/profile')} variant="outline" className="justify-start">
            <Clock size={16} className="mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>
    </MentorLayout>
  );
};

export default MentorDashboard;

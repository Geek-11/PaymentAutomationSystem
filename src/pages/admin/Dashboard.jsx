import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { BarChart, ArrowDown, ArrowUp, Users, Clock, DollarSign, BarChart4 } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/common/Button';
import { formatCurrency } from '@/utils/format';
import { usePayout } from '@/hooks/usePayout';

const AdminDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const{payouts:orignalPayout}=usePayout();

  // const showTotal= orignalPayout.reduce((sum,curr)=>sum=sum+curr.amount,0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sessions
        const sessionsRef = collection(db, 'sessions');
        const sessionsSnapshot = await getDocs(sessionsRef);
        const fetchedSessions = sessionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSessions(fetchedSessions);
        
        // Fetch mentors
        const mentorsRef = collection(db, 'users');
        const mentorsQuery = query(mentorsRef, where('role', '==', 'mentor'));
        const mentorsSnapshot = await getDocs(mentorsQuery);
        const fetchedMentors = mentorsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMentors(fetchedMentors);
        
        // Fetch payouts
        const payoutsRef = collection(db, 'payouts');
        const payoutsSnapshot = await getDocs(payoutsRef);
        const fetchedPayouts = payoutsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPayouts(fetchedPayouts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter for this month's data
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
  const sessionCountPct = sessionsLastMonth.length ? Math.round(sessionCountDiff / sessionsLastMonth.length * 100) : 100;
  const totalPayout = payouts.reduce((sum, payout) => sum + payout.amount, 0);
  const avgSessionRate = sessionsThisMonth.length 
    ? Math.round(sessionsThisMonth.reduce((sum, session) => sum + session.amount, 0) / sessionsThisMonth.length) 
    : 0;
  
  const activeMentors = mentors.filter(mentor => mentor.isActive).length;
  
  // Session types distribution
  const sessionTypeCount = {
    live: sessionsThisMonth.filter(s => s.type === 'live').length,
    evaluation: sessionsThisMonth.filter(s => s.type === 'evaluation').length,
    recording: sessionsThisMonth.filter(s => s.type === 'recording').length,
  };
  
  const totalSessionTypes = Object.values(sessionTypeCount).reduce((a, b) => a + b, 0);
  
  // Recent activity - combine sessions and payouts and sort by date
  const recentActivities = [
    ...sessions.slice(0, 5).map(session => ({
      id: session.id,
      type: 'session',
      title: `New session with ${session.userName}`,
      date: new Date(session.date),
      amount: session.amount
    })),
    ...payouts.slice(0, 5).map(payout => ({
      id: payout.id,
      type: 'payout',
      title: `Payout sent to ${payout.mentorName}`,
      date: new Date(payout.date),
      amount: payout.totalAmount
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Overview of your EdTech platform's mentor payment metrics
        </p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Sessions</p>
              <p className="text-2xl font-bold">{sessionCount}</p>
              <div className={`flex items-center text-xs mt-2 ${sessionCountDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {sessionCountDiff >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                <span>{Math.abs(sessionCountPct)}% from last month</span>
              </div>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Active Mentors</p>
              <p className="text-2xl font-bold">{activeMentors}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Out of {mentors.length} total mentors
              </p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Avg Session Rate</p>
              <p className="text-2xl font-bold">{formatCurrency(avgSessionRate)}/hr</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Based on {sessionsThisMonth.length} sessions
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
              <BarChart className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Payouts</p>
              <p className="text-2xl font-bold">{formatCurrency(totalPayout)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                For {payouts.length} payouts
              </p>
            </div>
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded">
              <DollarSign className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Session types distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Session Types</h2>
          
          {totalSessionTypes > 0 ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Live Sessions</span>
                  <span className="text-sm font-medium">{Math.round(sessionTypeCount.live / totalSessionTypes * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${(sessionTypeCount.live / totalSessionTypes * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Evaluations</span>
                  <span className="text-sm font-medium">{Math.round(sessionTypeCount.evaluation / totalSessionTypes * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(sessionTypeCount.evaluation / totalSessionTypes * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Recording Reviews</span>
                  <span className="text-sm font-medium">{Math.round(sessionTypeCount.recording / totalSessionTypes * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ width: `${(sessionTypeCount.recording / totalSessionTypes * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <BarChart4 className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No session data available for this period</p>
            </div>
          )}
        </div>
        
        {/* Recent activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          
          {recentActivities.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentActivities.map((activity) => (
                <div key={`${activity.type}-${activity.id}`} className="py-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{activity.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${activity.type === 'payout' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {activity.type === 'payout' ? '-' : '+'}{formatCurrency(activity.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <p>No recent activity to display</p>
            </div>
          )}
          
          <div className="mt-4 text-right">
            <Button variant="outline" size="sm">View All Activity</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
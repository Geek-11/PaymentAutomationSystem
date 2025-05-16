import { useState } from 'react';
import MentorLayout from '@/components/layout/MentorLayout';
import { Calendar, Download, Filter, Search } from 'lucide-react';
import { mockSessions } from '@/data/mockData';
import { mockUser } from '@/data/mockUser';
import { formatCurrency, formatDate, formatTime, formatDuration } from '@/utils/format';
import DateRangePicker from '@/components/common/DateRangePicker';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

const MentorSessions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter sessions for the current user
  const userSessions = mockSessions.filter(
    session => session.mentor.id === mockUser.id
  );
  
  // Apply filters
  const filteredSessions = userSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDateRange = 
      (!dateRange.from || new Date(session.date) >= dateRange.from) &&
      (!dateRange.to || new Date(session.date) <= dateRange.to);
    
    return matchesSearch && matchesDateRange;
  });
  
  const handleExportSessions = () => {
    // In a real app, this would generate and download a CSV file
    toast.success('Session history exported successfully');
  };
  
  return (
    <MentorLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Session History</h1>
        <p className="text-gray-600 dark:text-gray-300">
          View all your past and upcoming sessions
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search sessions..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="whitespace-nowrap"
              >
                <Filter size={16} className="mr-2" />
                Filters
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportSessions}
                className="whitespace-nowrap"
              >
                <Download size={16} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Range
              </label>
              <DateRangePicker 
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Date</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Title</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Type</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Duration</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Rate</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => (
                  <tr 
                    key={session.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm flex items-center">
                      <Calendar size={14} className="text-gray-400 mr-1" />
                      {formatDate(session.date)}
                    </td>
                    <td className="px-4 py-3 text-sm">{session.title}</td>
                    <td className="px-4 py-3 text-sm capitalize">{session.type}</td>
                    <td className="px-4 py-3 text-sm">{formatDuration(session.duration)}</td>
                    <td className="px-4 py-3 text-sm">{formatCurrency(session.rate)}/hr</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {formatCurrency(session.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    No sessions found. Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MentorLayout>
  );
};

export default MentorSessions;
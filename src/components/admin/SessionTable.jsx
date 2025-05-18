import { useState } from 'react';
import { Calendar, Clock, Search, Filter, Plus, Download, Edit, Trash } from 'lucide-react';
import DateRangePicker from '@/components/common/DateRangePicker';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { formatDate, formatTime, formatDuration, formatCurrency } from '@/utils/format';
import { useUser } from '@/hooks/useUser';
import { BASE_RATES } from '@/types/user';
import { useSessions } from '@/hooks/useSessions';

const SessionTable = ({
  onAddSession,
  onEditSession,
  onDeleteSession,
  onExportSessions 
}) => {
  const { sessions } = useSessions();
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionType, setSessionType] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null
  });
  const [showFilters, setShowFilters] = useState(false);
  const { mentors } = useUser();
  
  // Filter sessions based on search, type and date range
  const filteredSessions = sessions.filter(session => {
    
    const matchesSearch = 
      session.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      sessionType === 'all' || session.type === sessionType;
    
    const matchesDateRange = 
      (!dateRange.from || new Date(session.date) >= dateRange.from) &&
      (!dateRange.to || new Date(session.date) <= dateRange.to);
    
    return matchesSearch && matchesType && matchesDateRange;
  });
  
  const sessionTypeColors = {
    'live': 'green',
    'evaluation': 'blue',
    'recording': 'purple'
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sessions or mentors..."
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
            <Button onClick={onAddSession} className="whitespace-nowrap">
              <Plus size={16} className="mr-2" />
              Add Session
            </Button>
            <Button 
              variant="outline" 
              onClick={onExportSessions}
              className="whitespace-nowrap"
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Session Type
              </label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              >
                <option value="all">All Types</option>
                <option value="live">Live Sessions</option>
                <option value="evaluation">Evaluations</option>
                <option value="recording">Recording Reviews</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Range
              </label>
              <DateRangePicker 
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 text-left">
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Mentor</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Session Title</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Type</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Date</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Duration</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Rate</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Amount</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <tr 
                  key={session.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-3 text-sm">{session.userName}</td>
                  <td className="px-4 py-3 text-sm">{session.title}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge 
                      color={sessionTypeColors[session.type]} 
                      size="sm"
                    >
                      {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className='flex items-center'>
                      <Calendar size={14} className="text-gray-400 mr-1" />
                      {formatDate(session.date)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className='flex items-center'>
                      <Clock size={14} className="text-gray-400 mr-1" />
                      {formatDuration(session.duration)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(BASE_RATES[mentors.find(mentor => (mentor.id === session.userId)).mentorType])}/hr</td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {formatCurrency(session.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditSession(session)}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Edit session"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteSession(session.id)}
                        className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        aria-label="Delete session"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  No sessions found. Try adjusting your filters or add a new session.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionTable;
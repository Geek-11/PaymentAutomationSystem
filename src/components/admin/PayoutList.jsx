import { useState } from 'react';
import { Search, FileText, Calendar, PlusCircle, Eye, Mail, PlayCircle } from 'lucide-react';
import Button from '@/components/common/Button';
import { formatCurrency, formatDate } from '@/utils/format';
import { useSessions } from '@/hooks/useSessions';

const PayoutList = ({
  payouts,
  onGeneratePayout,
  onViewReceipt,
  onSimulatePayout,
  onSendReceipt
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { sessions } = useSessions();
  
  const filteredPayouts = payouts.filter(payout => {
    console.log(payout);
    
    const matchesSearch = 
      // payout.mentorName
      sessions.find(session => session?.userId == payout?.userId)?.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || payout.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    review: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
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
              placeholder="Search payouts or mentors..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="review">Under Review</option>
            </select>
            
            <Button onClick={onGeneratePayout} className="whitespace-nowrap">
              <PlusCircle size={16} className="mr-2" />
              Generate Payout
            </Button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 text-left">
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">ID</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Mentor</th>
              {/* <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Date</th> */}
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Sessions</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Amount</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Status</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPayouts.length > 0 ? (
              filteredPayouts.map((payout) => (
                <tr 
                  key={payout.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium">{payout.id}</td>
                  <td className="px-4 py-3 text-sm">{sessions.find(session => session.userId === payout.userId)?.userName || "UNKNOWN"}</td>
                  {/* <td className="px-4 py-3 text-sm flex items-center">
                    <Calendar size={14} className="text-gray-400 mr-1" />
                    {formatDate(payout.date)}
                  </td> */}
                  <td className="px-4 py-3 text-sm">{payout.sessions.length}</td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {formatCurrency(payout.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[payout.status]}`}>
                      {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewReceipt(payout.id)}
                        className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        aria-label="View receipt"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onSimulatePayout(payout.id)}
                        className="p-1 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                        aria-label="Simulate payout"
                      >
                        <PlayCircle size={16} />
                      </button>
                      <button
                        onClick={() => onSendReceipt(payout.id)}
                        className="p-1 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                        aria-label="Send receipt"
                      >
                        <Mail size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  No payouts found. Try adjusting your filters or generate a new payout.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutList;

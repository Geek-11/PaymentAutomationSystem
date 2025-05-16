import { useState } from 'react';
import { Search, Mail, Clock, DollarSign, UserPlus, Edit, Trash } from 'lucide-react';
import { Mentor } from '@/types/user';
import Button from '@/components/common/Button';
import { formatCurrency } from '@/utils/format';

interface MentorListProps {
  mentors: Mentor[];
  onAddMentor: () => void;
  onEditMentor: (mentor: Mentor) => void;
  onDeleteMentor: (mentorId: string) => void;
  onViewSessions: (mentorId: string) => void;
  onViewPayouts: (mentorId: string) => void;
  onStartChat: (mentorId: string) => void;
}

const MentorList = ({
  mentors,
  onAddMentor,
  onEditMentor,
  onDeleteMentor,
  onViewSessions,
  onViewPayouts,
  onStartChat
}: MentorListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMentors = mentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search mentors..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={onAddMentor} className="whitespace-nowrap">
            <UserPlus size={16} className="mr-2" />
            Add Mentor
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 text-left">
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Name</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Email</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Base Rate</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Status</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredMentors.length > 0 ? (
              filteredMentors.map((mentor) => (
                <tr 
                  key={mentor.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {mentor.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Joined {new Date(mentor.joinedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{mentor.email}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(mentor.baseRate)}/hr</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      mentor.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {mentor.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => onViewSessions(mentor.id)}
                        className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" 
                        title="View Sessions"
                      >
                        <Clock size={16} />
                      </button>
                      <button 
                        onClick={() => onViewPayouts(mentor.id)}
                        className="p-1 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400" 
                        title="View Payouts"
                      >
                        <DollarSign size={16} />
                      </button>
                      <button 
                        onClick={() => onStartChat(mentor.id)}
                        className="p-1 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400" 
                        title="Message"
                      >
                        <Mail size={16} />
                      </button>
                      <button 
                        onClick={() => onEditMentor(mentor)}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" 
                        title="Edit Mentor"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteMentor(mentor.id)}
                        className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400" 
                        title="Delete Mentor"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  No mentors found. Try adjusting your search or add a new mentor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MentorList;
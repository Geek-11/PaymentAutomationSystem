import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import Button from '@/components/common/Button';
import { formatCurrency } from '@/utils/format';
import DateRangePicker from '@/components/common/DateRangePicker';

const GeneratePayoutForm = ({ onSave, onCancel }) => {
  const [mentors, setMentors] = useState([]);
  const [selectedMentorId, setSelectedMentorId] = useState('');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('pending');
  const [platformFeePercentage, setPlatformFeePercentage] = useState(5);
  const [gstPercentage, setGstPercentage] = useState(18);
  const [isSimulating, setIsSimulating] = useState(false);
  const [filteredSessions, setFilteredSessions] = useState([]);
  
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const mentorsRef = collection(db, 'users');
        const q = query(mentorsRef, where('role', '==', 'mentor'));
        const querySnapshot = await getDocs(q);
        
        const fetchedMentors = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setMentors(fetchedMentors);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };
    
    fetchMentors();
  }, []);
  
  useEffect(() => {
    const fetchSessions = async () => {
      if (selectedMentorId && dateRange.from && dateRange.to) {
        try {
          const sessionsRef = collection(db, 'sessions');
          const q = query(
            sessionsRef,
            where('userId', '==', selectedMentorId),
            where('date', '>=', dateRange.from.toISOString()),
            where('date', '<=', dateRange.to.toISOString())
          );
          const querySnapshot = await getDocs(q);
          
          const sessions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setFilteredSessions(sessions);
        } catch (error) {
          console.error('Error fetching sessions:', error);
        }
      } else {
        setFilteredSessions([]);
      }
    };
    
    fetchSessions();
  }, [selectedMentorId, dateRange]);
  
  const selectedMentor = mentors.find(m => m.id === selectedMentorId);
  const subtotal = filteredSessions.reduce((total, session) => total + session.amount, 0);
  const platformFee = (subtotal * platformFeePercentage) / 100;
  const gstAmount = (subtotal * gstPercentage) / 100;
  const totalAmount = subtotal - platformFee - gstAmount;
  
  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1500);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedMentor || filteredSessions.length === 0) return;
    
    const payout = {
      id: `payout-${Date.now()}`,
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      mentorEmail: selectedMentor.email,
      date: new Date().toISOString(),
      sessionsCount: filteredSessions.length,
      totalAmount,
      subtotal,
      charges: [
        {
          name: 'Platform Fee',
          amount: platformFee,
          type: 'percentage'
        },
        {
          name: 'GST',
          amount: gstAmount,
          type: 'percentage'
        }
      ],
      notes,
      status
    };
    
    onSave(payout);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="mentorId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Mentor
          </label>
          <select
            id="mentorId"
            name="mentorId"
            value={selectedMentorId}
            onChange={(e) => setSelectedMentorId(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            required
          >
            <option value="">Select a mentor</option>
            {mentors.map(mentor => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date Range
          </label>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
        
        <div>
          <label htmlFor="platformFee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Platform Fee (%)
          </label>
          <input
            type="number"
            id="platformFee"
            name="platformFee"
            min="0"
            max="100"
            step="0.1"
            value={platformFeePercentage}
            onChange={(e) => setPlatformFeePercentage(parseFloat(e.target.value))}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
          />
        </div>
        
        <div>
          <label htmlFor="gst" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            GST (%)
          </label>
          <input
            type="number"
            id="gst"
            name="gst"
            min="0"
            max="100"
            step="0.1"
            value={gstPercentage}
            onChange={(e) => setGstPercentage(parseFloat(e.target.value))}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Payout Status
          </label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="review">Under Review</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            placeholder="Additional notes for this payout..."
          />
        </div>
      </div>
      
      {/* Session list */}
      {filteredSessions.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium">Sessions Included ({filteredSessions.length})</h3>
          </div>
          <div className="overflow-x-auto max-h-48">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Duration</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-2 text-xs">
                      {new Date(session.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-xs">{session.title}</td>
                    <td className="px-4 py-2 text-xs capitalize">{session.type}</td>
                    <td className="px-4 py-2 text-xs">{session.duration} hr</td>
                    <td className="px-4 py-2 text-xs text-right">{formatCurrency(session.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
        <h3 className="text-md font-medium mb-3">Payout Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Sessions Count:</span>
            <span className="text-sm font-medium">{filteredSessions.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Subtotal:</span>
            <span className="text-sm font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Platform Fee ({platformFeePercentage}%):</span>
            <span className="text-sm font-medium text-red-600 dark:text-red-400">- {formatCurrency(platformFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">GST ({gstPercentage}%):</span>
            <span className="text-sm font-medium text-red-600 dark:text-red-400">- {formatCurrency(gstAmount)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
            <span className="font-medium">Total Payout:</span>
            <span className="font-bold">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={handleSimulate}
          isLoading={isSimulating}
        >
          Simulate
        </Button>
        <Button 
          type="submit" 
          disabled={filteredSessions.length === 0 || isSimulating}
        >
          Generate Payout
        </Button>
      </div>
    </form>
  );
};

export default GeneratePayoutForm;
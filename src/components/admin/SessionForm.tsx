import { useState, useEffect } from 'react';
import { Session, SessionType } from '@/types/session';
import { mockMentors } from '@/data/mockData';
import Button from '@/components/common/Button';

interface SessionFormProps {
  session: Session | null;
  onSave: (session: Session) => void;
  onCancel: () => void;
}

const SessionForm = ({ session, onSave, onCancel }: SessionFormProps) => {
  const [formData, setFormData] = useState<Omit<Session, 'id'>>({
    mentor: {
      id: '',
      name: '',
    },
    title: '',
    type: 'live',
    date: '',
    startTime: '',
    endTime: '',
    duration: 1,
    rate: 0,
    amount: 0,
    notes: '',
  });
  
  useEffect(() => {
    if (session) {
      // Convert date to YYYY-MM-DD for date input
      const sessionDate = new Date(session.date);
      const formattedDate = sessionDate.toISOString().split('T')[0];
      
      setFormData({
        ...session,
        date: formattedDate
      });
    } else {
      // Set today's date as default for new sessions
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        date: today
      }));
    }
  }, [session]);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If mentor changes, update mentor name and rate
    if (name === 'mentorId') {
      const selectedMentor = mockMentors.find(m => m.id === value);
      if (selectedMentor) {
        setFormData(prev => ({
          ...prev,
          mentor: {
            id: selectedMentor.id,
            name: selectedMentor.name
          },
          rate: selectedMentor.baseRate
        }));
      }
    }
    
    // If duration or rate changes, calculate amount
    if (name === 'duration' || name === 'rate') {
      const duration = name === 'duration' ? parseFloat(value) : formData.duration;
      const rate = name === 'rate' ? parseFloat(value) : formData.rate;
      
      if (!isNaN(duration) && !isNaN(rate)) {
        setFormData(prev => ({
          ...prev,
          amount: duration * rate
        }));
      }
    }
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Calculate duration when both start and end times are present
    if ((name === 'startTime' || name === 'endTime') && formData.startTime && formData.endTime) {
      const startTime = name === 'startTime' ? value : formData.startTime;
      const endTime = name === 'endTime' ? value : formData.endTime;
      
      // Calculate duration in hours
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        
        if (durationHours > 0) {
          setFormData(prev => ({
            ...prev,
            duration: durationHours,
            amount: durationHours * prev.rate
          }));
        }
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare date in ISO format
    const sessionDate = new Date(formData.date);
    const sessionDateTime = formData.startTime 
      ? `${formData.date}T${formData.startTime}:00` 
      : sessionDate.toISOString();
    
    onSave({
      id: session?.id || `session-${Date.now()}`,
      ...formData,
      date: sessionDateTime
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="mentorId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mentor
          </label>
          <select
            id="mentorId"
            name="mentorId"
            value={formData.mentor.id}
            onChange={handleInputChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            required
          >
            <option value="">Select a mentor</option>
            {mockMentors.map(mentor => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.name} (₹{mentor.baseRate}/hr)
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Session Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            required
          >
            <option value="live">Live Session</option>
            <option value="evaluation">Evaluation</option>
            <option value="recording">Recording Review</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Session Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            required
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            required
          />
        </div>
        
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleTimeChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
          />
        </div>
        
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleTimeChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
          />
        </div>
        
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Duration (hours)
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            min="0.5"
            step="0.5"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            required
          />
        </div>
        
        <div>
          <label htmlFor="rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rate (₹/hour)
          </label>
          <input
            type="number"
            id="rate"
            name="rate"
            min="0"
            step="100"
            value={formData.rate}
            onChange={handleInputChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleInputChange}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
        />
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-4">
        <h3 className="text-md font-medium mb-2">Session Summary</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
          Total Amount: <span className="font-semibold text-green-600 dark:text-green-400">₹{formData.amount}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Calculated as: {formData.duration} hours × ₹{formData.rate}/hour
        </p>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {session ? 'Update Session' : 'Add Session'}
        </Button>
      </div>
    </form>
  );
};

export default SessionForm;
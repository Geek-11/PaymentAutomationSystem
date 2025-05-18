import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import Button from '@/components/common/Button';
import { BASE_RATES } from '@/types/user';

const SessionForm = ({ session, onSave, onCancel }) => {
  const [mentors, setMentors] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    title: '',
    type: 'live',
    date: '',
    startTime: '',
    endTime: '',
    duration: 1,
    amount: 0,
    notes: ''
  });
  
  
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
    if (session) {      
      const sessionDate = new Date(session.date);
      const formattedDate = sessionDate.toISOString().split('T')[0];
      
      setFormData({
        ...session,
        date: formattedDate
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        date: today
      }));
    }
  }, [session]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = {
    ...formData,
    [name]: value
  };
    
    setFormData(updatedForm);    

    // If mentor changes, update userName
    if (name === 'userId') {
      const selectedMentor = mentors.find(m => m.id === value);
      if (selectedMentor) {
        updatedForm.userName = selectedMentor.name;
        setFormData(updatedForm);
      }
    }
    
    // Calculate duration and amount when times change
    
    if (name === 'startTime' || name === 'endTime') {     
      
      if (updatedForm.startTime && updatedForm.endTime) {
        const start = new Date(`2000-01-01T${updatedForm.startTime}`);
        const end = new Date(`2000-01-01T${updatedForm.endTime}`);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {

          const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          
          if (durationHours > 0) {
            const selectedMentor = mentors.find(m => m.id === updatedForm.userId);
            
            const baseRate = selectedMentor?.mentorType 
              ? BASE_RATES[selectedMentor.mentorType]
              : 0;
            
            updatedForm.duration = durationHours;
            updatedForm.amount = durationHours * baseRate;
            setFormData(updatedForm);
          }
        }
      }
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare date in ISO format
    const sessionDate = new Date(formData.date);
    
    const sessionEndDateTimeStr = `${formData.date}T${formData.endTime}:00`;
    const sessionEndDateTime = new Date(sessionEndDateTimeStr);
    const currentDateTime = new Date();
    const status = sessionEndDateTime > currentDateTime ? 'Pending' : 'Completed';

    const sessionDateTime = formData.startTime 
      ? `${formData.date}T${formData.startTime}:00` 
      : sessionDate.toISOString();
    
    onSave({
      id: session?.id || '',
      ...formData,
      date: sessionDateTime,
      status
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mentor
          </label>
          <select
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            required
          >
            <option value="">Select a mentor</option>
            {mentors.map(mentor => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.name} ({mentor.mentorType})
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
            onChange={handleInputChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            required
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
          Duration: {formData.duration} hours
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Total Amount: <span className="font-semibold text-green-600 dark:text-green-400">₹{formData.amount}</span>
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
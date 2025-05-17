import { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

const SessionUpload = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState([]);

  const validateSession = (session) => {
    const errors = [];
    
    if (!session.userId) errors.push('User ID is required');
    if (!session.userName) errors.push('User Name is required');
    if (!session.title) errors.push('Title is required');
    if (!['live', 'evaluation', 'recording'].includes(session.type)) {
      errors.push('Invalid session type');
    }
    if (!session.date) errors.push('Date is required');
    if (!session.startTime) errors.push('Start time is required');
    if (!session.endTime) errors.push('End time is required');

    return errors;
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Convert to hours
  };

  const calculateAmount = (duration, userId) => {
    // In a real app, fetch the mentor's base rate from Firestore
    // For now, using a default rate of 3000 per hour
    const hourlyRate = 3000;
    return duration * hourlyRate;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrors([]);

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const sessions = results.data;
          const validationErrors = [];
          const processedSessions = [];

          sessions.forEach((session, index) => {
            const rowErrors = validateSession(session);
            if (rowErrors.length > 0) {
              validationErrors.push(`Row ${index + 1}: ${rowErrors.join(', ')}`);
              return;
            }

            const duration = calculateDuration(session.startTime, session.endTime);
            const amount = calculateAmount(duration, session.userId);

            processedSessions.push({
              id: '', // Will be set by Firestore
              userId: session.userId,
              userName: session.userName,
              title: session.title,
              type: session.type,
              date: session.date,
              startTime: session.startTime,
              endTime: session.endTime,
              duration,
              amount,
              notes: session.notes
            });
          });

          if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
          }

          // Upload sessions to Firestore
          const sessionsRef = collection(db, 'sessions');
          await Promise.all(
            processedSessions.map(session => addDoc(sessionsRef, session))
          );

          toast.success('Sessions uploaded successfully');
          onUploadComplete();
        } catch (error) {
          console.error('Error uploading sessions:', error);
          toast.error('Failed to upload sessions');
        } finally {
          setIsUploading(false);
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setErrors(['Failed to parse CSV file']);
        setIsUploading(false);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="csv-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="csv-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="h-12 w-12 text-gray-400 mb-3" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isUploading ? 'Uploading...' : 'Click to upload CSV'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            CSV should include: userId, userName, title, type, date, startTime, endTime, notes
          </span>
        </label>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Upload Errors
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <h4 className="font-medium mb-2">CSV Format Example:</h4>
        <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
          userId,userName,title,type,date,startTime,endTime,notes{'\n'}
          user123,John Doe,React Basics,live,2025-03-20,09:00,11:00,Introduction to React
        </pre>
      </div>
    </div>
  );
};

export default SessionUpload;
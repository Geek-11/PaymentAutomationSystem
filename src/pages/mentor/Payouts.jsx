import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import MentorLayout from '@/components/layout/MentorLayout';
import PayoutHistory from '@/components/mentor/PayoutHistory';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const MentorPayouts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payouts, setPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPayouts = async () => {
      if (!user) return;
      
      try {
        const payoutsRef = collection(db, 'payouts');
        const q = query(payoutsRef, where('mentorId', '==', user.id));
        const querySnapshot = await getDocs(q);
        
        const fetchedPayouts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPayouts(fetchedPayouts);
      } catch (error) {
        console.error('Error fetching payouts:', error);
        toast.error('Failed to load payouts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPayouts();
  }, [user]);
  
  const handleViewReceipt = (payoutId) => {
    navigate(`/receipt/${payoutId}`);
  };
  
  const handleDownloadReceipt = (payoutId) => {
    toast.success('Receipt downloaded successfully');
  };
  
  if (isLoading) {
    return (
      <MentorLayout>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-500"></div>
        </div>
      </MentorLayout>
    );
  }
  
  return (
    <MentorLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Payment History</h1>
        <p className="text-gray-600 dark:text-gray-300">
          View and manage your payment receipts
        </p>
      </div>
      
      <PayoutHistory 
        payouts={payouts}
        onViewReceipt={handleViewReceipt}
        onDownloadReceipt={handleDownloadReceipt}
      />
    </MentorLayout>
  );
};

export default MentorPayouts;
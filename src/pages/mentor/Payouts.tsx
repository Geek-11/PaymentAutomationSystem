import { useState } from 'react';
import MentorLayout from '@/components/layout/MentorLayout';
import PayoutHistory from '@/components/mentor/PayoutHistory';
import { mockPayouts } from '@/data/mockData';
import { mockUser } from '@/data/mockUser';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MentorPayouts = () => {
  const navigate = useNavigate();
  
  // Filter payouts for the current user
  const userPayouts = mockPayouts.filter(
    payout => payout.mentorId === mockUser.id
  );
  
  const handleViewReceipt = (payoutId: string) => {
    navigate(`/receipt/${payoutId}`);
  };
  
  const handleDownloadReceipt = (payoutId: string) => {
    // In a real app, this would download the receipt as a PDF
    toast.success('Receipt downloaded successfully');
  };
  
  return (
    <MentorLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Payment History</h1>
        <p className="text-gray-600 dark:text-gray-300">
          View and manage your payment receipts
        </p>
      </div>
      
      <PayoutHistory 
        payouts={userPayouts}
        onViewReceipt={handleViewReceipt}
        onDownloadReceipt={handleDownloadReceipt}
      />
    </MentorLayout>
  );
};

export default MentorPayouts;
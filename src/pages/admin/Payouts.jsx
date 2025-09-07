import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import AdminLayout from '@/components/layout/AdminLayout';
import PayoutList from '@/components/admin/PayoutList';
import GeneratePayoutForm from '@/components/admin/GeneratePayoutForm';
import Modal from '@/components/common/Modal';
import { mockPayouts, mockMentors } from '@/data/mockData';
import toast from 'react-hot-toast';
import { useSessions } from '@/hooks/useSessions';
import { usePayout } from '@/hooks/usePayout';

const Payouts = () => {
  const {payouts, setPayouts,isLoading, generateReceipt} = usePayout();
  const { sessions } = useSessions();
  
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleGeneratePayout = () => {
    setIsGenerateModalOpen(true);
  };
  
  const handleSavePayout = (payout) => {
    setPayouts([...payouts, { ...payout, id: `payout-${Date.now()}` }]);
    setIsGenerateModalOpen(false);
    toast.success('Payout generated successfully');
  };
  
  const handleViewReceipt = (payoutId) => {
    navigate(`/receipt/${payoutId}`);
  };
  
  const handleSimulatePayout = (payoutId) => {
    toast.success('Payout simulation started');
  };
  
  const handleSendReceipt = (payoutId) => {
    const payout = payouts.find(p => p.id === payoutId);
    const data = {
      id: payoutId,
      mentorId: payout.userId,
      mentorName: sessions.find(session => session.userId === payout.userId)?.userName,
      sessionIds: sessions,
      notes: 'abc',
      amount: payout.amount
    }
    generateReceipt(data, sessions);
    toast.success('Receipt sent to mentor');
  };
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Payouts</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Generate and manage mentor payouts
        </p>
      </div>
      
      <PayoutList 
        payouts={payouts}
        onGeneratePayout={handleGeneratePayout}
        onViewReceipt={handleViewReceipt}
        onSimulatePayout={handleSimulatePayout}
        onSendReceipt={handleSendReceipt}
      />
      
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate New Payout"
        size="lg"
      >
        <GeneratePayoutForm 
          mentors={mockMentors}
          onSave={handleSavePayout}
          onCancel={() => setIsGenerateModalOpen(false)}
        />
      </Modal>
    </AdminLayout>
  );
};

export default Payouts;
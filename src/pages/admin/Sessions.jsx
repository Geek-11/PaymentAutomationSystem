import { useState } from 'react';
import { collection, query, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import AdminLayout from '@/components/layout/AdminLayout';
import SessionTable from '@/components/admin/SessionTable';
import SessionForm from '@/components/admin/SessionForm';
import SessionUpload from '@/components/admin/SessionUpload';
import Modal from '@/components/common/Modal';
import toast from 'react-hot-toast';
import { useSessions } from '@/hooks/useSessions';
import { usePayout } from '@/hooks/usePayout';

const Sessions = () => {
  const { sessions, setSessions, isLoading, fetchSessions } = useSessions()
  const { payouts } = usePayout();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  
  
  const handleAddSession = () => {
    setCurrentSession(null);
    setIsModalOpen(true);
  };
  
  const handleEditSession = (session) => {
    setCurrentSession(session);
    setIsModalOpen(true);
    
  };
  
  const handleSaveSession = async (session) => {
    try {
      if (currentSession) {
        const sessionRef = doc(db, 'sessions', currentSession.id);
        await updateDoc(sessionRef, session);
        toast.success('Session updated successfully');
      } else {

        const newSessionRef = doc(collection(db, 'sessions'));

        session.id = newSessionRef.id;
        await setDoc(newSessionRef, session);

        toast.success('Session added successfully');
      }
      if(session.status === 'Completed'){
        const payout = payouts.find(payout => payout.userId === session.userId);
        console.log(payout);
        if(payout){
          const payoutRef = doc(db, 'payouts', payout.id);
          await updateDoc(payoutRef, { ...payout,
                                       amount: payout.amount+session.amount,
                                       sessions: [...payout.sessions, session.id]
                                     });
        } else{
          const newPayoutRef = await addDoc(collection(db, 'payouts'), {
            status: 'Pending',
            amount: session.amount,
            userId: session.userId, 
            sessions: [session.id]
          });
          // await addDoc(newPayoutRef);
        }
      }
      fetchSessions();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Failed to save session');
    }
  };
  
  const handleDeleteSession = async (sessionId) => {
    try {
      await deleteDoc(doc(db, 'sessions', sessionId));
      toast.success('Session deleted successfully');
      fetchSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  };
  
  const handleUploadComplete = () => {
    setIsUploadModalOpen(false);
    fetchSessions();
  };
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Sessions</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage mentor sessions and their details
        </p>
      </div>
      
      <SessionTable 
        sessions={sessions}
        onAddSession={handleAddSession}
        onEditSession={handleEditSession}
        onDeleteSession={handleDeleteSession}
        onExportSessions={() => setIsUploadModalOpen(true)}
      />
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSession ? "Edit Session" : "Add New Session"}
        size="lg"
      >
        <SessionForm 
          session={currentSession}
          onSave={handleSaveSession}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
      
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Sessions"
        size="lg"
      >
        <SessionUpload onUploadComplete={handleUploadComplete} />
      </Modal>
    </AdminLayout>
  );
};

export default Sessions;
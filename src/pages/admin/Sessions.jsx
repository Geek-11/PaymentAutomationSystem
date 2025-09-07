import { useState } from 'react';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
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
  const { sessions, setSessions, isLoading, fetchSessions } = useSessions();
  const { payouts, setPayouts } = usePayout();
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

  // 🔧 Helper function to handle payout creation or update
  const updateOrCreatePayout = async (session) => {
    let payout = payouts.find((p) => p.userId === session.userId);

    if (payout) {
      const sessionAlreadyExists = payout.sessions.includes(session.id);

      if (!sessionAlreadyExists) {
        const updatedPayout = {
          ...payout,
          amount: payout.amount + session.amount,
          sessions: [...payout.sessions, session.id],
        };

        const payoutRef = doc(db, 'payouts', payout.id);
        await setDoc(payoutRef, updatedPayout);
        setPayouts((prev) =>
          prev.map((p) => (p.id === payout.id ? updatedPayout : p))
        );
      }
    } else {
      const newPayout = {
        status: 'Pending',
        amount: session.amount,
        userId: session.userId,
        sessions: [session.id],
      };

      const newPayoutRef = await addDoc(collection(db, 'payouts'), newPayout);
      setPayouts([...payouts, { ...newPayout, id: newPayoutRef.id }]);
    }
  };

  const handleSaveSession = async (session) => {
    try {
      if (currentSession) {
        // Updating existing session
        const sessionRef = doc(db, 'sessions', currentSession.id);
        await setDoc(sessionRef, session);
        setSessions(sessions.map((s) => (s.id === session.id ? session : s)));
        toast.success('Session updated successfully');
      } else {
        // Adding new session
        const newSessionRef = doc(collection(db, 'sessions'));
        session.id = newSessionRef.id;
        await setDoc(newSessionRef, session);
        setSessions([...sessions, session]);
        toast.success('Session added successfully');
      }

      if (session.status === 'Completed') {
        await updateOrCreatePayout(session);
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
        onAddSession={handleAddSession}
        onEditSession={handleEditSession}
        onDeleteSession={handleDeleteSession}
        onExportSessions={() => setIsUploadModalOpen(true)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSession ? 'Edit Session' : 'Add New Session'}
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
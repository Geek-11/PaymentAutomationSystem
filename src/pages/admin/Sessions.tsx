import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import SessionTable from '@/components/admin/SessionTable';
import SessionForm from '@/components/admin/SessionForm';
import Modal from '@/components/common/Modal';
import { mockSessions } from '@/data/mockData';
import { Session } from '@/types/session';
import toast from 'react-hot-toast';

const Sessions = () => {
  const [sessions, setSessions] = useState(mockSessions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  
  const handleAddSession = () => {
    setCurrentSession(null);
    setIsModalOpen(true);
  };
  
  const handleEditSession = (session: Session) => {
    setCurrentSession(session);
    setIsModalOpen(true);
  };
  
  const handleSaveSession = (session: Session) => {
    if (currentSession) {
      // Edit existing session
      setSessions(
        sessions.map(s => s.id === session.id ? session : s)
      );
      toast.success('Session updated successfully');
    } else {
      // Add new session
      setSessions([...sessions, { ...session, id: `session-${Date.now()}` }]);
      toast.success('Session added successfully');
    }
    setIsModalOpen(false);
  };
  
  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    toast.success('Session deleted successfully');
  };
  
  const handleExportSessions = () => {
    // In a real app, this would generate and download a CSV file
    toast.success('Sessions exported successfully');
  };
  
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
        onExportSessions={handleExportSessions}
      />
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSession ? "Edit Session" : "Add New Session"}
      >
        <SessionForm 
          session={currentSession}
          onSave={handleSaveSession}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </AdminLayout>
  );
};

export default Sessions;
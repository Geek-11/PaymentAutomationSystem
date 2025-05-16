import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import MentorList from '@/components/admin/MentorList';
import MentorForm from '@/components/admin/MentorForm';
import Modal from '@/components/common/Modal';
import { mockMentors } from '@/data/mockData';
import { Mentor } from '@/types/user';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Mentors = () => {
  const [mentors, setMentors] = useState(mockMentors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMentor, setCurrentMentor] = useState<Mentor | null>(null);
  const navigate = useNavigate();
  
  const handleAddMentor = () => {
    setCurrentMentor(null);
    setIsModalOpen(true);
  };
  
  const handleEditMentor = (mentor: Mentor) => {
    setCurrentMentor(mentor);
    setIsModalOpen(true);
  };
  
  const handleSaveMentor = (mentor: Mentor) => {
    if (currentMentor) {
      // Edit existing mentor
      setMentors(
        mentors.map(m => m.id === mentor.id ? mentor : m)
      );
      toast.success('Mentor updated successfully');
    } else {
      // Add new mentor
      setMentors([...mentors, { ...mentor, id: `mentor-${Date.now()}` }]);
      toast.success('Mentor added successfully');
    }
    setIsModalOpen(false);
  };
  
  const handleDeleteMentor = (mentorId: string) => {
    setMentors(mentors.filter(m => m.id !== mentorId));
    toast.success('Mentor deleted successfully');
  };
  
  const handleViewSessions = (mentorId: string) => {
    navigate('/admin/sessions', { state: { mentorId } });
  };
  
  const handleViewPayouts = (mentorId: string) => {
    navigate('/admin/payouts', { state: { mentorId } });
  };
  
  const handleStartChat = (mentorId: string) => {
    navigate(`/chat/${mentorId}`);
  };
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Mentors</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage mentor profiles and their settings
        </p>
      </div>
      
      <MentorList 
        mentors={mentors}
        onAddMentor={handleAddMentor}
        onEditMentor={handleEditMentor}
        onDeleteMentor={handleDeleteMentor}
        onViewSessions={handleViewSessions}
        onViewPayouts={handleViewPayouts}
        onStartChat={handleStartChat}
      />
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentMentor ? "Edit Mentor" : "Add New Mentor"}
      >
        <MentorForm 
          mentor={currentMentor}
          onSave={handleSaveMentor}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </AdminLayout>
  );
};

export default Mentors;
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import AdminLayout from '@/components/layout/AdminLayout';
import MentorList from '@/components/admin/MentorList';
import Modal from '@/components/common/Modal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMentor, setCurrentMentor] = useState(null);
  const navigate = useNavigate();
  
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
      toast.error('Failed to load mentors');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMentors();
  }, []);
  
  const handleEditMentor = async (mentor) => {
    try {
      const mentorRef = doc(db, 'users', mentor.id);
      await updateDoc(mentorRef, {
        isActive: mentor.isActive,
        // Add other fields that can be updated
      });
      
      toast.success('Mentor updated successfully');
      fetchMentors();
    } catch (error) {
      console.error('Error updating mentor:', error);
      toast.error('Failed to update mentor');
    }
  };
  
  const handleDeleteMentor = async (mentorId) => {
    try {
      await deleteDoc(doc(db, 'users', mentorId));
      toast.success('Mentor deleted successfully');
      fetchMentors();
    } catch (error) {
      console.error('Error deleting mentor:', error);
      toast.error('Failed to delete mentor');
    }
  };
  
  const handleViewSessions = (mentorId) => {
    navigate('/admin/sessions', { state: { mentorId } });
  };
  
  const handleViewPayouts = (mentorId) => {
    navigate('/admin/payouts', { state: { mentorId } });
  };
  
  const handleStartChat = (mentorId) => {
    navigate(`/chat/${mentorId}`);
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
        <h1 className="text-2xl font-bold mb-2">Mentors</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage mentor profiles and their settings
        </p>
      </div>
      
      <MentorList 
        mentors={mentors}
        onEditMentor={handleEditMentor}
        onDeleteMentor={handleDeleteMentor}
        onViewSessions={handleViewSessions}
        onViewPayouts={handleViewPayouts}
        onStartChat={handleStartChat}
      />
    </AdminLayout>
  );
};

export default Mentors;
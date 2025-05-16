import { createContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/hooks/useAuth';

export const UserContext = createContext({
  currentUser: null,
  users: [],
  mentors: [],
  isLoading: true,
});

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [mentors, setMentors] = useState([]);
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Fetch mentors
        const mentorsRef = collection(db, 'users');
        const mentorsQuery = query(mentorsRef, where('role', '==', 'mentor'));
        const mentorsSnapshot = await getDocs(mentorsQuery);
        const fetchedMentors = mentorsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(fetchedMentors);
        setMentors(fetchedMentors);
        
        // Fetch all users
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        const fetchedUsers = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  return (
    <UserContext.Provider value={{ 
      currentUser: user, 
      users, 
      mentors,
      isLoading 
    }}>
      {children}
    </UserContext.Provider>
  );
};
import { createContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';
import { mockMentors } from '@/data/mockData';

interface UserContextType {
  currentUser: User | null;
  users: User[];
  mentors: User[];
  isLoading: boolean;
}

export const UserContext = createContext<UserContextType>({
  currentUser: null,
  users: [],
  mentors: [],
  isLoading: true,
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [mentors, setMentors] = useState<User[]>([]);
  
  useEffect(() => {
    // In a real app, this would fetch users from an API
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Convert mockMentors to User type
        const mentorUsers = mockMentors.map(mentor => ({
          id: mentor.id,
          name: mentor.name,
          email: mentor.email,
          role: 'mentor' as const,
          isActive: mentor.isActive
        }));
        
        setMentors(mentorUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // All available users (admins + mentors)
  const users = [
    // Add a mock admin user
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@edutech.com',
      role: 'admin' as const,
      isActive: true
    },
    ...mentors
  ];
  
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
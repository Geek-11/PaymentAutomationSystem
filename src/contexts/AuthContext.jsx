import { createContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import toast from 'react-hot-toast';
import { BASE_RATES } from '@/types/user';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: userData.name,
              role: userData.role,
              isActive: userData.isActive,
              mentorType: userData.mentorType,
              bankDetails: userData.bankDetails
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Error loading user data');
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, name, role, mentorType, bankDetails) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      const userData = {
        name,
        email,
        role,
        isActive: true,
        createdAt: new Date().toISOString(),
        mentorType: role === 'mentor' ? mentorType : null,
        baseRate: role === 'mentor' ? BASE_RATES[mentorType] : null,
        bankDetails: bankDetails || null
      };

      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name,
        role,
        isActive: true,
        mentorType: role === 'mentor' ? mentorType : undefined,
        bankDetails
      });

      toast.success('Account created successfully');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data();
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: userData.name,
        role: userData.role,
        isActive: userData.isActive,
        mentorType: userData.mentorType,
        bankDetails: userData.bankDetails
      });

      toast.success('Logged in successfully');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to log in');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to log out');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
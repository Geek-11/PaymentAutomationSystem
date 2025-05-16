import { createContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';
import { mockUser } from '@/data/mockUser';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in (from localStorage in this demo)
    const checkAuth = () => {
      const storedUser = localStorage.getItem('edutech_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
const login = async (email: string, password: string, role: UserRole) => {
  setIsLoading(true);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Fetch user profile from Firestore
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

    if (!userDoc.exists()) {
      throw new Error("User profile not found.");
    }

    const userData = userDoc.data();

    if (userData.role !== role) {
      throw new Error(`User is not registered as ${role}`);
    }

    const fullUser: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      country: userData.country,
      accountNumber: userData.accountNumber,
      ifscCode: userData.ifscCode,
    };

    setUser(fullUser);
    localStorage.setItem("edutech_user", JSON.stringify(fullUser));
  } catch (err: any) {
    throw new Error(err.message || "Login failed");
  }

  setIsLoading(false);
};

  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('edutech_user');
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
import { createContext, useState, useEffect } from "react";
import { collection, query, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';


export const SessionContext= createContext();

export const SessionContextProvider=({children})=>{
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  

  const fetchSessions = async () => {
      try {
        const sessionsRef = collection(db, 'sessions');
        const querySnapshot = await getDocs(sessionsRef);
        
        const fetchedSessions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setSessions(fetchedSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        toast.error('Failed to load sessions');
      } finally {
        setIsLoading(false);
      }
    };
    
    useEffect(() => {
      fetchSessions();
    }, []);

  return <SessionContext.Provider value={{sessions,setSessions, isLoading, fetchSessions}}>
    {children}
  </SessionContext.Provider>
}






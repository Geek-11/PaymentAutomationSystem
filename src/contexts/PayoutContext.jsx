import { createContext, useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

export const PayoutContext = createContext();

export const PayoutContextProvider = ({ children }) => {
  const [payouts, setPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayouts = async () => {
    try {
      const payoutRef = collection(db, "payouts");
      const querySnapshot = await getDocs(payoutRef);

      const fetchedPayouts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPayouts(fetchedPayouts);
    } catch (error) {
      console.error("Error fetching payouts:", error.message);
      toast.error("Failed to load payouts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  return (
    <PayoutContext.Provider
      value={{ payouts, setPayouts, isLoading, fetchPayouts }}
    >
      {children}
    </PayoutContext.Provider>
  );
};

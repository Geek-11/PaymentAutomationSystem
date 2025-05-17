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
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import toast from "react-hot-toast";

export const PayoutContext = createContext();

export const PayoutContextProvider = ({ children }) => {
  const [payouts, setPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Step 1: Fetch all payouts
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

  // ✅ Step 2: Define country tax rates
  const COUNTRY_TAX_RATES = {
    India: {
      platformFee: 0.05,
      gst: 0.18,
    },
    USA: {
      platformFee: 0.07,
      gst: 0.1,
    },
    Default: {
      platformFee: 0.05,
      gst: 0.0,
    },
  };

  // ✅ Step 3: Calculate Payout
  const calculatePayout = (
    sessionIds,
    allSessions,
    mentorCountry = "Default"
  ) => {
    try {
      const sessionsToCalculate = allSessions.filter((s) =>
        sessionIds.includes(s.id)
      );

      let subtotal = 0;

      sessionsToCalculate.forEach((session) => {
        const hourlyRate = session.ratePerHour;
        const durationInHours = session.duration / 60;
        subtotal += hourlyRate * durationInHours;
      });

      const taxRate =
        COUNTRY_TAX_RATES[mentorCountry] || COUNTRY_TAX_RATES.Default;

      const platformFee = subtotal * taxRate.platformFee;
      const gst = subtotal * taxRate.gst;
      const totalAmount = subtotal - platformFee - gst;

      return {
        sessions: sessionsToCalculate,
        calculations: {
          subtotal,
          platformFee,
          gst,
          totalAmount,
          country: mentorCountry,
        },
      };
    } catch (err) {
      console.error("Error calculating payout:", err);
      return null;
    }
  };

  // ✅ Step 4: Generate Receipt
  const generateReceipt = async (data, allSessions) => {
    setError("");
    try {
      const {
        mentorId,
        mentorName,
        periodStart,
        periodEnd,
        sessionIds,
        notes,
      } = data;

      // 🔥 Fetch mentor country from Firestore
      const mentorRef = doc(db, "mentors", mentorId);
      const mentorSnap = await getDoc(mentorRef);
      const mentorCountry = mentorSnap.exists()
        ? mentorSnap.data().country || "Default"
        : "Default";

      const payoutData = calculatePayout(
        sessionIds,
        allSessions,
        mentorCountry
      );
      if (!payoutData) {
        setError("Error calculating payout");
        return false;
      }

      const { calculations } = payoutData;
      const initialStatus =
        calculations.totalAmount > 10000 ? "UnderReview" : "Pending";

      const newReceipt = {
        mentorId,
        mentorName,
        periodStart,
        periodEnd,
        sessions: sessionIds,
        ...calculations,
        status: initialStatus,
        notes,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "payouts"), newReceipt);
      const savedReceipt = { id: docRef.id, ...newReceipt };

      // ✉️ Send email
      try {
        const { subject, body } = generatePayoutEmail(savedReceipt, mentorName);
        await fetch(
          " https://us-central1-automatic-payout-cf808.cloudfunctions.net/sendPayoutEmail",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: `${mentorName
                .toLowerCase()
                .replace(/\s+/g, ".")}@example.com`,
              subject,
              body,
            }),
          }
        );
      } catch (emailErr) {
        console.error("Failed to send email:", emailErr);
      }

      setPayouts((prev) => [...prev, savedReceipt]);
      return savedReceipt;
    } catch (err) {
      setError("Error generating receipt");
      console.error(err);
      return false;
    }
  };

  return (
    <PayoutContext.Provider
      value={{
        payouts,
        setPayouts,
        isLoading,
        fetchPayouts,
        error,
        generateReceipt,
        calculatePayout,
      }}
    >
      {children}
    </PayoutContext.Provider>
  );
};

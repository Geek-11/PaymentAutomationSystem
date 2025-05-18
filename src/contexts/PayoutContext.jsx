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
import { useUser } from "@/hooks/useUser";
import { processAutomatedPayouts } from "@/utils/payoutAutomate";
import { useSessions } from "@/hooks/useSessions";

export const PayoutContext = createContext();

export const PayoutContextProvider = ({ children }) => {
  const [payouts, setPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const {mentors} = useUser();
  const{sessions}= useSessions()
  
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

  const generatePayoutEmail = (receipt, mentorName) => {
    console.log(receipt);
    
    const statusText = receipt.status === 'UnderReview' 
                                          ? 'is under review'
                                          : 'is pending payment';

  const subject = `Payout ${statusText} - ₹${receipt.amount.toLocaleString()}`;

  const body = `
    Dear ${mentorName},

    Your payout for the period ${new Date(receipt.periodStart).toLocaleDateString()} to ${new Date(receipt.periodEnd).toLocaleDateString()} ${statusText}.

    Amount Details:

    - Subtotal: ₹${(receipt.amount - (0.05 * receipt.amount) - (0.18 * receipt.amount)).toLocaleString()}

    - Platform Fee: ₹${(0.05 * receipt.amount).toLocaleString()}

    - GST: ₹${(0.18 * receipt.amount).toLocaleString()}

    - Total Amount: ₹${receipt.amount.toLocaleString()}



    ${receipt.status === 'UnderReview' 

      ? 'Our team is reviewing your payout and will process it soon.'

      : 'Your payout will be processed according to the regular payment schedule.'}



    If you have any questions, please contact support through the chat system.



    Best regards,

    PayoutSync Team

      `.trim();



      return { subject, body };

    };

  // ✅ Step 4: Generate Receipt
  const generateReceipt = async (data, allSessions) => {
    setError("");
    try {
      const {
        mentorId,
        mentorName,
        sessionIds,
        notes,
      } = data;

        // Dynamically get periodStart and periodEnd from the sessions
        const selectedSessions = allSessions.filter((s) => sessionIds.includes(s.id));
        const sessionDates = selectedSessions.map((s) => new Date(s.date)); // assuming session object has `date` field
            
        const periodStart = new Date(Math.min(...sessionDates));
        const periodEnd = new Date(Math.max(...sessionDates));

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

      // const newReceipt = {
      //   mentorId,
      //   mentorName,
      //   periodStart,
      //   periodEnd,
      //   sessions: sessionIds,
      //   ...calculations,
      //   status: initialStatus,
      //   notes,
      //   createdAt: new Date().toISOString(),
      // };

      // const docRef = await addDoc(collection(db, "payouts"), newReceipt);
      // const savedReceipt = { id: docRef.id, ...newReceipt };

      // ✉️ Send email
      const newReceipt = {...data, periodStart, periodEnd, createdAt: new Date().toISOString()};
      try {    
        console.log(mentors.find(mentor => mentor.id === mentorId).email)  
        const { subject, body } = generatePayoutEmail(newReceipt, mentorName);
        await fetch(
          " https://us-central1-automatic-payout-cf808.cloudfunctions.net/sendPayoutEmail",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: `${mentors.find(mentor => mentor.id === mentorId).email}`,
              subject,
              body,
            }),
          }
        );
      } catch (emailErr) {
        console.error("Failed to send email:", emailErr);
      }

      // setPayouts((prev) => [...prev, newReceipt]);
      return newReceipt;
    } catch (err) {
      setError("Error generating receipt");
      console.error(err);
      return false;
    }
  };

  // Run automated payouts weekly
  useEffect(() => {
    const runAutomatedPayouts = async () => {
      await processAutomatedPayouts(
        sessions
        // generateReceipt,
        // updateReceiptStatus
      );
    };

    // Run immediately on mount
    runAutomatedPayouts();

    // Set up weekly interval
    const interval = setInterval(runAutomatedPayouts, 7 * 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [sessions]);

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

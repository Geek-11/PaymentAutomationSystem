import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Download, Printer, Mail } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import MentorLayout from '@/components/layout/MentorLayout';
import Button from '@/components/common/Button';
import { formatCurrency, formatDate } from '@/utils/format';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import toast from 'react-hot-toast';
import Logo from '@/components/common/Logo';
import { Session } from '@/types/session';

const Receipt = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [payout, setPayout] = useState(null);
  const [payoutSessions, setPayoutSessions] = useState([]);

  useEffect(() => {
    const fetchPayout = async () => {
      setIsLoading(true);
      try {
        const payoutRef = doc(db, 'payouts', id);
        const payoutDoc = await getDoc(payoutRef);

        if (payoutDoc.exists()) {
          const payoutData = { id: payoutDoc.id, ...payoutDoc.data() };
          setPayout(payoutData);

          const sessionsRef = collection(db, 'sessions');
          const q = query(sessionsRef, where('userId', '==', payoutData.mentorId));
          const querySnapshot = await getDocs(q);

          const sessions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPayoutSessions(sessions.slice(0, payoutData.sessionsCount));
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load receipt data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPayout();
  }, [id]);

  const handleGoBack = () => navigate(-1);
  const handleDownload = () => toast.success('Receipt downloaded successfully');
  const handlePrint = () => window.print();
  const handleSendEmail = () => toast.success('Receipt sent to email successfully');

  const Layout = user?.role === 'admin' ? AdminLayout : MentorLayout;

  if (isLoading) {
    return (
      <Layout>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!payout) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Receipt Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The receipt you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={handleGoBack}>
            <ArrowLeft size={16} className="mr-2" /> Go Back
          </Button>
        </div>
      </Layout>
    );
  }

  const subtotal = payoutSessions.reduce((total, session) => total + session.amount, 0);
  const platformFee = subtotal * 0.05;
  const taxAmount = subtotal * 0.18;

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button onClick={handleGoBack} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 mb-2">
            <ArrowLeft size={16} className="mr-1" /> Back
          </button>
          <h1 className="text-2xl font-bold">Receipt #{payout.id}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleDownload} leftIcon={<Download size={16} />}>Download</Button>
          <Button variant="outline" onClick={handlePrint} leftIcon={<Printer size={16} />}>Print</Button>
          {user?.role === 'admin' && (
            <Button onClick={handleSendEmail} leftIcon={<Mail size={16} />}>Send to Mentor</Button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden print:shadow-none">
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-b print:bg-white print:text-black">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <div className="mb-4"><Logo /></div>
              <p className="text-sm text-gray-600 dark:text-gray-300 print:text-gray-600">
                123 Education Lane<br />Tech City, TC 10001<br />admin@edutech.com<br />+1 (555) 123-4567
              </p>
            </div>
            <div className="mt-6 md:mt-0 md:text-right">
              <h2 className="text-2xl font-bold mb-2">RECEIPT</h2>
              <p className="text-gray-600 dark:text-gray-300 print:text-gray-600">
                Receipt #: {payout.id}<br />Date: {formatDate(payout.date)}<br />
                Status: <span className={payout.status === 'paid' ? 'text-green-600 dark:text-green-400' : payout.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'}>
                  {payout.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-3">Mentor Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">{payout.mentorName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 print:text-gray-600">
                Mentor ID: {payout.mentorId}<br />Email: {payout.mentorEmail}<br />Phone: {payout.mentorPhone || 'N/A'}
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-sm text-gray-600 dark:text-gray-300 print:text-gray-600">
                Payment Method: Bank Transfer<br />Account: XXXX-XXXX-XXXX-1234<br />Payment Date: {formatDate(payout.date)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-3">Sessions Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                  <th className="px-4 py-2 text-sm font-medium">Date</th>
                  <th className="px-4 py-2 text-sm font-medium">Session</th>
                  <th className="px-4 py-2 text-sm font-medium">Type</th>
                  <th className="px-4 py-2 text-sm font-medium">Duration</th>
                  <th className="px-4 py-2 text-sm font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payoutSessions.map(session => (
                  <tr key={session.id}>
                    <td className="px-4 py-2 text-sm">{formatDate(session.date)}</td>
                    <td className="px-4 py-2 text-sm">{session.title}</td>
                    <td className="px-4 py-2 text-sm capitalize">{session.type}</td>
                    <td className="px-4 py-2 text-sm">{session.duration} hour(s)</td>
                    <td className="px-4 py-2 text-sm text-right">{formatCurrency(session.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6">
          <div className="w-full md:w-1/2 ml-auto">
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600 dark:text-gray-300">Platform Fee (5%):</span>
              <span className="font-medium text-red-600">- {formatCurrency(platformFee)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600 dark:text-gray-300">GST (18%):</span>
              <span className="font-medium text-red-600">- {formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between py-4 text-lg font-bold">
              <span>Total Payout:</span>
              <span>{formatCurrency(payout.totalAmount)}</span>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-600 dark:text-gray-300">
            <p className="font-medium mb-2">Notes:</p>
            <p>Thank you for your contribution to our educational platform. This payout covers all sessions conducted from {formatDate(new Date(new Date().setDate(new Date().getDate() - 30)))} to {formatDate(new Date())}.</p>
            <p className="mt-4">If you have any questions about this receipt, please contact our finance team at finance@edutech.com.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Receipt;
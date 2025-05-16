import { useState } from 'react';
import { ArrowRight, DollarSign, Mail } from 'lucide-react';
import { Payout, PayoutStatus } from '@/types/payout';
import { Mentor } from '@/types/user';
import Button from '@/components/common/Button';
import { formatCurrency, formatDate } from '@/utils/format';

interface PayoutSummaryProps {
  mentor: Mentor;
  sessions: number;
  totalHours: number;
  subtotal: number;
  charges: {
    title: string;
    amount: number;
    type: 'percentage' | 'fixed';
    isDeduction: boolean;
  }[];
  total: number;
  date: Date;
  status: PayoutStatus;
  onGenerateReceipt: () => void;
  onSendToMentor: () => void;
  onSimulatePayout: () => void;
}

const PayoutSummary = ({
  mentor,
  sessions,
  totalHours,
  subtotal,
  charges,
  total,
  date,
  status,
  onGenerateReceipt,
  onSendToMentor,
  onSimulatePayout
}: PayoutSummaryProps) => {
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800',
    paid: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800',
    review: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800',
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-5 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-100 dark:border-blue-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payout Summary</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              For {mentor.name} • {formatDate(date)}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sessions</p>
            <p className="text-2xl font-semibold">{sessions}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Hours</p>
            <p className="text-2xl font-semibold">{totalHours}</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Final Amount</p>
            <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300">
              {formatCurrency(total)}
            </p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
            <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          
          {charges.map((charge, index) => (
            <div key={index} className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-300">
                {charge.title} 
                {charge.type === 'percentage' && ` (${charge.amount}%)`}
              </span>
              <span className={`font-medium ${charge.isDeduction ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {charge.isDeduction ? '-' : '+'}{formatCurrency(charge.amount)}
              </span>
            </div>
          ))}
          
          <div className="flex justify-between pt-2">
            <span className="font-semibold">Total Payout</span>
            <span className="font-semibold text-lg">{formatCurrency(total)}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button onClick={onGenerateReceipt} className="flex-1">
            <DollarSign size={16} className="mr-2" />
            Generate Receipt
          </Button>
          <Button 
            variant="outline" 
            onClick={onSendToMentor} 
            className="flex-1"
          >
            <Mail size={16} className="mr-2" />
            Send to Mentor
          </Button>
          <Button 
            variant="secondary" 
            onClick={onSimulatePayout} 
            className="flex-1"
          >
            <ArrowRight size={16} className="mr-2" />
            Simulate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PayoutSummary;
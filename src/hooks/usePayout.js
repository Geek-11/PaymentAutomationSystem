import { PayoutContext } from '@/contexts/PayoutContext';
import { useContext } from 'react';

export const usePayout = () => {
  return useContext(PayoutContext);
};
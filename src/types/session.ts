import { Mentor } from './user';

export type SessionType = 'live' | 'evaluation' | 'recording';

export interface Session {
  id: string;
  mentor: {
    id: string;
    name: string;
  };
  title: string;
  type: SessionType;
  date: string;
  startTime?: string;
  endTime?: string;
  duration: number; // in hours
  rate: number; // per hour
  amount: number;
  notes?: string;
}
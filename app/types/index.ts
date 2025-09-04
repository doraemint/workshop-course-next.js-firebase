import { Timestamp } from 'firebase/firestore';

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: Timestamp;
}

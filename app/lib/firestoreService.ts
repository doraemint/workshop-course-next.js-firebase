import { db } from './firebase';
import { collection, addDoc, Timestamp, query, onSnapshot, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Transaction } from '@/app/types';

// Define a type for the new transaction data, which no longer needs userId
interface NewTransactionData {
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: Timestamp;
}

// Add a transaction for a specific user
export const addTransaction = async (userId: string, transactionData: NewTransactionData) => {
  try {
    const userTransactionsCollection = collection(db, 'users', userId, 'transactions');
    const docRef = await addDoc(userTransactionsCollection, transactionData);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, error: e as Error };
  }
};

// Get all transactions for a specific user
export const getTransactions = (
  userId: string, 
  callback: (transactions: Transaction[]) => void
) => {
  const userTransactionsCollection = collection(db, 'users', userId, 'transactions');
  const q = query(userTransactionsCollection, orderBy("date", "desc"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const transactions: Transaction[] = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() } as Transaction);
    });
    callback(transactions);
  }, (error) => {
    console.error("Error in snapshot listener: ", error);
    // Optionally, you can have a callback for errors as well
    // errorCallback(error);
  });

  // Return the unsubscribe function to be called on component unmount
  return unsubscribe;
};

// Delete a specific transaction for a user
export const deleteTransaction = async (userId: string, transactionId: string) => {
  try {
    const transactionDoc = doc(db, 'users', userId, 'transactions', transactionId);
    await deleteDoc(transactionDoc);
    return { success: true };
  } catch (e) {
    console.error("Error deleting document: ", e);
    return { success: false, error: e as Error };
  }
};

// Update a specific transaction for a user
export const updateTransaction = async (userId: string, transactionId: string, updatedData: Partial<NewTransactionData>) => {
  try {
    const transactionDoc = doc(db, 'users', userId, 'transactions', transactionId);
    await updateDoc(transactionDoc, updatedData);
    return { success: true };
  } catch (e) {
    console.error("Error updating document: ", e);
    return { success: false, error: e as Error };
  }
};

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { Transaction } from '@/app/types';
import { deleteTransaction } from '@/app/lib/firestoreService';
import { EditTransactionModal } from './EditTransactionModal';
import { useAuth } from '@/app/context/AuthContext';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
}

export const TransactionList = ({ transactions, loading }: TransactionListProps) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(value);
  };

  const handleDelete = async (id: string) => {
    if (!user) {
      alert("คุณต้องเข้าสู่ระบบเพื่อลบรายการ");
      return;
    }
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้")) {
      const result = await deleteTransaction(user.uid, id);
      if (!result.success) {
        console.error("Error deleting transaction:", result.error);
        alert("ไม่สามารถลบรายการได้ กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>รายการธุรกรรม</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Skeleton Loader for Transaction List */}
          <div className="h-12 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded-md animate-pulse delay-75"></div>
          <div className="h-12 bg-gray-200 rounded-md animate-pulse delay-150"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>รายการธุรกรรม</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>ไม่มีรายการในเดือนนี้</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  {transaction.type === 'income' ? (
                    <ArrowUpCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <ArrowDownCircle className="h-6 w-6 text-red-500" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">{transaction.name}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.date.toDate().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className={cn(
                      "font-bold text-lg",
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleEdit(transaction)}>
                    <Pencil className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full text-red-500/80 hover:text-red-500 hover:bg-red-50"
                      onClick={() => handleDelete(transaction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      {selectedTransaction && (
        <EditTransactionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          transactionToEdit={selectedTransaction}
        />
      )}
    </Card>
  );
};

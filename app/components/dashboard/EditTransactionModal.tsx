'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Transaction } from '@/app/types';
import { Timestamp } from 'firebase/firestore';
import { updateTransaction } from '@/app/lib/firestoreService';
import { useAuth } from '@/app/context/AuthContext';
import { cn } from '@/app/lib/utils';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit: Transaction | null;
}

export const EditTransactionModal = ({ isOpen, onClose, transactionToEdit }: EditTransactionModalProps) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transactionToEdit) {
      setName(transactionToEdit.name);
      setAmount(transactionToEdit.amount.toString());
      setType(transactionToEdit.type);
      setDate(transactionToEdit.date.toDate().toISOString().split('T')[0]);
    }
  }, [transactionToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !amount || !date || !transactionToEdit || !user) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    setLoading(true);

    const updatedData = {
      name,
      amount: parseFloat(amount),
      type,
      date: Timestamp.fromDate(new Date(date)),
    };

    const result = await updateTransaction(user.uid, transactionToEdit.id, updatedData);

    if (result.success) {
      onClose(); // Close modal on success
    } else {
      setError('ไม่สามารถอัปเดตรายการได้ กรุณาลองใหม่อีกครั้ง');
      console.error(result.error);
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>แก้ไขรายการ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              type="button"
              variant={type === 'income' ? 'default' : 'outline'}
              onClick={() => setType('income')}
              className={cn(type === 'income' && 'bg-green-500 hover:bg-green-600')}
            >
              รายรับ
            </Button>
            <Button 
              type="button"
              variant={type === 'expense' ? 'default' : 'outline'}
              onClick={() => setType('expense')}
              className={cn(type === 'expense' && 'bg-red-500 hover:bg-red-600')}
            >
              รายจ่าย
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-name">ชื่อรายการ</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-amount">จำนวนเงิน</Label>
            <Input id="edit-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required disabled={loading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-date">วันที่</Label>
            <Input id="edit-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required disabled={loading} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


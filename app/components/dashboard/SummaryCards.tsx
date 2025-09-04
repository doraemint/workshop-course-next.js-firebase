'use client';

import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";
import { SummaryCard } from "./SummaryCard";
import { Transaction } from '@/app/types';

interface SummaryCardsProps {
  transactions: Transaction[];
}

export const SummaryCards = ({ transactions }: SummaryCardsProps) => {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SummaryCard 
        title="รายรับทั้งหมด"
        value={formatCurrency(totalIncome)}
        icon={<ArrowUp className="h-5 w-5" />}
        bgColor="bg-green-500"
        iconColor="text-green-500"
      />
      <SummaryCard 
        title="รายจ่ายทั้งหมด"
        value={formatCurrency(totalExpense)}
        icon={<ArrowDown className="h-5 w-5" />}
        bgColor="bg-red-500"
        iconColor="text-red-500"
      />
      <SummaryCard 
        title="ยอดคงเหลือ"
        value={formatCurrency(balance)}
        icon={<DollarSign className="h-5 w-5" />}
        bgColor="bg-indigo-500"
        iconColor="text-indigo-500"
      />
    </div>
  );
};

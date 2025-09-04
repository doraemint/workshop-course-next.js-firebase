'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Transaction } from '@/app/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ExpenseChartProps {
  transactions: Transaction[];
}

// Custom formatter for the tooltip to handle potential non-numeric values
const customTooltipFormatter = (value: number | string) => {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value);
  }
  return value;
};

export const ExpenseChart = ({ transactions }: ExpenseChartProps) => {
  // Aggregate data for the chart
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const data = [
    { name: 'รายรับ', value: totalIncome, color: '#22c55e' }, // green-500
    { name: 'รายจ่าย', value: totalExpense, color: '#ef4444' }, // red-500
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>สรุปรายรับ-รายจ่าย</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => new Intl.NumberFormat('th-TH').format(value)} />
            <Tooltip formatter={customTooltipFormatter} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name="จำนวนเงิน" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

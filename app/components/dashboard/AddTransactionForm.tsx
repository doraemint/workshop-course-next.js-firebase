"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useAuth } from "@/app/context/AuthContext";
import { Timestamp } from "firebase/firestore";
import { addTransaction } from "@/app/lib/firestoreService";
import { cn } from "@/app/lib/utils";

export const AddTransactionForm = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !amount || !date || !user) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    setLoading(true);

    const transactionData = {
      name,
      amount: parseFloat(amount),
      type,
      date: Timestamp.fromDate(new Date(date)),
    };

    const result = await addTransaction(user.uid, transactionData);

    if (result.success) {
      // Reset form
      setName("");
      setAmount("");
      setType("expense");
      setDate(new Date().toISOString().split("T")[0]);
    } else {
      setError("ไม่สามารถเพิ่มรายการได้ กรุณาลองใหม่อีกครั้ง");
      console.error(result.error);
    }

    setLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>เพิ่มรายการใหม่</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={type === "income" ? "default" : "outline"}
              onClick={() => setType("income")}
              className={cn(
                type === "income" &&
                  "bg-gradient-to-r from-green-400 to-green-700 text-white"
              )}
            >
              รายรับ
            </Button>
            <Button
              type="button"
              variant={type === "expense" ? "default" : "outline"}
              onClick={() => setType("expense")}
              className={cn(
                type === "expense" &&
                  "bg-gradient-to-r from-pink-400 to-pink-900 text-white"
              )}
            >
              รายจ่าย
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">ชื่อรายการ</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น เงินเดือน, ค่ากาแฟ"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">จำนวนเงิน</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">วันที่</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            disabled={loading}
          >
            {loading ? "กำลังเพิ่ม..." : "เพิ่มรายการ"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

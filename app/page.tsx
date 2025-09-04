"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { SummaryCards } from "./components/dashboard/SummaryCards";
import { AddTransactionForm } from "./components/dashboard/AddTransactionForm";
import { TransactionList } from "./components/dashboard/TransactionList";
import { ExpenseChart } from "./components/dashboard/ExpenseChart";
import { getTransactions } from "./lib/firestoreService";
import { Transaction } from "./types";
import { Navbar } from "./components/layout/Navbar";
import { DashboardSkeleton } from "./components/skeletons/DashboardSkeleton";

// Helper function to generate a list of recent months in Thai
const generateMonthOptions = () => {
  const options = [{ value: "all", label: "ทั้งหมด" }];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const value = `${year}-${month}`;
    const label = date.toLocaleString("th-TH", {
      month: "long",
      year: "numeric",
    });
    options.push({ value, label });
  }
  return options;
};

const HomePage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [mounted, setMounted] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const monthOptions = generateMonthOptions();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setTransactionsLoading(true);
      const unsubscribe = getTransactions(user.uid, (fetchedTransactions) => {
        setTransactions(fetchedTransactions);
        setTransactionsLoading(false);
      });
      return () => unsubscribe();
    } else {
      setTransactions([]);
      setTransactionsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (selectedMonth === "all") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter((t) => {
        const d = t.date.toDate();
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const transactionMonth = `${year}-${month}`;
        return transactionMonth === selectedMonth;
      });
      setFilteredTransactions(filtered);
    }
  }, [transactions, selectedMonth]);

  if (authLoading || !user || !mounted) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navbar />

      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="max-w-screen-xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Welcome Section */}
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  บัญชีรายรับ-รายจ่ายของคุณ
                </h1>
                <p className="text-slate-600 text-lg">
                  สวัสดี{user?.displayName ? `, ${user.displayName}` : ""}!
                  มาดูภาพรวมการเงินของคุณกัน
                </p>
              </div>

              {/* Controls Section */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Month Filter */}
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="appearance-none bg-white/70 backdrop-blur-sm border border-slate-200 text-slate-700 py-3 px-4 pr-10 rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 min-w-[180px]"
                  >
                    {monthOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Quick Add Button (Mobile) */}
                <button
                  onClick={() => setShowAddTransaction(!showAddTransaction)}
                  className="lg:hidden inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  เพิ่มรายการ
                </button>
              </div>
            </div>

            {/* Mobile Add Transaction Form */}
            {showAddTransaction && (
              <div className="lg:hidden mt-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 transform transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">
                      เพิ่มรายการใหม่
                    </h3>
                    <button
                      onClick={() => setShowAddTransaction(false)}
                      className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <AddTransactionForm />
                </div>
              </div>
            )}
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Main Content */}
            <main className="lg:col-span-8 space-y-8">
              {/* Summary Cards with Animation */}
              <div className="transform transition-all duration-700 ease-out">
                <SummaryCards transactions={filteredTransactions} />
              </div>

              {/* Charts Section */}
              <div className="transform transition-all duration-700 ease-out delay-150">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      ภาพรวมรายจ่าย
                    </h2>
                    <div className="flex items-center text-sm text-slate-500">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      อัปเดตแบบ Real-time
                    </div>
                  </div>
                  <ExpenseChart transactions={filteredTransactions} />
                </div>
              </div>

              {/* Transactions List */}
              <div className="transform transition-all duration-700 ease-out delay-300">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                  <div className="p-6 border-b border-slate-200/50">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-800 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        รายการล่าสุด
                      </h2>
                      <div className="flex items-center text-sm text-slate-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        {filteredTransactions.length} รายการ
                      </div>
                    </div>
                  </div>
                  <TransactionList
                    transactions={filteredTransactions}
                    loading={transactionsLoading}
                  />
                </div>
              </div>

              {/* Empty State */}
              {!transactionsLoading && filteredTransactions.length === 0 && (
                <div className="transform transition-all duration-700 ease-out delay-500">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-12 h-12 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      ยังไม่มีรายการ
                    </h3>
                    <p className="text-slate-500 mb-6">
                      เริ่มต้นการจัดการการเงินด้วยการเพิ่มรายการแรกของคุณ
                    </p>
                    <button
                      onClick={() => setShowAddTransaction(true)}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      เพิ่มรายการแรก
                    </button>
                  </div>
                </div>
              )}
            </main>

            {/* Right Sidebar */}
            <aside className="hidden lg:block lg:col-span-4 mt-6 lg:mt-0">
              <div className="sticky top-8 space-y-6">
                {/* Add Transaction Form */}
                <div className="transform transition-all duration-700 ease-out delay-400">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">
                        เพิ่มรายการใหม่
                      </h2>
                    </div>
                    <AddTransactionForm />
                  </div>
                </div>

                {/* Quick Stats Card */}
                <div className="transform transition-all duration-700 ease-out delay-500">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        สถิติด่วน
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-600">
                          รายการทั้งหมด
                        </span>
                        <span className="font-semibold text-slate-800">
                          {transactions.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-600">เดือนนี้</span>
                        <span className="font-semibold text-slate-800">
                          {filteredTransactions.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-slate-600">
                          อัพเดทล่าสุด
                        </span>
                        <span className="text-xs text-slate-500">ตอนนี้</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

import React from 'react';
import { CheckCircle2, ArrowRight, FileText, Home } from 'lucide-react';
import { PaymentTransaction } from '../types';

interface PaymentSuccessViewProps {
  transaction: PaymentTransaction;
  onViewReceipt: () => void;
  onBackToDashboard: () => void;
}

export const PaymentSuccessView: React.FC<PaymentSuccessViewProps> = ({
  transaction,
  onViewReceipt,
  onBackToDashboard
}) => {
  return (
    <div className="max-w-xl mx-auto py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Big Green Circle with Checkmark matching Screen 10 */}
      <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25">
        <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
      </div>

      {/* Headings */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Your rent payment has been processed successfully.
        </p>
      </div>

      {/* Summary Card matching Screen 10 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-left space-y-3.5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
          <span className="text-slate-500">Transaction ID</span>
          <span className="font-mono font-bold text-slate-900">{transaction.transactionRef}</span>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
          <span className="text-slate-500">Amount</span>
          <span className="font-mono font-bold text-slate-900 text-base">
            ZMW {transaction.amount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
          <span className="text-slate-500">Method</span>
          <span className="font-medium text-slate-800">
            {transaction.method} {transaction.provider ? `(${transaction.provider})` : ''}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Payment Date</span>
          <span className="text-slate-700">{transaction.date}</span>
        </div>
      </div>

      {/* Action Buttons matching Screen 10 */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onViewReceipt}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-sm shadow-blue-600/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>View Receipt</span>
        </button>

        <button
          onClick={onBackToDashboard}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4 text-slate-500" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Building2, X, Download, Printer, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PaymentTransaction } from '../types';

interface ReceiptModalProps {
  transaction: PaymentTransaction;
  onClose: () => void;
  onBackToDashboard?: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ 
  transaction, 
  onClose,
  onBackToDashboard 
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleGoBack = () => {
    if (onBackToDashboard) {
      onBackToDashboard();
    } else {
      onClose();
    }
  };

  const handleDownload = () => {
    const receiptContent = `
======================================================
               RENT PAYMENT RECEIPT
       PRMS — Property Rental Management System
======================================================
Receipt No:             ${transaction.transactionRef}
Date:                   ${transaction.date}
Tenant Name:            ${transaction.tenantName}
Property:               ${transaction.propertyName} - ${transaction.unit}
------------------------------------------------------
DESCRIPTION                                     AMOUNT
------------------------------------------------------
Monthly Rent                             ZMW ${(transaction.amount + transaction.remainingBalance).toLocaleString()}
Payment Received                         ZMW ${transaction.amount.toLocaleString()}
Previous Balance                         ZMW ${transaction.previousBalance.toLocaleString()}
Remaining Balance                        ZMW ${transaction.remainingBalance.toLocaleString()}
------------------------------------------------------
Payment Method:         ${transaction.method} ${transaction.provider ? `(${transaction.provider})` : ''}
Gateway Reference:      ${transaction.gatewayRef}
Transaction Status:     SUCCESSFUL (VERIFIED)
======================================================
              Thank you for your payment!
======================================================
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${transaction.transactionRef}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl my-4 sm:my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Controls with Clear Back Button (Hidden on print) */}
        <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 print:hidden">
          <button
            onClick={handleGoBack}
            className="px-3 py-1.5 rounded-lg bg-slate-200/80 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider truncate max-w-[160px] sm:max-w-none">
            Official Receipt Preview
          </span>

          <button
            onClick={handleGoBack}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Printable Receipt Voucher matching Screen 11 */}
        <div className="p-5 sm:p-10 space-y-5 sm:space-y-6 printable-receipt text-slate-800">
          {/* PRMS Brand Header */}
          <div className="text-center pb-6 border-b border-slate-200">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-2 shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">PRMS</h2>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Property Rental Management System
            </p>
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-3">
              RENT PAYMENT RECEIPT
            </h3>
          </div>

          {/* Metadata Grid matching Screen 11 */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Receipt No:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {transaction.transactionRef}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">Date:</span>
              <span className="font-medium text-slate-900">{transaction.date}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Tenant:</span>
              <span className="font-bold text-slate-900">{transaction.tenantName}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">Property:</span>
              <span className="font-medium text-slate-900">
                {transaction.propertyName} - {transaction.unit}
              </span>
            </div>
          </div>

          {/* Breakdown Table matching Screen 11 */}
          <div className="border-t border-b border-slate-200 py-3 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400 font-semibold uppercase text-[10px]">
              <span>Description</span>
              <span>Amount</span>
            </div>

            <div className="flex items-center justify-between py-1 border-t border-slate-100">
              <span className="text-slate-600">Monthly Rent</span>
              <span className="font-mono font-medium text-slate-800">
                ZMW {(transaction.amount + transaction.remainingBalance).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 bg-emerald-50/60 px-2 rounded font-semibold text-emerald-800">
              <span>Payment Received</span>
              <span className="font-mono">
                ZMW {transaction.amount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-t border-slate-100">
              <span className="text-slate-500">Previous Balance</span>
              <span className="font-mono text-slate-600">
                ZMW {transaction.previousBalance.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 font-bold text-slate-900 border-t border-slate-200">
              <span>Remaining Balance</span>
              <span className="font-mono text-blue-600">
                ZMW {transaction.remainingBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method & Transaction Reference matching Screen 11 */}
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Payment Method:</span>
              <span className="font-medium text-slate-900">
                {transaction.method} {transaction.provider ? `(${transaction.provider})` : ''}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Transaction Reference:</span>
              <span className="font-mono text-slate-700">{transaction.gatewayRef}</span>
            </div>
          </div>

          {/* Footer Thank You */}
          <div className="text-center pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-700 italic">
              Thank you for your payment!
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              This receipt was electronically generated by PRMS and is legally binding.
            </p>
          </div>
        </div>

        {/* Action Buttons with Prominent Back to Dashboard Button (Hidden on print) */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3 print:hidden">
          <button
            onClick={handleGoBack}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-sm shadow-blue-600/30 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};

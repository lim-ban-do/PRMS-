import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Smartphone, 
  CreditCard, 
  Check, 
  DollarSign, 
  Calendar, 
  Home, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Property, Tenant, RentBalance } from '../types';

interface PayRentViewProps {
  tenant: Tenant;
  property: Property;
  balance: RentBalance;
  onBack: () => void;
  onProceedToPayment: (amount: number, method: string) => void;
}

export const PayRentView: React.FC<PayRentViewProps> = ({
  tenant,
  property,
  balance,
  onBack,
  onProceedToPayment
}) => {
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState<number>(balance.outstandingBalance > 0 ? balance.outstandingBalance : 1500);
  const [selectedMethod, setSelectedMethod] = useState<'Mobile Money' | 'Bank/Card' | 'Demo Gateway'>('Mobile Money');

  const finalAmount = paymentType === 'full' ? balance.monthlyRent : Number(partialAmount);

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) {
      alert('Please enter a valid payment amount greater than zero.');
      return;
    }
    onProceedToPayment(finalAmount, selectedMethod);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header with Back button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pay Rent</h1>
          <p className="text-xs text-slate-500">Secure online rent settlement</p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      <form onSubmit={handleProceed} className="space-y-6">
        {/* Payment Details Card matching Screen 8 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">
            Payment Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-slate-400">Property</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {property.name} - Room {tenant.unit}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Monthly Rent</div>
              <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                ZMW {balance.monthlyRent.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Due Date</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {balance.dueDate}
              </div>
            </div>
          </div>
        </div>

        {/* Amount to Pay matching Screen 8 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Amount to Pay
          </h2>

          <div className="space-y-3">
            {/* Full Rent Radio */}
            <label
              className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${
                paymentType === 'full'
                  ? 'border-blue-600 bg-blue-50/40 text-blue-900'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="amountOption"
                  checked={paymentType === 'full'}
                  onChange={() => setPaymentType('full')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-sm font-semibold">
                  Full Rent (ZMW {balance.monthlyRent.toLocaleString()})
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">100% Settled</span>
            </label>

            {/* Partial Amount Radio */}
            <div
              className={`p-3.5 rounded-xl border transition-colors ${
                paymentType === 'partial'
                  ? 'border-blue-600 bg-blue-50/40'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="amountOption"
                  id="partialOption"
                  checked={paymentType === 'partial'}
                  onChange={() => setPaymentType('partial')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <label htmlFor="partialOption" className="text-sm font-semibold text-slate-800 cursor-pointer">
                  Partial Amount
                </label>
              </div>

              {paymentType === 'partial' && (
                <div className="mt-3 pl-7 flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-slate-600">ZMW</span>
                  <input
                    type="number"
                    min={100}
                    max={balance.monthlyRent * 2}
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(Number(e.target.value))}
                    className="w-48 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="Enter amount"
                  />
                  <span className="text-xs text-slate-400">
                    Remaining balance will update automatically
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Method Selector matching Screen 8 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Payment Method
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Card 1: Mobile Money */}
            <div
              onClick={() => setSelectedMethod('Mobile Money')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedMethod === 'Mobile Money'
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                {selectedMethod === 'Mobile Money' && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-3" />
                  </span>
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Mobile Money</div>
                <div className="text-[11px] text-slate-500 mt-0.5">MTN, Airtel, Zamtel</div>
              </div>
            </div>

            {/* Card 2: Bank / Card */}
            <div
              onClick={() => setSelectedMethod('Bank/Card')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedMethod === 'Bank/Card'
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                {selectedMethod === 'Bank/Card' && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-3" />
                  </span>
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Bank / Card</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Visa, Mastercard</div>
              </div>
            </div>

            {/* Card 3: Demo Gateway */}
            <div
              onClick={() => setSelectedMethod('Demo Gateway')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedMethod === 'Demo Gateway'
                  ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                {selectedMethod === 'Demo Gateway' && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-3" />
                  </span>
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Demo Gateway</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">(For testing only)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-600/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Payment</span>
            <span className="font-mono font-bold">
              (ZMW {finalAmount.toLocaleString()})
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  X, 
  Check, 
  Loader2, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  Lock,
  Clock,
  AlertCircle
} from 'lucide-react';

interface DemoGatewayModalProps {
  amount: number;
  paymentMethod: string;
  transactionRef: string;
  onCancel: () => void;
  onConfirmSuccess: (provider: string) => void;
}

export const DemoGatewayModal: React.FC<DemoGatewayModalProps> = ({
  amount,
  paymentMethod,
  transactionRef,
  onCancel,
  onConfirmSuccess
}) => {
  const [selectedProvider, setSelectedProvider] = useState<'MTN Mobile Money' | 'Airtel Money' | 'Zamtel Kwacha' | 'Visa / Mastercard'>('MTN Mobile Money');
  const [phoneNumber, setPhoneNumber] = useState('0978123456');
  const [pin, setPin] = useState('1234');
  const [currentStep, setCurrentStep] = useState<'input' | 'push_prompt' | 'processing' | 'approved'>('input');
  const [processStatus, setProcessStatus] = useState('Initiating Telecom Gateway Handshake...');
  const [countdown, setCountdown] = useState(45);

  // USSD Countdown timer during push prompt
  useEffect(() => {
    let timer: any;
    if (currentStep === 'push_prompt' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, countdown]);

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProvider === 'Visa / Mastercard') {
      startProcessing();
    } else {
      setCountdown(45);
      setCurrentStep('push_prompt');
    }
  };

  const handleApprovePin = () => {
    setCurrentStep('processing');
    startProcessing();
  };

  const startProcessing = () => {
    setCurrentStep('processing');
    setProcessStatus(`Transmitting push authorization to ${selectedProvider}...`);

    setTimeout(() => {
      setProcessStatus('Subscriber PIN verified. Debiting mobile wallet...');
    }, 700);

    setTimeout(() => {
      setProcessStatus('Securing bank settlement & issuing digital stamp...');
    }, 1400);

    setTimeout(() => {
      setCurrentStep('approved');
    }, 2000);

    setTimeout(() => {
      onConfirmSuccess(selectedProvider);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Gateway Brand Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-sm">PRMS Gateway</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Live Simulation
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Automated Rent Settlement Switch</p>
            </div>
          </div>

          <button
            onClick={onCancel}
            disabled={currentStep === 'processing' || currentStep === 'approved'}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: Initial Payment Channel & Phone Selection */}
        {currentStep === 'input' && (
          <form onSubmit={handleStartPayment} className="p-6 space-y-5">
            {/* Amount Summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider">
                  Amount Due
                </span>
                <span className="text-2xl font-black font-mono text-slate-900">
                  ZMW {amount.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Transaction Ref:</span>
                <span className="font-mono text-xs font-bold text-blue-600">{transactionRef}</span>
              </div>
            </div>

            {/* Provider Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Select Payment Channel
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'MTN Mobile Money', label: 'MTN MoMo (*303#)', color: 'border-yellow-400 bg-yellow-50/50 text-yellow-900' },
                  { id: 'Airtel Money', label: 'Airtel Money (*778#)', color: 'border-red-400 bg-red-50/50 text-red-900' },
                  { id: 'Zamtel Kwacha', label: 'Zamtel Kwacha (*115#)', color: 'border-emerald-400 bg-emerald-50/50 text-emerald-900' },
                  { id: 'Visa / Mastercard', label: 'Debit / Credit Card', color: 'border-blue-400 bg-blue-50/50 text-blue-900' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedProvider(item.id as any)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                      selectedProvider === item.id
                        ? `${item.color} shadow-sm ring-2 ring-blue-500/20`
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedProvider === item.id && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Money Details */}
            {selectedProvider !== 'Visa / Mastercard' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subscriber Mobile Number
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 0978123456"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  A USSD push notification will be sent directly to this handset for approval.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    defaultValue="4242 •••• •••• 4242"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry</label>
                    <input type="text" defaultValue="12/28" className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">CVV</label>
                    <input type="password" defaultValue="123" className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg" />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Authorize & Pay ZMW {amount.toLocaleString()}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Realistic Phone USSD Push Prompt Modal */}
        {currentStep === 'push_prompt' && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
              <Smartphone className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold mb-2">
                <Clock className="w-3 h-3" />
                <span>USSD Prompt Sent ({countdown}s)</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Approve on Handset</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                A prompt has been sent to <strong>{phoneNumber}</strong> ({selectedProvider}). Enter your PIN to approve.
              </p>
            </div>

            {/* Simulated Handset Screen Box */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl max-w-sm mx-auto text-left shadow-xl border border-slate-800 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                <span>{selectedProvider} Push</span>
                <span>Ref: PRMS</span>
              </div>
              <div className="text-slate-200">
                Authorize payment of <strong>ZMW {amount.toLocaleString()}</strong> to <strong>PRMS Rent Ltd</strong>?
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Enter 4-Digit Wallet PIN:</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono tracking-widest text-sm focus:outline-none focus:border-blue-500"
                    placeholder="••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Cancel Payment
              </button>
              <button
                type="button"
                onClick={handleApprovePin}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Confirm PIN & Approve</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Telecom Gateway Processing Spinner */}
        {currentStep === 'processing' && (
          <div className="p-12 text-center space-y-5">
            <div className="relative inline-block">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center animate-spin mx-auto">
                <Loader2 className="w-8 h-8" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Processing Rent Payment</h3>
              <p className="text-xs text-slate-500 font-mono mt-1.5">{processStatus}</p>
            </div>
            <div className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Live settlement verification through telecom network switch.
            </div>
          </div>
        )}

        {/* STEP 4: Success Confirmation */}
        {currentStep === 'approved' && (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Payment Approved & Verified!</h3>
              <p className="text-xs text-slate-500 mt-1">
                ZMW {amount.toLocaleString()} was successfully paid via {selectedProvider}.
              </p>
            </div>
            <p className="text-xs text-blue-600 font-semibold animate-pulse">
              Redirecting to official receipt...
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

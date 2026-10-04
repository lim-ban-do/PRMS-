import React from 'react';
import { 
  Building2, 
  DollarSign, 
  Clock, 
  Calendar, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  Wrench
} from 'lucide-react';
import { Property, Tenant, RentBalance, PaymentTransaction } from '../types';

interface TenantDashboardProps {
  tenant: Tenant;
  property: Property;
  balance: RentBalance;
  payments: PaymentTransaction[];
  onPayRentClick: () => void;
  onViewPayments: () => void;
  onSubmitMaintenance: () => void;
  onViewReceipt: (p: PaymentTransaction) => void;
}

export const TenantDashboard: React.FC<TenantDashboardProps> = ({
  tenant,
  property,
  balance,
  payments,
  onPayRentClick,
  onViewPayments,
  onSubmitMaintenance,
  onViewReceipt
}) => {
  const tenantPayments = payments.filter((p) => p.tenantId === tenant.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome, {tenant.name}
        </h1>
        <p className="text-sm text-slate-500">Here's your rental overview</p>
      </div>

      {/* My Property Hero Card matching Screen 7 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <img
            src={property.photo}
            alt={property.name}
            className="w-24 h-20 object-cover rounded-xl border border-slate-200 shadow-xs shrink-0"
          />
          <div>
            <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
              My Property
            </div>
            <div className="text-xl font-bold text-slate-900 leading-tight">
              {property.name}
            </div>
            <div className="text-sm text-slate-500 font-medium">
              Room {tenant.unit} · {property.address}
            </div>
          </div>
        </div>

        <button 
          onClick={onSubmitMaintenance}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
        >
          View Details
        </button>
      </div>

      {/* 3 Rental Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Monthly Rent */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Monthly Rent</div>
            <div className="text-xl font-bold text-slate-900 font-mono">
              ZMW {balance.monthlyRent.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Outstanding */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Outstanding</div>
            <div className="text-xl font-bold text-slate-900 font-mono">
              ZMW {balance.outstandingBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Due Date */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Due Date</div>
            <div className="text-base font-bold text-slate-900">
              {balance.dueDate}
            </div>
          </div>
        </div>
      </div>

      {/* Prominent PAY RENT Button matching Screen 7 */}
      <div>
        <button
          onClick={onPayRentClick}
          className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <DollarSign className="w-5 h-5" />
          <span className="tracking-wide">PAY RENT</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Recent Payments Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Recent Payments</h2>
          <button
            onClick={onViewPayments}
            className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-2.5">Date</th>
                <th className="pb-2.5">Amount</th>
                <th className="pb-2.5">Method</th>
                <th className="pb-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenantPayments.slice(0, 4).map((p) => (
                <tr 
                  key={p.id} 
                  onClick={() => onViewReceipt(p)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  title="Click to view receipt"
                >
                  <td className="py-3 text-slate-600 whitespace-nowrap">
                    {p.date}
                  </td>
                  <td className="py-3 font-mono font-semibold text-slate-900">
                    ZMW {p.amount.toLocaleString()}
                  </td>
                  <td className="py-3 text-slate-600">
                    {p.method} {p.provider ? `(${p.provider})` : ''}
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Successful
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance Request Banner matching Screen 7 */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Wrench className="w-4 h-4 text-slate-400" />
          <span>Need to report a problem?</span>
        </div>
        <button
          onClick={onSubmitMaintenance}
          className="text-blue-600 font-semibold hover:underline"
        >
          Submit Maintenance Request
        </button>
      </div>
    </div>
  );
};

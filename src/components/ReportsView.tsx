import React, { useState } from 'react';
import { Download, Filter, FileSpreadsheet, Calendar, Building2, User } from 'lucide-react';
import { Property, Tenant, Lease, RentBalance, PaymentTransaction } from '../types';

interface ReportsViewProps {
  properties: Property[];
  tenants: Tenant[];
  leases: Lease[];
  balances: Record<number, RentBalance>;
  payments: PaymentTransaction[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ 
  properties, 
  tenants,
  leases,
  balances,
  payments
}) => {
  const [fromDate, setFromDate] = useState('2026-09-01');
  const [toDate, setToDate] = useState('2026-09-30');
  const [selectedProp, setSelectedProp] = useState('All');
  const [selectedTenant, setSelectedTenant] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [filterTrigger, setFilterTrigger] = useState(0);

  // Dynamically compute report rows from actual tenants, properties, and balances
  const dynamicReportRows = tenants.map((tenant) => {
    const prop = properties.find((p) => p.id === tenant.propertyId);
    const balance = balances[tenant.id] || {
      tenantId: tenant.id,
      monthlyRent: prop ? prop.monthlyRent : 3500,
      amountPaid: 0,
      outstandingBalance: prop ? prop.monthlyRent : 3500,
      dueDate: '05 October 2026'
    };

    let status: 'Paid' | 'Partial' | 'Overdue' = 'Overdue';
    if (balance.outstandingBalance === 0) {
      status = 'Paid';
    } else if (balance.amountPaid > 0) {
      status = 'Partial';
    } else {
      status = 'Overdue';
    }

    return {
      tenantId: tenant.id,
      tenant: tenant.name,
      property: tenant.propertyName || (prop ? prop.name : 'Property'),
      rentDue: balance.monthlyRent,
      amountPaid: balance.amountPaid,
      balance: balance.outstandingBalance,
      status
    };
  });

  const filteredRows = dynamicReportRows.filter((row) => {
    if (selectedProp !== 'All' && row.property !== selectedProp) return false;
    if (selectedTenant !== 'All' && row.tenant !== selectedTenant) return false;
    if (selectedStatus !== 'All' && row.status !== selectedStatus) return false;
    return true;
  });

  const totalRentDue = filteredRows.reduce((sum, r) => sum + r.rentDue, 0);
  const totalAmountPaid = filteredRows.reduce((sum, r) => sum + r.amountPaid, 0);
  const totalArrears = filteredRows.reduce((sum, r) => sum + r.balance, 0);

  const handleGenerateReport = () => {
    setFilterTrigger((prev) => prev + 1);
  };

  const handleExportCSV = () => {
    const headers = ['Tenant', 'Property', 'Rent Due (ZMW)', 'Amount Paid (ZMW)', 'Balance (ZMW)', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredRows.map((r) =>
        `"${r.tenant}","${r.property}",${r.rentDue},${r.amountPaid},${r.balance},"${r.status}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prms_rent_collection_report_${fromDate}_to_${toDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rent Collection Report</h1>
        <p className="text-sm text-slate-500">Generate rental yields, payment realization, and arrears tracking</p>
      </div>

      {/* Filters Card matching Screen 13 */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* From Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Property */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Property
            </label>
            <select
              value={selectedProp}
              onChange={(e) => setSelectedProp(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="All">All Properties</option>
              {properties.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tenant */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tenant
            </label>
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="All">All Tenants</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Filter Action Buttons matching Screen 13 */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-600/30 transition-colors cursor-pointer"
          >
            Generate Report
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-emerald-600/30 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Table matching Screen 13 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Tenant</th>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Rent Due</th>
                <th className="py-3 px-4">Amount Paid</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {r.tenant}
                  </td>
                  <td className="py-3 px-4 text-slate-800">
                    {r.property}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-800">
                    ZMW {r.rentDue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-emerald-700">
                    ZMW {r.amountPaid.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    ZMW {r.balance.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {r.status === 'Paid' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Paid
                      </span>
                    )}
                    {r.status === 'Partial' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        Partial
                      </span>
                    )}
                    {r.status === 'Overdue' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                        Overdue
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Report Summary Footnote (Dynamic) */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Total Billed: <strong className="font-mono text-slate-900">ZMW {totalRentDue.toLocaleString()}</strong> · Total Collected:{' '}
            <strong className="font-mono text-emerald-700">ZMW {totalAmountPaid.toLocaleString()}</strong>
          </span>
          <span className="font-semibold text-rose-600">
            Arrears: ZMW {totalArrears.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

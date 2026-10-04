import React, { useState } from 'react';
import { FileText, Plus, Search, Edit3, Trash2, X, Calendar, DollarSign } from 'lucide-react';
import { Lease, Tenant, Property } from '../types';

interface LeasesViewProps {
  leases: Lease[];
  tenants: Tenant[];
  properties: Property[];
  onAddLease: (lease: Omit<Lease, 'id'>) => void;
  onUpdateLease: (lease: Lease) => void;
  onDeleteLease: (id: number) => void;
}

export const LeasesView: React.FC<LeasesViewProps> = ({
  leases,
  tenants,
  properties,
  onAddLease,
  onUpdateLease,
  onDeleteLease
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLease, setEditingLease] = useState<Lease | null>(null);

  // Form State
  const [tenantId, setTenantId] = useState<number>(tenants[0]?.id || 1);
  const [propertyId, setPropertyId] = useState<number>(properties[0]?.id || 1);
  const [unit, setUnit] = useState('04');
  const [monthlyRent, setMonthlyRent] = useState(3500);
  const [deposit, setDeposit] = useState(3500);
  const [startDate, setStartDate] = useState('01 Jan 2026');
  const [endDate, setEndDate] = useState('31 Dec 2026');
  const [status, setStatus] = useState<Lease['status']>('Active');

  const openAdd = () => {
    setEditingLease(null);
    setTenantId(tenants[0]?.id || 1);
    setPropertyId(properties[0]?.id || 1);
    setUnit('04');
    setMonthlyRent(3500);
    setDeposit(3500);
    setStartDate('01 Jan 2026');
    setEndDate('31 Dec 2026');
    setStatus('Active');
    setShowAddModal(true);
  };

  const openEdit = (l: Lease) => {
    setEditingLease(l);
    setTenantId(l.tenantId);
    setPropertyId(l.propertyId);
    setUnit(l.unit);
    setMonthlyRent(l.monthlyRent);
    setDeposit(l.deposit);
    setStartDate(l.startDate);
    setEndDate(l.endDate);
    setStatus(l.status);
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const t = tenants.find((item) => item.id === Number(tenantId));
    const p = properties.find((item) => item.id === Number(propertyId));

    if (editingLease) {
      onUpdateLease({
        ...editingLease,
        tenantId: Number(tenantId),
        tenantName: t ? t.name : 'John Mwale',
        propertyId: Number(propertyId),
        propertyName: p ? p.name : 'Chalala House',
        unit,
        monthlyRent: Number(monthlyRent),
        deposit: Number(deposit),
        startDate,
        endDate,
        status
      });
    } else {
      onAddLease({
        tenantId: Number(tenantId),
        tenantName: t ? t.name : 'John Mwale',
        propertyId: Number(propertyId),
        propertyName: p ? p.name : 'Chalala House',
        unit,
        monthlyRent: Number(monthlyRent),
        deposit: Number(deposit),
        startDate,
        endDate,
        status
      });
    }
    setShowAddModal(false);
  };

  const filtered = leases.filter((l) =>
    l.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.unit.includes(searchTerm) ||
    l.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leases</h1>
          <p className="text-sm text-slate-500">Rental agreements, contract terms, and tenancy periods</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm shadow-blue-600/30 transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Lease</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filter Top Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search leases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="text-xs text-slate-400">
            {filtered.length} lease contracts
          </div>
        </div>

        {/* Table matching Screen 6 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Tenant</th>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Monthly Rent</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Tenant */}
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {l.tenantName}
                  </td>
                  {/* Property */}
                  <td className="py-3 px-4 text-slate-800">
                    {l.propertyName}
                  </td>
                  {/* Unit */}
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {l.unit}
                  </td>
                  {/* Monthly Rent */}
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                    ZMW {l.monthlyRent.toLocaleString()}
                  </td>
                  {/* Start Date */}
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {l.startDate}
                  </td>
                  {/* End Date */}
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {l.endDate}
                  </td>
                  {/* Status */}
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {l.status}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(l)}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
                        title="Edit Lease"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Terminate lease for ${l.tenantName}?`)) {
                            onDeleteLease(l.id);
                          }
                        }}
                        className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete Lease"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Showing 1 to {filtered.length} of {leases.length} leases</div>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 text-[11px]">
              &lt;
            </button>
            <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-medium text-[11px]">
              1
            </button>
            <button className="px-2 py-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 text-[11px]">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Lease Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingLease ? 'Edit Lease Agreement' : 'Create New Lease'}
                </h2>
                <p className="text-xs text-slate-500">
                  Define rent amount, security deposit, and start/end dates
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tenant */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Tenant *
                  </label>
                  <select
                    value={tenantId}
                    onChange={(e) => setTenantId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.idNumber})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Property */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Property *
                  </label>
                  <select
                    value={propertyId}
                    onChange={(e) => setPropertyId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit / Room Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="04"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Monthly Rent */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Monthly Rent (ZMW) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    placeholder="3500"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Deposit */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Security Deposit (ZMW)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    placeholder="3500"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lease Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="01 Jan 2026"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="31 Dec 2026"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/30 transition-colors"
                >
                  Save Lease
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

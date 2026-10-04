import React from 'react';
import { 
  Building2, 
  Home, 
  Wrench, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Phone, 
  Send,
  Plus,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Property, Tenant, Lease, RentBalance, MaintenanceRequest } from '../types';

interface ManagerDashboardProps {
  properties: Property[];
  tenants: Tenant[];
  leases: Lease[];
  balances: Record<number, RentBalance>;
  maintenance: MaintenanceRequest[];
  onNavigateTab: (tab: string) => void;
  onUpdateMaintenanceStatus: (id: number, status: MaintenanceRequest['status']) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  properties,
  tenants,
  leases,
  balances,
  maintenance,
  onNavigateTab,
  onUpdateMaintenanceStatus
}) => {
  const occupiedCount = properties.filter((p) => p.status === 'Occupied').length;
  const vacantCount = properties.filter((p) => p.status === 'Vacant').length;
  const occupancyRate = properties.length > 0 ? Math.round((occupiedCount / properties.length) * 100) : 0;

  const pendingTickets = maintenance.filter((m) => m.status !== 'Completed').length;

  // Tenants with outstanding balances
  const tenantsInArrears = tenants.map((t) => {
    const bal = balances[t.id];
    return {
      ...t,
      outstanding: bal ? bal.outstandingBalance : 0,
      amountPaid: bal ? bal.amountPaid : 0
    };
  }).filter((t) => t.outstanding > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Property Manager Operations</h1>
          <p className="text-sm text-slate-500">Day-to-day estate management, maintenance dispatch, and occupancy</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('maintenance')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Maintenance Desk
          </button>
          <button
            onClick={() => onNavigateTab('tenants')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-600/30 transition-colors cursor-pointer"
          >
            + Register Tenant
          </button>
        </div>
      </div>

      {/* Row 1: Manager Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Rate */}
        <div 
          onClick={() => onNavigateTab('properties')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4 cursor-pointer hover:border-blue-300 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Occupancy Rate</div>
            <div className="text-2xl font-bold text-slate-900 font-mono">{occupancyRate}%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{occupiedCount} Occupied · {vacantCount} Vacant</div>
          </div>
        </div>

        {/* Pending Maintenance */}
        <div 
          onClick={() => onNavigateTab('maintenance')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4 cursor-pointer hover:border-amber-300 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Open Maintenance</div>
            <div className="text-2xl font-bold text-slate-900 font-mono text-amber-600">{pendingTickets}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Tickets needing action</div>
          </div>
        </div>

        {/* Active Leases */}
        <div 
          onClick={() => onNavigateTab('leases')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4 cursor-pointer hover:border-emerald-300 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Active Leases</div>
            <div className="text-2xl font-bold text-slate-900 font-mono text-emerald-600">{leases.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">All contracts valid</div>
          </div>
        </div>

        {/* Arrears Follow-ups */}
        <div 
          onClick={() => onNavigateTab('reports')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4 cursor-pointer hover:border-rose-300 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Arrears Follow-ups</div>
            <div className="text-2xl font-bold text-slate-900 font-mono text-rose-600">{tenantsInArrears.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Tenants with balance</div>
          </div>
        </div>
      </div>

      {/* Row 2: Operational Dispatch Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Maintenance Tickets Requiring Action */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Maintenance Action Desk</h2>
                <p className="text-xs text-slate-500">Live repair requests submitted by tenants</p>
              </div>
              <button
                onClick={() => onNavigateTab('maintenance')}
                className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
              >
                <span>View All ({maintenance.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {maintenance.slice(0, 4).map((m) => (
                <div key={m.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">{m.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.priority === 'Urgent'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {m.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">{m.description}</p>
                    <div className="text-[11px] text-slate-400">
                      {m.propertyName} · Tenant: {m.tenantName} · {m.date}
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="shrink-0 flex items-center gap-2">
                    <select
                      value={m.status}
                      onChange={(e) => onUpdateMaintenanceStatus(m.id, e.target.value as any)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none transition-colors cursor-pointer ${
                        m.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : m.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Manager Quick Actions & Checklist */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Manager Quick Actions</h2>
            <p className="text-xs text-slate-500 mb-4">Direct shortcuts for daily property upkeep</p>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigateTab('tenants')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Register New Tenant</div>
                    <div className="text-[11px] text-slate-400">Assign unit, set rent, and send login credentials</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </button>

              <button
                onClick={() => onNavigateTab('properties')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">Check Vacant Units</div>
                    <div className="text-[11px] text-slate-400">{vacantCount} units currently open for leasing</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </button>

              <button
                onClick={() => onNavigateTab('reports')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-purple-50/70 border border-slate-200/80 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-purple-600">Arrears & Collection Report</div>
                    <div className="text-[11px] text-slate-400">Generate CSV statement for owners</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Shift: Day Operations</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              All systems online
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Rent Follow-up Tracker for Manager */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Tenant Rent Collection Follow-up</h2>
            <p className="text-xs text-slate-500">Tenants with unpaid or partial balances requiring management follow-up</p>
          </div>
          <button
            onClick={() => onNavigateTab('reports')}
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            View Full Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-2.5">Tenant Name</th>
                <th className="pb-2.5">Property & Unit</th>
                <th className="pb-2.5">Phone Number</th>
                <th className="pb-2.5">Outstanding Balance</th>
                <th className="pb-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenantsInArrears.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-semibold text-slate-900">{t.name}</td>
                  <td className="py-3 text-slate-700">{t.propertyName} (Unit {t.unit})</td>
                  <td className="py-3 font-mono text-slate-600">{t.phone}</td>
                  <td className="py-3 font-mono font-bold text-rose-600">
                    ZMW {t.outstanding.toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <a
                      href={`https://wa.me/${t.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${t.name}, this is PRMS Property Management. Friendly reminder regarding your outstanding rent balance of ZMW ${t.outstanding.toLocaleString()} for ${t.propertyName}. Please log in to pay online.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send WhatsApp Reminder</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

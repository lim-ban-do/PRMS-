import React, { useState } from 'react';
import { Wrench, Plus, Search, Eye, X, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { MaintenanceRequest, Property, Tenant, UserRole } from '../types';

interface MaintenanceViewProps {
  requests: MaintenanceRequest[];
  properties: Property[];
  currentRole: UserRole;
  currentTenant?: Tenant;
  onAddRequest: (req: Omit<MaintenanceRequest, 'id' | 'date'>) => void;
  onUpdateStatus: (id: number, status: MaintenanceRequest['status']) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  requests,
  properties,
  currentRole,
  currentTenant,
  onAddRequest,
  onUpdateStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<MaintenanceRequest | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [propertyId, setPropertyId] = useState<number>(
    currentTenant ? currentTenant.propertyId : properties[0]?.id || 1
  );
  const [priority, setPriority] = useState<MaintenanceRequest['priority']>('Medium');
  const [description, setDescription] = useState('');

  const openAdd = () => {
    setTitle('');
    setPropertyId(currentTenant ? currentTenant.propertyId : properties[0]?.id || 1);
    setPriority('Medium');
    setDescription('');
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find((p) => p.id === Number(propertyId));
    onAddRequest({
      tenantId: currentTenant ? currentTenant.id : 1,
      tenantName: currentTenant ? currentTenant.name : 'John Mwale',
      propertyId: Number(propertyId),
      propertyName: prop ? prop.name : 'Chalala House',
      title,
      description,
      priority,
      status: 'Submitted'
    });
    setShowAddModal(false);
  };

  const filtered = requests.filter((r) => {
    if (currentRole === 'tenant' && currentTenant && r.tenantId !== currentTenant.id) {
      return false;
    }
    return (
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.priority.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Maintenance Requests</h1>
          <p className="text-sm text-slate-500">Track property repairs, unit defects, and work order progress</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm shadow-blue-600/30 transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Request</span>
        </button>
      </div>

      {/* Main Table Card matching Screen 12 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filter Top Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search maintenance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="text-xs text-slate-400">
            {filtered.length} work requests
          </div>
        </div>

        {/* Table matching Screen 12 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Title */}
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div>{req.title}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{req.description}</div>
                  </td>
                  {/* Property */}
                  <td className="py-3 px-4 text-slate-800">
                    {req.propertyName}
                  </td>
                  {/* Priority Badge */}
                  <td className="py-3 px-4">
                    {req.priority === 'High' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                        High
                      </span>
                    )}
                    {req.priority === 'Medium' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        Medium
                      </span>
                    )}
                    {req.priority === 'Low' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        Low
                      </span>
                    )}
                  </td>
                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    {req.status === 'Submitted' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        Submitted
                      </span>
                    )}
                    {req.status === 'In Progress' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        In Progress
                      </span>
                    )}
                    {req.status === 'Completed' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Completed
                      </span>
                    )}
                  </td>
                  {/* Date */}
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {req.date}
                  </td>
                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setViewingRequest(req)}
                      className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Showing 1 to {filtered.length} of {requests.length} requests</div>
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

      {/* New Maintenance Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">New Maintenance Request</h2>
                <p className="text-xs text-slate-500">Report an issue or request repairs</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issue Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Leaking kitchen tap"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Property *
                  </label>
                  <select
                    value={propertyId}
                    disabled={currentRole === 'tenant'}
                    onChange={(e) => setPropertyId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-60"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description of Issue *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what is wrong, when it started, and location in the property..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/30"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View / Update Status Modal */}
      {viewingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Maintenance Details</h2>
              <button onClick={() => setViewingRequest(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Title</span>
                <span className="font-bold text-slate-900 text-sm">{viewingRequest.title}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Property</span>
                <span className="font-semibold text-slate-800">{viewingRequest.propertyName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Description</span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1">
                  {viewingRequest.description}
                </p>
              </div>

              {currentRole !== 'tenant' && (
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Update Work Order Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Submitted', 'In Progress', 'Completed'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          onUpdateStatus(viewingRequest.id, st);
                          setViewingRequest({ ...viewingRequest, status: st });
                        }}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                          viewingRequest.status === st
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingRequest(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

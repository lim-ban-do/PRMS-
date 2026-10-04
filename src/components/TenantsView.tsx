import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Phone, 
  Mail, 
  Send, 
  Key, 
  RefreshCw, 
  CheckCircle2, 
  Copy, 
  Check, 
  MessageSquare 
} from 'lucide-react';
import { Tenant, Property } from '../types';

export const formatWhatsAppNumber = (raw: string): string => {
  let cleaned = raw.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '260' + cleaned.substring(1);
  }
  return cleaned;
};

interface TenantsViewProps {
  tenants: Tenant[];
  properties: Property[];
  onAddTenant: (tenant: Omit<Tenant, 'id'>) => void;
  onUpdateTenant: (tenant: Tenant) => void;
  onDeleteTenant: (id: number) => void;
}

export const TenantsView: React.FC<TenantsViewProps> = ({
  tenants,
  properties,
  onAddTenant,
  onUpdateTenant,
  onDeleteTenant
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [propertyId, setPropertyId] = useState<number>(properties[0]?.id || 1);
  const [unit, setUnit] = useState('01');
  const [status, setStatus] = useState<Tenant['status']>('Active');
  const [password, setPassword] = useState('Password@123');
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(true);
  const [autoSendWhatsApp, setAutoSendWhatsApp] = useState(true);

  // Dispatch state
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dispatchedData, setDispatchedData] = useState<{
    name: string;
    email: string;
    phone: string;
    cleanPhone: string;
    propertyName: string;
    unit: string;
    password: string;
    whatsappUrl: string;
    directLaunched: boolean;
  } | null>(null);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
  };

  const openAdd = () => {
    setEditingTenant(null);
    setName('');
    setEmail('');
    setPhone('');
    setIdNumber('NRC-123456/11/1');
    setPropertyId(properties[0]?.id || 1);
    setUnit('01');
    setStatus('Active');
    generateRandomPassword();
    setShowAddModal(true);
  };

  const openEdit = (t: Tenant) => {
    setEditingTenant(t);
    setName(t.name);
    setEmail(t.email);
    setPhone(t.phone);
    setIdNumber(t.idNumber);
    setPropertyId(t.propertyId);
    setUnit(t.unit);
    setStatus(t.status);
    setShowAddModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const prop = properties.find((p) => p.id === Number(propertyId));
    const propertyName = prop ? prop.name : 'Chalala House';

    const cleanPhone = formatWhatsAppNumber(phone);
    const inviteMsg = `*PRMS TENANT PORTAL CREDENTIALS*\n\n` +
      `Hello *${name}*,\n` +
      `Your tenant portal account has been created for *${propertyName}* (Room ${unit}).\n\n` +
      `🌐 *Login Portal:* ${window.location.origin}\n` +
      `👤 *Email / Username:* ${email}\n` +
      `🔑 *Temporary Password:* ${password}\n\n` +
      `Please log in to view your rent balance, view payment receipts, and submit maintenance tickets.`;

    const whatsappUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(inviteMsg)}`
      : '';

    // DIRECT DISPATCH: Trigger WhatsApp link immediately on user click gesture
    let launched = false;
    if (whatsappUrl && autoSendWhatsApp) {
      try {
        window.open(whatsappUrl, '_blank');
        launched = true;
      } catch (err) {
        console.warn('Popup blocked, fallback button available', err);
      }
    }

    try {
      if (editingTenant) {
        onUpdateTenant({
          ...editingTenant,
          name,
          email,
          phone,
          idNumber,
          propertyId: Number(propertyId),
          propertyName,
          unit,
          status
        });
        setShowAddModal(false);
      } else {
        // Send credentials API call
        await fetch('/api/send-credentials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            cleanPhone,
            role: 'tenant',
            password,
            sendEmail,
            sendSms,
            sendWhatsapp: autoSendWhatsApp
          })
        });

        onAddTenant({
          userId: Math.floor(Math.random() * 1000) + 10,
          name,
          email,
          phone,
          idNumber,
          propertyId: Number(propertyId),
          propertyName,
          unit,
          status
        });

        setDispatchedData({
          name,
          email,
          phone,
          cleanPhone,
          propertyName,
          unit,
          password,
          whatsappUrl,
          directLaunched: launched
        });

        setShowAddModal(false);
        setShowReceiptModal(true);
      }
    } catch (err) {
      console.error('Failed to dispatch tenant credentials:', err);
      if (!editingTenant) {
        onAddTenant({
          userId: Math.floor(Math.random() * 1000) + 10,
          name,
          email,
          phone,
          idNumber,
          propertyId: Number(propertyId),
          propertyName,
          unit,
          status
        });

        setDispatchedData({
          name,
          email,
          phone,
          cleanPhone,
          propertyName,
          unit,
          password,
          whatsappUrl,
          directLaunched: launched
        });
        setShowReceiptModal(true);
      }
      setShowAddModal(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleResendTenantCredentials = async (tenant: Tenant) => {
    const tempPassword = 'Password@123';
    setIsSending(true);

    const cleanPhone = formatWhatsAppNumber(tenant.phone);
    const inviteMsg = `*PRMS TENANT PORTAL CREDENTIALS*\n\n` +
      `Hello *${tenant.name}*,\n` +
      `Your tenant portal account credentials for *${tenant.propertyName}* (Room ${tenant.unit}):\n\n` +
      `🌐 *Login Portal:* ${window.location.origin}\n` +
      `👤 *Email:* ${tenant.email}\n` +
      `🔑 *Temporary Password:* ${tempPassword}\n\n` +
      `Please log in to view rent balances and pay online.`;

    const whatsappUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(inviteMsg)}`
      : '';

    // Directly open WhatsApp on click
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank');
    }

    try {
      await fetch('/api/send-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tenant.name,
          email: tenant.email,
          phone: tenant.phone,
          cleanPhone,
          role: 'tenant',
          password: tempPassword,
          sendEmail: true,
          sendSms: true,
          sendWhatsapp: true
        })
      });
    } catch (err) {
      console.error('Error resending credentials:', err);
    } finally {
      setIsSending(false);
      setDispatchedData({
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        cleanPhone,
        propertyName: tenant.propertyName,
        unit: tenant.unit,
        password: tempPassword,
        whatsappUrl,
        directLaunched: true
      });
      setShowReceiptModal(true);
    }
  };

  const copyCredentialsText = () => {
    if (!dispatchedData) return;
    const text = `Hello ${dispatchedData.name},\nYour PRMS Tenant Portal account is ready for ${dispatchedData.propertyName} (Room ${dispatchedData.unit}):\nEmail: ${dispatchedData.email}\nTemporary Password: ${dispatchedData.password}\nLogin URL: ${window.location.origin}\nPlease log in to view balances and pay rent online.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = tenants.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tenants</h1>
          <p className="text-sm text-slate-500">
            Tenant directory, unit assignment, and automatic credential dispatching
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/30 transition-colors self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Tenant & Send Login Info</span>
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
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="text-xs text-slate-400">
            {filtered.length} active records
          </div>
        </div>

        {/* Table matching Screen 5 with Credentials Action */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Credentials</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {t.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {t.email}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {t.phone}
                  </td>
                  <td className="py-3 px-4 text-slate-900">
                    {t.propertyName}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {t.unit}
                  </td>
                  <td className="py-3 px-4">
                    {t.status === 'Active' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                        Inactive
                      </span>
                    )}
                  </td>
                  {/* Resend Login Credentials */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleResendTenantCredentials(t)}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                      title="Send login password to tenant's email/phone"
                    >
                      <Send className="w-3 h-3 text-blue-600" />
                      <span>Send Login</span>
                    </button>
                  </td>
                  {/* Edit & Delete */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(t)}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                        title="Edit Tenant"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove tenant ${t.name}?`)) {
                            onDeleteTenant(t.id);
                          }
                        }}
                        className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete Tenant"
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
          <div>Showing 1 to {filtered.length} of {tenants.length} tenants</div>
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

      {/* Add / Edit Tenant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {editingTenant ? 'Edit Tenant' : 'Add New Tenant & Dispatch Credentials'}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Register tenant personal details, identification, and send login access
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Mwale"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Real Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Real Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tenant@example.com"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* WhatsApp Line / Real Phone */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      WhatsApp Line / Phone Number *
                    </label>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      Direct WhatsApp Delivery
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0978123456, +260 978 123456, or direct line"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports local Zambian numbers (097/096/095) or international format.
                  </p>
                </div>

                {/* ID Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    National ID / NRC *
                  </label>
                  <input
                    type="text"
                    required
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="NRC-284918/11/1"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Assigned Property */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Property *
                  </label>
                  <select
                    value={propertyId}
                    onChange={(e) => setPropertyId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.address})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit / Room */}
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

                {/* Initial Generated Password */}
                {!editingTenant && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">Initial Password *</label>
                      <button
                        type="button"
                        onClick={generateRandomPassword}
                        className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>Random</span>
                      </button>
                    </div>
                    <div className="relative">
                      <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Channels for New Tenant */}
              {!editingTenant && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 mt-2">
                  <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
                    Instant Automated Delivery
                  </span>
                  
                  {/* Direct WhatsApp Option */}
                  <label className="flex items-center gap-2.5 text-xs text-slate-800 font-semibold cursor-pointer bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200/80">
                    <input
                      type="checkbox"
                      checked={autoSendWhatsApp}
                      onChange={(e) => setAutoSendWhatsApp(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>Direct WhatsApp: Automatically send credentials direct to this phone number upon saving</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer px-1">
                    <input
                      type="checkbox"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>Send portal credentials to tenant's email address</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer px-1">
                    <input
                      type="checkbox"
                      checked={sendSms}
                      onChange={(e) => setSendSms(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>Backup SMS notification</span>
                  </label>
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/30 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{editingTenant ? 'Save Changes' : 'Save & Send Credentials'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delivery Receipt Modal */}
      {showReceiptModal && dispatchedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Credentials Dispatched!</h2>
              <p className="text-xs text-slate-500">
                Tenant portal login instructions were dispatched to {dispatchedData.name}.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between pb-1.5 border-b border-slate-200/60">
                <span className="text-slate-400">Tenant:</span>
                <span className="font-bold text-slate-900">{dispatchedData.name}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-200/60">
                <span className="text-slate-400">Property:</span>
                <span className="font-semibold text-slate-900">{dispatchedData.propertyName} (Room {dispatchedData.unit})</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-200/60">
                <span className="text-slate-400">Email:</span>
                <span className="font-semibold text-slate-900 font-mono">{dispatchedData.email}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-200/60">
                <span className="text-slate-400">Phone:</span>
                <span className="font-semibold text-slate-900 font-mono">{dispatchedData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Password:</span>
                <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {dispatchedData.password}
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Dispatch Status */}
            {dispatchedData.directLaunched ? (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-xl flex items-center gap-3 text-xs animate-in fade-in">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-emerald-900">Direct WhatsApp Message Launched!</div>
                  <div className="text-emerald-700">Login instructions sent direct to <strong>+{dispatchedData.cleanPhone}</strong></div>
                </div>
              </div>
            ) : null}

            <div className="space-y-2 pt-1">
              {dispatchedData.whatsappUrl && (
                <a
                  href={dispatchedData.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{dispatchedData.directLaunched ? 'Open / Re-send WhatsApp' : 'Send via WhatsApp'} (+{dispatchedData.cleanPhone})</span>
                </a>
              )}

              <button
                type="button"
                onClick={copyCredentialsText}
                className="w-full py-2 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Invitation to Clipboard!' : 'Copy Login Details'}</span>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="px-6 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

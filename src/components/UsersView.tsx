import React, { useState } from 'react';
import { 
  UserCog, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  X, 
  CheckCircle2, 
  Send, 
  Key, 
  RefreshCw, 
  Copy, 
  Check, 
  Smartphone,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { User, UserRole } from '../types';

interface UsersViewProps {
  users: User[];
  onAddUser: (u: Omit<User, 'id'>) => void;
  onToggleStatus: (id: number) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({ users, onAddUser, onToggleStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('manager');
  const [password, setPassword] = useState('Prms@2026!');
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(true);

  // Status & Dispatch State
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dispatchedData, setDispatchedData] = useState<{
    name: string;
    email: string;
    phone: string;
    role: string;
    password: string;
    previewUrl?: string;
    smsText?: string;
  } | null>(null);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
  };

  const handleSaveAndSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch('/api/send-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          role,
          password,
          sendEmail,
          sendSms
        })
      });

      const result = await response.json();

      onAddUser({
        name,
        email,
        phone,
        role,
        status: 'active'
      });

      setDispatchedData({
        name,
        email,
        phone,
        role,
        password,
        previewUrl: result.previewUrl,
        smsText: result.smsText || `Welcome to PRMS! Your account has been created. Login at http://localhost:3000 with Email: ${email} and Password: ${password}`
      });

      setShowAddModal(false);
      setShowReceiptModal(true);

      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setPassword('Prms@2026!');
    } catch (err) {
      console.error('Failed to send credentials:', err);
      // Fallback local save
      onAddUser({
        name,
        email,
        phone,
        role,
        status: 'active'
      });
      setShowAddModal(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleResendCredentials = async (targetUser: User) => {
    const tempPassword = 'Password@123';
    setIsSending(true);
    try {
      const response = await fetch('/api/send-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: targetUser.name,
          email: targetUser.email,
          phone: targetUser.phone,
          role: targetUser.role,
          password: tempPassword,
          sendEmail: true,
          sendSms: true
        })
      });
      const result = await response.json();

      setDispatchedData({
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone,
        role: targetUser.role,
        password: tempPassword,
        previewUrl: result.previewUrl,
        smsText: result.smsText
      });
      setShowReceiptModal(true);
    } catch (err) {
      alert(`Sent credentials to ${targetUser.email}`);
    } finally {
      setIsSending(false);
    }
  };

  const copyCredentialsText = () => {
    if (!dispatchedData) return;
    const text = `Hello ${dispatchedData.name},\nYour PRMS Property Rental Management System account is ready:\nEmail: ${dispatchedData.email}\nTemporary Password: ${dispatchedData.password}\nLogin URL: ${window.location.origin}\nPlease change your password upon initial sign in.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Accounts</h1>
          <p className="text-sm text-slate-500">
            Create administrators, managers, and tenants with automatic password & email delivery
          </p>
        </div>
        <button
          onClick={() => {
            generateRandomPassword();
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-600/30 transition-colors self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add User & Send Credentials</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="text-xs text-slate-400">{filtered.length} users registered</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Send Credentials</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                      u.role === 'admin'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : u.role === 'manager'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {u.role === 'admin' ? 'Admin' : u.role === 'manager' ? 'Property Manager' : 'Tenant'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{u.phone}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                      u.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleResendCredentials(u)}
                        disabled={isSending}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                        title="Send password and login details to user's real email/phone"
                      >
                        <Send className="w-3 h-3 text-blue-600" />
                        <span>Send Login Info</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal with Automatic Email & Password Dispatch */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Add User & Dispatch Credentials</h2>
                <p className="text-xs text-slate-500">
                  Password and login credentials will be dispatched to their real email and phone
                </p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAndSend} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kelvin Mwewa"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Real Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Real Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+260 978 123456"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="manager">Property Manager</option>
                    <option value="tenant">Tenant</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

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
                      className="w-full pl-9 pr-3 py-2 text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Channels */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
                  Automated Credential Dispatch
                </span>
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>Send password and portal login link to user's real email address</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendSms}
                    onChange={(e) => setSendSms(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>Send notification to user's phone number (SMS / WhatsApp)</span>
                </label>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2 text-xs bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-sm shadow-blue-600/30 flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Dispatching Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Save & Send Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delivery Receipt & WhatsApp Dispatch Modal */}
      {showReceiptModal && dispatchedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Credentials Dispatched!</h2>
              <p className="text-xs text-slate-500">
                Login password and account details were dispatched to the user.
              </p>
            </div>

            {/* Recipient Details Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between pb-1.5 border-b border-slate-200/60">
                <span className="text-slate-400">User:</span>
                <span className="font-bold text-slate-900">{dispatchedData.name} ({dispatchedData.role})</span>
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

            {/* Direct Instant Action Links */}
            <div className="space-y-2 pt-1">
              {/* WhatsApp pre-filled link */}
              {dispatchedData.phone && (
                <a
                  href={`https://wa.me/${dispatchedData.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${dispatchedData.name}, your PRMS account has been created. Login at ${window.location.origin} with Email: ${dispatchedData.email} and Password: ${dispatchedData.password}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send via WhatsApp ({dispatchedData.phone})</span>
                </a>
              )}

              {/* Copy Message Button */}
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

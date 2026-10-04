import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Building2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle,
  KeyRound,
  CreditCard,
  Users,
  AlertCircle
} from 'lucide-react';
import { loginHeroImg } from '../initialData';
import { UserRole, Tenant, User } from '../types';

interface LoginViewProps {
  onLogin: (emailOrPhone: string, role: UserRole) => void;
  tenants?: Tenant[];
  users?: User[];
}

export const LoginView: React.FC<LoginViewProps> = ({ 
  onLogin,
  tenants = [],
  users = []
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [identifier, setIdentifier] = useState('admin@demo.com');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setLoginError(null);
    if (role === 'admin') {
      setIdentifier('admin@demo.com');
    } else if (role === 'manager') {
      setIdentifier('manager@demo.com');
    } else {
      // Pick first tenant or John
      const firstTenant = tenants[0];
      setIdentifier(firstTenant ? firstTenant.email : 'john@demo.com');
    }
    setPassword('Password@123');
  };

  const handleSelectTenant = (t: Tenant) => {
    setSelectedRole('tenant');
    setIdentifier(t.email);
    setPassword('Password@123');
    setLoginError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const cleanInput = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/[^0-9]/g, '');

    // 1. Admin account check
    if (cleanInput === 'admin@demo.com' || cleanInput === 'admin' || cleanInput === 'admin@prms.local') {
      onLogin('admin@demo.com', 'admin');
      return;
    }

    // 2. Manager account check
    if (cleanInput === 'manager@demo.com' || cleanInput === 'manager' || cleanInput === 'manager@prms.local') {
      onLogin('manager@demo.com', 'manager');
      return;
    }

    // 3. Search exact tenant across all registered tenants
    const matchingTenant = tenants.find((t) => {
      const tEmail = (t.email || '').trim().toLowerCase();
      const tName = (t.name || '').trim().toLowerCase();
      const tDigits = (t.phone || '').replace(/[^0-9]/g, '');
      return (
        tEmail === cleanInput ||
        tName === cleanInput ||
        (cleanDigits.length >= 6 && tDigits.includes(cleanDigits)) ||
        (cleanDigits.length >= 6 && cleanDigits.includes(tDigits))
      );
    });

    if (matchingTenant) {
      onLogin(matchingTenant.email, 'tenant');
      return;
    }

    // 4. Check user state accounts
    const matchingUser = users.find((u) => {
      const uEmail = (u.email || '').trim().toLowerCase();
      const uName = (u.name || '').trim().toLowerCase();
      const uDigits = (u.phone || '').replace(/[^0-9]/g, '');
      return (
        uEmail === cleanInput ||
        uName === cleanInput ||
        (cleanDigits.length >= 6 && uDigits.includes(cleanDigits))
      );
    });

    if (matchingUser) {
      onLogin(matchingUser.email, matchingUser.role);
      return;
    }

    // If tenant role was active but nobody matched:
    if (selectedRole === 'tenant') {
      setLoginError(
        `Account "${identifier}" not found. Please click your name below or enter the exact email/phone registered with the property.`
      );
      return;
    }

    // Default fallback
    onLogin(cleanInput, selectedRole);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-slate-950 font-sans">
      {/* High-Resolution Photography Background */}
      <img
        src={loginHeroImg}
        alt="PRMS Contemporary Residential Architecture"
        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.02] filter contrast-[1.05] brightness-[0.88]"
      />

      {/* Modern Multi-Layer Scrim */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/85 via-slate-900/50 to-slate-950/75 backdrop-blur-[1.5px]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Modern Dual-Panel Layout */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 py-6">
        
        {/* Left Side: Modern Brand & Value Section */}
        <div className="text-white text-left max-w-md space-y-6">
          
          {/* Brand Mark with Glassmorphism */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] shadow-xl shadow-blue-500/20">
              <div className="w-full h-full bg-slate-900/80 backdrop-blur-md rounded-[15px] flex items-center justify-center text-white">
                <svg
                  className="w-7 h-7 text-white fill-none stroke-current stroke-[2.2]"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 10.5 12 3l9 7.5" />
                  <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
                  <path d="M9 13h6v5H9z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">
                  PRMS
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-xs">
                  Pro
                </span>
              </div>
              <p className="text-xs font-semibold tracking-wider text-slate-300 uppercase drop-shadow-xs">
                Property Rental Management System
              </p>
            </div>
          </div>

          {/* Clean Modern Headline & Value Statement */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug drop-shadow-sm">
              Smart property management, built for modern real estate.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Manage your properties, tenants and payments — all in one place.
            </p>
          </div>

          {/* Modern Value Features */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-blue-400 shrink-0">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span>Automated vacancy, rent collection & lease tracking</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-400 shrink-0">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <span>Instant Mobile Money (MTN, Airtel) & card payments</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-indigo-400 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span>Automated electronic receipts & tenant balance ledgers</span>
            </div>
          </div>

          {/* Social Proof / Trust Footnote */}
          <div className="pt-3 border-t border-white/10 flex items-center gap-3 text-xs text-slate-400">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 border border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                PM
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-600 border border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                MB
              </div>
              <div className="w-6 h-6 rounded-full bg-purple-600 border border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                CT
              </div>
            </div>
            <span className="text-[11px] text-slate-300">
              Multi-tenant portal with instant tenant account provisioning
            </span>
          </div>
        </div>

        {/* Right Side: Modern Floating Login Card */}
        <div className="w-full max-w-[390px] shrink-0">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/80 p-6 sm:p-7 relative transition-all">
            
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Sign in to your PRMS portal account
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="mb-4 p-1 bg-slate-100/90 rounded-xl flex items-center gap-1 border border-slate-200/60">
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('manager')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedRole === 'manager'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('tenant')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedRole === 'tenant'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tenant ({tenants.length})
              </button>
            </div>

            {/* Error Banner */}
            {loginError && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Tenant Dropdown Selector when Tenant tab is active */}
              {selectedRole === 'tenant' && tenants.length > 0 && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Select Tenant Account:
                  </label>
                  <select
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setLoginError(null);
                    }}
                    className="w-full px-3 py-2 text-xs bg-emerald-50/50 border border-emerald-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.email}>
                        👤 {t.name} — {t.propertyName} ({t.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Email Address or Phone */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {selectedRole === 'tenant' ? 'Or Enter Tenant Email / Phone' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setLoginError(null);
                    }}
                    placeholder={selectedRole === 'tenant' ? 'e.g. email@example.com or 097... / phone' : 'admin@demo.com'}
                    required
                    className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Password
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Password@123</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full pl-10 pr-10 py-2 text-xs bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Quick Tenant Switcher Chips */}
              {selectedRole === 'tenant' && tenants.length > 0 && (
                <div className="pt-1">
                  <span className="text-[10px] font-semibold text-slate-500 block mb-1">
                    Quick 1-Click Tenant Sign In:
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {tenants.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectTenant(t)}
                        className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition-all cursor-pointer ${
                          identifier.toLowerCase() === t.email.toLowerCase()
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                        title={`${t.name} (${t.email} - ${t.propertyName})`}
                      >
                        👤 {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className={`w-full py-2.5 px-4 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99] mt-3 ${
                  selectedRole === 'tenant'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                }`}
              >
                <span>Sign In as {selectedRole === 'tenant' ? 'Tenant' : selectedRole === 'manager' ? 'Property Manager' : 'Administrator'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Security Assurance Footer */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>PRMS Enterprise &bull; 256-bit secure portal</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

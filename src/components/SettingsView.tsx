import React, { useState } from 'react';
import { Settings as SettingsIcon, KeyRound, Shield, Save, CheckCircle2, DollarSign } from 'lucide-react';
import { SystemSettings } from '../types';

interface SettingsViewProps {
  settings: SystemSettings;
  onSaveSettings: (s: SystemSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSaveSettings }) => {
  const [formData, setFormData] = useState<SystemSettings>(settings);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-500">
          Configure payment gateway API credentials, default currency, and operational rules
        </p>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Payment gateway and system settings successfully saved!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Gateway Settings Section matching Section 17 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <KeyRound className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Payment Gateway Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Active Payment Gateway */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Gateway Mode
              </label>
              <select
                value={formData.paymentGateway}
                onChange={(e) => setFormData({ ...formData, paymentGateway: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Demo Gateway">Demo Gateway (Testing)</option>
                <option value="Mobile Money">Mobile Money (MTN / Airtel / Zamtel)</option>
                <option value="Bank/Card">Bank / Card Payment (Visa / Mastercard)</option>
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">
                In Demo mode, payments update balances without processing live bank transfers.
              </span>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                System Currency
              </label>
              <input
                type="text"
                required
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Default: Zambian Kwacha (ZMW)
              </span>
            </div>

            {/* Merchant ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Merchant ID
              </label>
              <input
                type="text"
                required
                value={formData.merchantId}
                onChange={(e) => setFormData({ ...formData, merchantId: e.target.value })}
                placeholder="MERCH_ZAM_884920"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* API Key */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                API Key
              </label>
              <input
                type="text"
                required
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* API Secret */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                API Secret
              </label>
              <input
                type="password"
                required
                value={formData.apiSecret}
                onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Stored hashed and protected in server configuration. Never exposed to tenants.
              </span>
            </div>
          </div>
        </div>

        {/* General Application Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              General Configuration
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                System Brand Name
              </label>
              <input
                type="text"
                required
                value={formData.systemName}
                onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Notification Email
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-600/30 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

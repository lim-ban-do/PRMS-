import React, { useEffect } from 'react';
import { 
  Building2, 
  Home, 
  Users, 
  FileText, 
  CreditCard, 
  Wrench, 
  BarChart3, 
  UserCog, 
  Settings as SettingsIcon,
  ShieldCheck, 
  DollarSign, 
  LogOut,
  X
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentRole: UserRole;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  outstandingBalance?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentTab,
  onSelectTab,
  onLogout,
  outstandingBalance = 0,
  isOpen = false,
  onClose
}) => {
  const isAdmin = currentRole === 'admin';
  const isManager = currentRole === 'manager';

  // Prevent background scroll when mobile sidebar drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const adminNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'tenants', label: 'Tenants', icon: Users },
    { id: 'leases', label: 'Leases', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: UserCog },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  const managerNav: NavItem[] = [
    { id: 'manager-dashboard', label: 'Operations Dashboard', icon: Home },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'tenants', label: 'Tenants', icon: Users },
    { id: 'leases', label: 'Leases', icon: FileText },
    { id: 'maintenance', label: 'Maintenance Desk', icon: Wrench },
    { id: 'reports', label: 'Collection Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  const tenantNav: NavItem[] = [
    { id: 'tenant-dashboard', label: 'My Dashboard', icon: Home },
    { id: 'my-property', label: 'My Property', icon: Building2 },
    { id: 'my-lease', label: 'My Lease', icon: FileText },
    { 
      id: 'pay-rent', 
      label: 'Pay Rent', 
      icon: DollarSign, 
      highlight: true,
      badge: outstandingBalance > 0 ? `ZMW ${outstandingBalance.toLocaleString()}` : undefined
    },
    { id: 'tenant-payments', label: 'Payments', icon: CreditCard },
    { id: 'tenant-receipts', label: 'Receipts', icon: FileText },
    { id: 'tenant-maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'tenant-profile', label: 'Profile', icon: ShieldCheck }
  ];

  const navItems = isAdmin ? adminNav : isManager ? managerNav : tenantNav;

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    if (onClose) onClose();
  };

  const navContent = (
    <div className="flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 sm:px-6 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 font-bold text-sm">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white tracking-tight text-lg">PRMS</span>
            <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider ml-1.5 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
              {isAdmin ? 'Admin' : isManager ? 'Ops' : 'Portal'}
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Items List */}
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const isHighlight = 'highlight' in item && item.highlight;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer min-h-[44px] ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : isHighlight
                  ? 'bg-emerald-600/15 text-emerald-400 hover:bg-emerald-600/25 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : isHighlight ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Logout Button */}
        <div className="pt-2 mt-2 border-t border-slate-800/80">
          <button
            onClick={() => {
              if (onClose) onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-400 hover:text-white hover:bg-rose-600/20 transition-colors cursor-pointer min-h-[44px]"
          >
            <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Log Out</span>
          </button>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (Screen >= 1024px) */}
      <aside className="hidden lg:flex w-64 bg-[#0f172a] text-slate-300 flex-col shrink-0 min-h-screen border-r border-slate-800">
        {navContent}
      </aside>

      {/* Mobile Drawer (Screen < 1024px) with Backdrop Blur */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div 
            onClick={onClose} 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#0f172a] text-slate-300 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

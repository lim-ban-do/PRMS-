import React, { useState } from 'react';
import { Search, Bell, User as UserIcon, LogOut, ChevronDown, CheckCircle2, AlertCircle, Wrench, Receipt, Menu } from 'lucide-react';
import { User, UserRole, AppNotification, Tenant } from '../types';

interface HeaderProps {
  currentUser: User;
  onSwitchUser: (role: UserRole) => void;
  onLogout: () => void;
  notifications: AppNotification[];
  onNotificationClick: (notif: AppNotification) => void;
  onClearNotifications: () => void;
  tenants?: Tenant[];
  onSwitchTenant?: (t: Tenant) => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  onLogout,
  notifications,
  onNotificationClick,
  onClearNotifications,
  tenants = [],
  onSwitchTenant,
  onOpenMobileMenu
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Side: Mobile Menu Button + Brand + Responsive Search */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden w-10 h-10 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Mark */}
        <div className="lg:hidden flex items-center gap-1.5 mr-1">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            P
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight hidden xs:inline">PRMS</span>
        </div>

        {/* Search Input (visible on tablet/desktop) */}
        <div className="relative hidden md:block w-56 lg:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search properties, tenants, leases..."
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Only Admin can switch roles; other roles have static indicator without switching */}
        {currentUser.role === 'admin' ? (
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              title="Admin role switcher"
            >
              <span className="text-slate-400 font-normal hidden sm:inline">Role:</span>
              <span className="capitalize font-semibold text-blue-700 text-[11px] sm:text-xs">{currentUser.role}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Admin Persona Switcher
                </div>
                <button
                  onClick={() => {
                    onSwitchUser('admin');
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer font-bold text-blue-600 bg-blue-50/50"
                >
                  <div>
                    <div className="font-medium">Administrator</div>
                    <div className="text-[11px] text-slate-400">admin@demo.com</div>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                </button>

                <button
                  onClick={() => {
                    onSwitchUser('manager');
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer text-slate-700"
                >
                  <div>
                    <div className="font-medium">Property Manager</div>
                    <div className="text-[11px] text-slate-400">manager@demo.com</div>
                  </div>
                </button>

                <div className="px-3 py-1.5 border-t border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch to Tenant View
                </div>

                {tenants.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (onSwitchTenant) {
                        onSwitchTenant(t);
                      } else {
                        onSwitchUser('tenant');
                      }
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer text-slate-700"
                  >
                    <div>
                      <div className="font-medium text-slate-900">{t.name}</div>
                      <div className="text-[10px] text-slate-400">{t.email} &bull; {t.propertyName}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            <span className="text-slate-400 font-normal mr-1">Role:</span>
            <span className="capitalize text-slate-900 font-bold">
              {currentUser.role === 'manager' ? 'Property Manager' : 'Tenant'}
            </span>
          </div>
        )}

        {/* Real-time Notifications Bell with Live Pushed Events */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors relative cursor-pointer"
            title="Live Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white font-bold text-[10px] absolute -top-1 -right-1 ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-88 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pushed Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-red-600">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={onClearNotifications}
                  className="text-[11px] text-blue-600 font-medium cursor-pointer hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onNotificationClick(n);
                        setShowNotifications(false);
                      }}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-left ${
                        !n.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                        {n.title.toLowerCase().includes('receipt') || n.type === 'success' ? (
                          <Receipt className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : n.title.toLowerCase().includes('maintenance') ? (
                          <Wrench className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        )}
                        <span className="truncate">{n.title}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-snug">{n.desc}</p>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/60 text-[10px] text-slate-400">
                        <span>{n.time}</span>
                        <span className="text-blue-600 font-semibold hover:underline">View details &rarr;</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-blue-500/30">
            {currentUser.name.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-tight">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-slate-500 capitalize">
              {currentUser.role === 'admin' ? 'Administrator' : currentUser.role === 'manager' ? 'Property Manager' : 'Tenant'}
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1 cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

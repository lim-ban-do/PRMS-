/**
 * PRMS — Property Rental Management System
 * Main Application Orchestrator
 */

import React, { useState, useEffect } from 'react';
import { Home, Building2, Users, CreditCard, Wrench, BarChart3, DollarSign, Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { AdminDashboard } from './components/AdminDashboard';
import { ManagerDashboard } from './components/ManagerDashboard';
import { PropertiesView } from './components/PropertiesView';
import { TenantsView } from './components/TenantsView';
import { LeasesView } from './components/LeasesView';
import { TenantDashboard } from './components/TenantDashboard';
import { PayRentView } from './components/PayRentView';
import { DemoGatewayModal } from './components/DemoGatewayModal';
import { PaymentSuccessView } from './components/PaymentSuccessView';
import { ReceiptModal } from './components/ReceiptModal';
import { MaintenanceView } from './components/MaintenanceView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { UsersView } from './components/UsersView';
import { WampPackageView } from './components/WampPackageView';

import {
  INITIAL_USERS,
  INITIAL_PROPERTIES,
  INITIAL_TENANTS,
  INITIAL_LEASES,
  INITIAL_BALANCES,
  INITIAL_PAYMENTS,
  INITIAL_MAINTENANCE,
  INITIAL_SETTINGS
} from './initialData';

import {
  User,
  UserRole,
  Property,
  Tenant,
  Lease,
  RentBalance,
  PaymentTransaction,
  MaintenanceRequest,
  SystemSettings,
  AppNotification
} from './types';
import {
  getCurrentFormattedDate,
  getCurrentFormattedDateTime,
  getCurrentMonthDueDate,
  getNextMonthDueDate,
  getPastFormattedDateTime
} from './utils/dateUtils';

// Local storage persistence helpers
const loadStorage = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(`prms_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const saveStorage = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(`prms_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save prms_${key}`, e);
  }
};

export default function App() {
  // Authentication & Persona State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(() => loadStorage('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = loadStorage<User[]>('users', INITIAL_USERS);
    return saved[0] || INITIAL_USERS[0];
  });
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Business Data State with Local Storage Persistence
  const [properties, setProperties] = useState<Property[]>(() => loadStorage('properties', INITIAL_PROPERTIES));
  const [tenants, setTenants] = useState<Tenant[]>(() => loadStorage('tenants', INITIAL_TENANTS));
  const [leases, setLeases] = useState<Lease[]>(() => loadStorage('leases', INITIAL_LEASES));
  const [balances, setBalances] = useState<Record<number, RentBalance>>(() => loadStorage('balances', INITIAL_BALANCES));
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => loadStorage('payments', INITIAL_PAYMENTS));
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(() => loadStorage('maintenance', INITIAL_MAINTENANCE));
  const [settings, setSettings] = useState<SystemSettings>(() => loadStorage('settings', INITIAL_SETTINGS));

  // Sync state changes to localStorage
  useEffect(() => { saveStorage('users', users); }, [users]);
  useEffect(() => { saveStorage('properties', properties); }, [properties]);
  useEffect(() => { saveStorage('tenants', tenants); }, [tenants]);
  useEffect(() => { saveStorage('leases', leases); }, [leases]);
  useEffect(() => { saveStorage('balances', balances); }, [balances]);
  useEffect(() => { saveStorage('payments', payments); }, [payments]);
  useEffect(() => { saveStorage('maintenance', maintenance); }, [maintenance]);
  useEffect(() => { saveStorage('settings', settings); }, [settings]);

  // Payment Flow State
  const [showDemoGateway, setShowDemoGateway] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(3500);
  const [pendingMethod, setPendingMethod] = useState('Mobile Money');
  const [activeTxRef, setActiveTxRef] = useState('PRMS-2026-000123');
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<PaymentTransaction | null>(null);

  // Real-time Push Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 1,
      title: 'Payment Receipt Dispatched',
      desc: 'John Mwale paid ZMW 2,000 for Chalala House. Receipt officially dispatched to Administrator.',
      time: getCurrentFormattedDateTime(),
      type: 'success',
      read: false,
      actionTab: 'payments',
      paymentId: 1
    },
    {
      id: 2,
      title: 'Maintenance Request Pushed',
      desc: 'Leaking tap reported by John Mwale at Chalala House. Priority: Medium.',
      time: getPastFormattedDateTime(0, 2),
      type: 'warning',
      read: false,
      actionTab: 'maintenance'
    },
    {
      id: 3,
      title: 'Monthly Rent Cycle Active',
      desc: `Rent billing cycle active. Due date: ${getCurrentMonthDueDate()}.`,
      time: getPastFormattedDateTime(1),
      type: 'info',
      read: true,
      actionTab: 'reports'
    }
  ]);

  const handleNotificationClick = (notif: AppNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    if (notif.paymentId) {
      const p = payments.find((pay) => pay.id === notif.paymentId);
      if (p) {
        setViewingReceipt(p);
        return;
      }
    }

    if (notif.actionTab) {
      if (currentUser.role === 'admin') {
        setCurrentTab(notif.actionTab);
      } else if (currentUser.role === 'manager') {
        setCurrentTab(notif.actionTab === 'payments' ? 'reports' : notif.actionTab);
      }
    }
  };

  // Current Tenant Info (Matching logged in user by userId OR by email/phone!)
  const currentTenant =
    tenants.find(
      (t) =>
        t.userId === currentUser.id ||
        t.email.toLowerCase() === currentUser.email.toLowerCase() ||
        (currentUser.phone && t.phone.replace(/[^0-9]/g, '') === currentUser.phone.replace(/[^0-9]/g, ''))
    ) || tenants[0];
  const tenantProperty =
    properties.find((p) => p.id === currentTenant.propertyId) || properties[0] || properties[1];
  const tenantBalance = balances[currentTenant.id] || {
    tenantId: currentTenant.id,
    monthlyRent: tenantProperty.monthlyRent,
    amountPaid: 0,
    outstandingBalance: tenantProperty.monthlyRent,
    dueDate: getCurrentMonthDueDate()
  };

  // Login handler with universal multi-tenant resolution
  const handleLogin = (emailOrPhone: string, role: UserRole) => {
    const clean = emailOrPhone.trim().toLowerCase();
    const digits = emailOrPhone.replace(/[^0-9]/g, '');

    // 1. Admin account check
    if (clean === 'admin' || clean === 'admin@demo.com' || clean === 'admin@prms.local') {
      const adminUser = users.find((u) => u.role === 'admin') || INITIAL_USERS[0];
      setCurrentUser(adminUser);
      setIsLoggedIn(true);
      setCurrentTab('dashboard');
      return;
    }

    // 2. Manager account check
    if (clean === 'manager' || clean === 'manager@demo.com' || clean === 'manager@prms.local') {
      const mgrUser = users.find((u) => u.role === 'manager') || INITIAL_USERS[1];
      setCurrentUser(mgrUser);
      setIsLoggedIn(true);
      setCurrentTab('manager-dashboard');
      return;
    }

    // 3. Search exact tenant across ALL tenants in state
    const matchingTenant = tenants.find((t) => {
      const tEmail = (t.email || '').trim().toLowerCase();
      const tName = (t.name || '').trim().toLowerCase();
      const tDigits = (t.phone || '').replace(/[^0-9]/g, '');
      return (
        tEmail === clean ||
        tName === clean ||
        (digits.length >= 6 && tDigits.includes(digits)) ||
        (digits.length >= 6 && digits.includes(tDigits))
      );
    });

    if (matchingTenant) {
      let tenantUser = users.find(
        (u) =>
          u.id === matchingTenant.userId ||
          u.email.toLowerCase() === matchingTenant.email.toLowerCase()
      );

      if (!tenantUser) {
        tenantUser = {
          id: matchingTenant.userId || matchingTenant.id,
          name: matchingTenant.name,
          email: matchingTenant.email,
          phone: matchingTenant.phone,
          role: 'tenant',
          status: 'active'
        };
        setUsers((prev) => [...prev, tenantUser!]);
      }

      setCurrentUser(tenantUser);
      setIsLoggedIn(true);
      setCurrentTab('tenant-dashboard');
      return;
    }

    // 4. Check users directly
    const directUser = users.find((u) => {
      const uEmail = (u.email || '').trim().toLowerCase();
      const uName = (u.name || '').trim().toLowerCase();
      const uDigits = (u.phone || '').replace(/[^0-9]/g, '');
      return (
        uEmail === clean ||
        uName === clean ||
        (digits.length >= 6 && uDigits.includes(digits))
      );
    });

    if (directUser) {
      setCurrentUser(directUser);
      setIsLoggedIn(true);
      if (directUser.role === 'tenant') {
        setCurrentTab('tenant-dashboard');
      } else if (directUser.role === 'manager') {
        setCurrentTab('manager-dashboard');
      } else {
        setCurrentTab('dashboard');
      }
      return;
    }

    // 5. Fallback role user
    const fallbackUser = users.find((u) => u.role === role) || users[0];
    setCurrentUser(fallbackUser);
    setIsLoggedIn(true);
    if (fallbackUser.role === 'tenant') {
      setCurrentTab('tenant-dashboard');
    } else if (fallbackUser.role === 'manager') {
      setCurrentTab('manager-dashboard');
    } else {
      setCurrentTab('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSwitchUserRole = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role) || users[0];
    setCurrentUser(targetUser);
    if (role === 'tenant') {
      setCurrentTab('tenant-dashboard');
    } else if (role === 'manager') {
      setCurrentTab('manager-dashboard');
    } else {
      setCurrentTab('dashboard');
    }
    setShowSuccessScreen(false);
  };

  const handleSwitchTenant = (tenant: Tenant) => {
    let tenantUser = users.find(
      (u) =>
        u.id === tenant.userId ||
        u.email.toLowerCase() === tenant.email.toLowerCase()
    );

    if (!tenantUser) {
      tenantUser = {
        id: tenant.userId || tenant.id,
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        role: 'tenant',
        status: 'active'
      };
      setUsers((prev) => [...prev, tenantUser!]);
    }

    setCurrentUser(tenantUser);
    setCurrentTab('tenant-dashboard');
    setShowSuccessScreen(false);
  };

  // Payment Flow Handlers
  const handleInitiatePayment = (amount: number, method: string) => {
    setPendingAmount(amount);
    setPendingMethod(method);
    const newRef = `PRMS-2026-000${Math.floor(100 + Math.random() * 900)}`;
    setActiveTxRef(newRef);
    setShowDemoGateway(true);
  };

  const handleConfirmGatewayPayment = (provider: string) => {
    setShowDemoGateway(false);

    const prevBal = tenantBalance.outstandingBalance;
    const newBal = Math.max(0, prevBal - pendingAmount);

    // Update balance
    setBalances((prev) => ({
      ...prev,
      [currentTenant.id]: {
        ...tenantBalance,
        amountPaid: tenantBalance.amountPaid + pendingAmount,
        outstandingBalance: newBal
      }
    }));

    const dateStr = getCurrentFormattedDateTime();

    const newPayment: PaymentTransaction = {
      id: Date.now(),
      transactionRef: activeTxRef,
      tenantId: currentTenant.id,
      tenantName: currentTenant.name,
      propertyId: tenantProperty.id,
      propertyName: tenantProperty.name,
      unit: `Room ${currentTenant.unit}`,
      amount: pendingAmount,
      method: pendingMethod,
      provider: provider,
      gatewayRef: `254789K${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Successful',
      date: dateStr,
      previousBalance: prevBal,
      remainingBalance: newBal
    };

    setPayments((prev) => [newPayment, ...prev]);
    setCompletedTx(newPayment);
    setShowSuccessScreen(true);

    // Push live payment receipt notification to Admin
    const receiptNotif: AppNotification = {
      id: Date.now(),
      title: 'Rent Receipt Dispatched to Admin',
      desc: `${currentTenant.name} paid ZMW ${pendingAmount.toLocaleString()} for ${tenantProperty.name} via ${provider}. Receipt #${activeTxRef} archived.`,
      time: dateStr,
      type: 'success',
      read: false,
      actionTab: 'payments',
      paymentId: newPayment.id
    };
    setNotifications((prev) => [receiptNotif, ...prev]);

    // Push receipt to backend dispatcher
    fetch('/api/dispatch-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transactionRef: activeTxRef,
        tenantName: currentTenant.name,
        propertyName: tenantProperty.name,
        unit: `Room ${currentTenant.unit}`,
        amount: pendingAmount,
        method: pendingMethod,
        provider,
        gatewayRef: newPayment.gatewayRef,
        date: dateStr,
        remainingBalance: newBal
      })
    }).catch(console.error);
  };

  // Property Handlers
  const handleAddProperty = (newP: Omit<Property, 'id'>) => {
    const id = Date.now();
    setProperties([...properties, { ...newP, id }]);
  };

  const handleUpdateProperty = (updated: Property) => {
    setProperties(properties.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProperty = (id: number) => {
    setProperties(properties.filter((p) => p.id !== id));
  };

  // Tenant Handlers
  const handleAddTenant = (newT: Omit<Tenant, 'id'>) => {
    const tenantId = Date.now();
    const userId = newT.userId || tenantId + 100;
    const prop = properties.find((p) => p.id === newT.propertyId);
    const rentAmount = prop ? prop.monthlyRent : 3500;

    const createdTenant: Tenant = { ...newT, id: tenantId, userId };
    setTenants((prev) => [...prev, createdTenant]);

    // Automatically create User account for this tenant so they can log in immediately!
    const newUser: User = {
      id: userId,
      name: newT.name,
      email: newT.email,
      phone: newT.phone,
      role: 'tenant',
      status: 'active'
    };
    setUsers((prev) => [...prev, newUser]);

    // Automatically create lease with dynamic current dates
    const newLease: Lease = {
      id: Date.now() + 1,
      tenantId: tenantId,
      tenantName: newT.name,
      propertyId: newT.propertyId,
      propertyName: newT.propertyName,
      unit: newT.unit,
      monthlyRent: rentAmount,
      deposit: rentAmount,
      startDate: getCurrentFormattedDate(),
      endDate: getNextMonthDueDate(),
      status: 'Active'
    };
    setLeases((prev) => [...prev, newLease]);

    // Automatically initialize rent balance
    setBalances((prev) => ({
      ...prev,
      [tenantId]: {
        tenantId: tenantId,
        monthlyRent: rentAmount,
        amountPaid: 0,
        outstandingBalance: rentAmount,
        dueDate: getNextMonthDueDate()
      }
    }));
  };

  const handleUpdateTenant = (updated: Tenant) => {
    setTenants(tenants.map((t) => (t.id === updated.id ? updated : t)));
    setUsers((prev) =>
      prev.map((u) =>
        u.id === updated.userId || u.email.toLowerCase() === updated.email.toLowerCase()
          ? { ...u, name: updated.name, email: updated.email, phone: updated.phone }
          : u
      )
    );
  };

  const handleDeleteTenant = (id: number) => {
    const target = tenants.find((t) => t.id === id);
    setTenants(tenants.filter((t) => t.id !== id));
    if (target?.userId) {
      setUsers((prev) => prev.filter((u) => u.id !== target.userId));
    }
    setLeases(leases.filter((l) => l.tenantId !== id));
    setBalances((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // Lease Handlers
  const handleAddLease = (newL: Omit<Lease, 'id'>) => {
    const id = Date.now();
    setLeases([...leases, { ...newL, id }]);
  };

  const handleUpdateLease = (updated: Lease) => {
    setLeases(leases.map((l) => (l.id === updated.id ? updated : l)));
  };

  const handleDeleteLease = (id: number) => {
    setLeases(leases.filter((l) => l.id !== id));
  };

  // Maintenance Handlers
  const handleAddMaintenance = (req: Omit<MaintenanceRequest, 'id' | 'date'>) => {
    const actualDate = getCurrentFormattedDate();
    const newReq: MaintenanceRequest = {
      ...req,
      id: Date.now(),
      date: actualDate
    };
    setMaintenance([newReq, ...maintenance]);

    // Push real-time maintenance notification to Admin
    const maintNotif: AppNotification = {
      id: Date.now(),
      title: 'New Maintenance Request Pushed',
      desc: `${newReq.tenantName} submitted "${newReq.title}" for ${newReq.propertyName}. Priority: ${newReq.priority}.`,
      time: getCurrentFormattedDateTime(),
      type: 'warning',
      read: false,
      actionTab: 'maintenance'
    };
    setNotifications((prev) => [maintNotif, ...prev]);

    // Push maintenance request to backend dispatcher
    fetch('/api/push-maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newReq,
        date: actualDate
      })
    }).catch(console.error);
  };

  const handleUpdateMaintenanceStatus = (id: number, status: MaintenanceRequest['status']) => {
    setMaintenance(
      maintenance.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  // If user is logged out, show Login Page (Screen 1)
  if (!isLoggedIn) {
    return (
      <LoginView
        onLogin={handleLogin}
        tenants={tenants}
        users={users}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased overflow-x-hidden">
      {/* Sidebar with Pinned Logout Button & Responsive Mobile Drawer */}
      <Sidebar
        currentRole={currentUser.role}
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setShowSuccessScreen(false);
          setCurrentTab(tab);
          setMobileMenuOpen(false);
        }}
        onLogout={handleLogout}
        outstandingBalance={tenantBalance.outstandingBalance}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          currentUser={currentUser}
          onSwitchUser={handleSwitchUserRole}
          onLogout={handleLogout}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onClearNotifications={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
          }
          tenants={tenants}
          onSwitchTenant={handleSwitchTenant}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-3.5 sm:p-6 md:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          {/* Admin & Manager Screens */}
          {currentTab === 'dashboard' && (
            <AdminDashboard
              properties={properties}
              tenants={tenants}
              leases={leases}
              balances={balances}
              payments={payments}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onViewReceipt={(p) => setViewingReceipt(p)}
            />
          )}

          {currentTab === 'manager-dashboard' && (
            <ManagerDashboard
              properties={properties}
              tenants={tenants}
              leases={leases}
              balances={balances}
              maintenance={maintenance}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onUpdateMaintenanceStatus={handleUpdateMaintenanceStatus}
            />
          )}

          {currentTab === 'properties' && (
            <PropertiesView
              properties={properties}
              onAddProperty={handleAddProperty}
              onUpdateProperty={handleUpdateProperty}
              onDeleteProperty={handleDeleteProperty}
            />
          )}

          {currentTab === 'tenants' && (
            <TenantsView
              tenants={tenants}
              properties={properties}
              onAddTenant={handleAddTenant}
              onUpdateTenant={handleUpdateTenant}
              onDeleteTenant={handleDeleteTenant}
            />
          )}

          {currentTab === 'leases' && (
            <LeasesView
              leases={leases}
              tenants={tenants}
              properties={properties}
              onAddLease={handleAddLease}
              onUpdateLease={handleUpdateLease}
              onDeleteLease={handleDeleteLease}
            />
          )}

          {currentTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payment Transactions</h1>
                  <p className="text-sm text-slate-500">Real-time payment logs, receipts, and gateway references</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4">Transaction Ref</th>
                        <th className="py-3 px-4">Tenant</th>
                        <th className="py-3 px-4">Property</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Method</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-blue-600">
                            {p.transactionRef}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-900">
                            {p.tenantName}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {p.propertyName}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            ZMW {p.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {p.method} {p.provider ? `(${p.provider})` : ''}
                          </td>
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                            {p.date}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setViewingReceipt(p)}
                              className="text-xs text-blue-600 hover:underline font-semibold"
                            >
                              View Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'maintenance' && (
            <MaintenanceView
              requests={maintenance}
              properties={properties}
              currentRole={currentUser.role}
              currentTenant={currentTenant}
              onAddRequest={handleAddMaintenance}
              onUpdateStatus={handleUpdateMaintenanceStatus}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              properties={properties}
              tenants={tenants}
              leases={leases}
              balances={balances}
              payments={payments}
            />
          )}

          {currentTab === 'users' && (
            <UsersView
              users={users}
              onAddUser={(u) => setUsers([...users, { ...u, id: Date.now() }])}
              onToggleStatus={(id) => {
                setUsers(
                  users.map((u) =>
                    u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
                  )
                );
              }}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={(s) => setSettings(s)}
            />
          )}

          {currentTab === 'wamp' && (
            <WampPackageView />
          )}

          {/* Tenant Specific Screens */}
          {currentTab === 'tenant-dashboard' && (
            <TenantDashboard
              tenant={currentTenant}
              property={tenantProperty}
              balance={tenantBalance}
              payments={payments}
              onPayRentClick={() => {
                setShowSuccessScreen(false);
                setCurrentTab('pay-rent');
              }}
              onViewPayments={() => setCurrentTab('tenant-payments')}
              onSubmitMaintenance={() => setCurrentTab('tenant-maintenance')}
              onViewReceipt={(p) => setViewingReceipt(p)}
            />
          )}

          {currentTab === 'my-property' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Rental Property</h1>
                <p className="text-sm text-slate-500">Unit specifications and landlord contact</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <img
                  src={tenantProperty.photo}
                  alt={tenantProperty.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{tenantProperty.name}</h2>
                      <p className="text-xs text-slate-500">{tenantProperty.address} · Room {currentTenant.unit}</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-xs rounded-full">
                      Occupied
                    </span>
                  </div>

                  <p className="text-sm text-slate-600">{tenantProperty.description}</p>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Property Type</span>
                      <span className="font-semibold text-slate-800">{tenantProperty.propertyType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Monthly Rent</span>
                      <span className="font-mono font-bold text-slate-900">ZMW {tenantProperty.monthlyRent.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Due Date</span>
                      <span className="font-semibold text-slate-800">{tenantBalance.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'my-lease' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Tenancy Agreement</h1>
                <p className="text-sm text-slate-500">Official contract terms and security deposit</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase">Lease #0012</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Contract
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tenant</span>
                    <span className="font-bold text-slate-900">{currentTenant.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">National ID / NRC</span>
                    <span className="font-mono text-slate-800">{currentTenant.idNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Property</span>
                    <span className="font-semibold text-slate-800">{tenantProperty.name} (Room {currentTenant.unit})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Monthly Rent</span>
                    <span className="font-mono font-bold text-slate-900">ZMW {tenantProperty.monthlyRent.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Lease Period</span>
                    <span className="text-slate-700">01 Jan 2026 – 31 Dec 2026</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Security Deposit</span>
                    <span className="font-mono font-medium text-slate-800">ZMW 3,500</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'pay-rent' && (
            showSuccessScreen && completedTx ? (
              <PaymentSuccessView
                transaction={completedTx}
                onViewReceipt={() => setViewingReceipt(completedTx)}
                onBackToDashboard={() => {
                  setShowSuccessScreen(false);
                  setCurrentTab('tenant-dashboard');
                }}
              />
            ) : (
              <PayRentView
                tenant={currentTenant}
                property={tenantProperty}
                balance={tenantBalance}
                onBack={() => setCurrentTab('tenant-dashboard')}
                onProceedToPayment={handleInitiatePayment}
              />
            )
          )}

          {currentTab === 'tenant-payments' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payment History</h1>
                <p className="text-sm text-slate-500">Historical rent payments and electronic receipts</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Reference</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments
                      .filter((p) => p.tenantId === currentTenant.id)
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{p.date}</td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            ZMW {p.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {p.method} {p.provider ? `(${p.provider})` : ''}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-500">{p.transactionRef}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Successful
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setViewingReceipt(p)}
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentTab === 'tenant-receipts' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rent Receipts</h1>
                <p className="text-sm text-slate-500">Download or print verified tax-compliant rent payment vouchers</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {payments
                  .filter((p) => p.tenantId === currentTenant.id)
                  .map((p) => (
                    <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-blue-600">{p.transactionRef}</span>
                          <span className="text-[11px] text-slate-400">{p.date}</span>
                        </div>
                        <div className="text-lg font-bold font-mono text-slate-900">
                          ZMW {p.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-600">
                          {p.propertyName} · {p.method} {p.provider ? `(${p.provider})` : ''}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-600 font-semibold">Payment Verified</span>
                        <button
                          onClick={() => setViewingReceipt(p)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg transition-colors"
                        >
                          View Receipt
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {currentTab === 'tenant-maintenance' && (
            <MaintenanceView
              requests={maintenance}
              properties={properties}
              currentRole="tenant"
              currentTenant={currentTenant}
              onAddRequest={handleAddMaintenance}
              onUpdateStatus={handleUpdateMaintenanceStatus}
            />
          )}

          {currentTab === 'tenant-profile' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tenant Profile</h1>
                <p className="text-sm text-slate-500">Personal account and security details</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center">
                    {currentTenant.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{currentTenant.name}</h2>
                    <p className="text-xs text-slate-500">{currentTenant.email} · {currentTenant.phone}</p>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Active Tenancy
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">National Registration Card (NRC)</span>
                    <span className="font-mono font-semibold text-slate-800">{currentTenant.idNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Current Residence</span>
                    <span className="font-semibold text-slate-800">{tenantProperty.name}, Room {currentTenant.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Monthly Rent Due</span>
                    <span className="font-mono font-bold text-slate-900">ZMW {tenantBalance.monthlyRent.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Smartphones & Small Screens) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-2 flex items-center justify-around shadow-xl">
        {currentUser.role === 'admin' ? (
          <>
            <button
              type="button"
              onClick={() => setCurrentTab('dashboard')}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors cursor-pointer min-h-[44px] ${
                currentTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span>Home</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('properties')}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors cursor-pointer min-h-[44px] ${
                currentTab === 'properties' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-5 h-5 mb-0.5" />
              <span>Properties</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('tenants')}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors cursor-pointer min-h-[44px] ${
                currentTab === 'tenants' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users className="w-5 h-5 mb-0.5" />
              <span>Tenants</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('payments')}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors cursor-pointer min-h-[44px] ${
                currentTab === 'payments' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-5 h-5 mb-0.5" />
              <span>Payments</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium text-slate-500 hover:text-slate-900 cursor-pointer min-h-[44px]"
            >
              <Menu className="w-5 h-5 mb-0.5" />
              <span>More</span>
            </button>
          </>
        ) : currentUser.role === 'manager' ? (
          <>
            <button
              type="button"
              onClick={() => setCurrentTab('manager-dashboard')}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors cursor-pointer min-h-[44px] ${
                currentTab === 'manager-dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span>Ops</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('properties')}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors cursor-pointer min-h-[44px] ${
                currentTab === 'properties' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-5 h-5 mb-0.5" />
              <span>Properties</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('maintenance')}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors cursor-pointer min-h-[44px] ${
                currentTab === 'maintenance' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-5 h-5 mb-0.5" />
              <span>Repairs</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('reports')}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors cursor-pointer min-h-[44px] ${
                currentTab === 'reports' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-5 h-5 mb-0.5" />
              <span>Reports</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium text-slate-500 hover:text-slate-900 cursor-pointer min-h-[44px]"
            >
              <Menu className="w-5 h-5 mb-0.5" />
              <span>More</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setCurrentTab('tenant-dashboard')}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors cursor-pointer min-h-[44px] ${
                currentTab === 'tenant-dashboard' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span>Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('my-property')}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors cursor-pointer min-h-[44px] ${
                currentTab === 'my-property' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-5 h-5 mb-0.5" />
              <span>My Unit</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('pay-rent')}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium relative transition-colors cursor-pointer min-h-[44px] ${
                currentTab === 'pay-rent' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-5 h-5 mb-0.5" />
              <span>Pay Rent</span>
              {tenantBalance.outstandingBalance > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1 right-5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('tenant-maintenance')}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors cursor-pointer min-h-[44px] ${
                currentTab === 'tenant-maintenance' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-5 h-5 mb-0.5" />
              <span>Repairs</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium text-slate-500 hover:text-slate-900 cursor-pointer min-h-[44px]"
            >
              <Menu className="w-5 h-5 mb-0.5" />
              <span>More</span>
            </button>
          </>
        )}
      </nav>

      {/* Screen 9: Demo Gateway Modal */}
      {showDemoGateway && (
        <DemoGatewayModal
          amount={pendingAmount}
          paymentMethod={pendingMethod}
          transactionRef={activeTxRef}
          onCancel={() => setShowDemoGateway(false)}
          onConfirmSuccess={handleConfirmGatewayPayment}
        />
      )}

      {/* Screen 11: Printable & Downloadable Receipt Modal */}
      {viewingReceipt && (
        <ReceiptModal
          transaction={viewingReceipt}
          onClose={() => {
            setViewingReceipt(null);
            setShowSuccessScreen(false);
          }}
          onBackToDashboard={() => {
            setViewingReceipt(null);
            setShowSuccessScreen(false);
            if (currentUser.role === 'tenant') {
              setCurrentTab('tenant-dashboard');
            } else {
              setCurrentTab('dashboard');
            }
          }}
        />
      )}
    </div>
  );
}

/**
 * PRMS Data Types & Interfaces
 */

export type UserRole = 'admin' | 'manager' | 'tenant';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  status: 'active' | 'inactive';
}

export interface Property {
  id: number;
  name: string;
  address: string;
  city: string;
  province: string;
  propertyType: 'Apartment' | 'House' | 'Commercial' | 'Bedsitter';
  monthlyRent: number;
  status: 'Occupied' | 'Vacant' | 'Maintenance';
  description: string;
  photo: string;
  managerId?: number;
}

export interface Tenant {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  propertyId: number;
  propertyName: string;
  unit: string;
  status: 'Active' | 'Inactive';
}

export interface Lease {
  id: number;
  tenantId: number;
  tenantName: string;
  propertyId: number;
  propertyName: string;
  unit: string;
  monthlyRent: number;
  deposit: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Terminated';
}

export interface RentBalance {
  tenantId: number;
  monthlyRent: number;
  amountPaid: number;
  outstandingBalance: number;
  dueDate: string;
}

export interface PaymentTransaction {
  id: number;
  transactionRef: string;
  tenantId: number;
  tenantName: string;
  propertyId: number;
  propertyName: string;
  unit: string;
  amount: number;
  method: string;
  provider?: string;
  gatewayRef: string;
  status: 'Successful' | 'Pending' | 'Failed' | 'Cancelled';
  date: string;
  previousBalance: number;
  remainingBalance: number;
}

export interface MaintenanceRequest {
  id: number;
  tenantId: number;
  tenantName: string;
  propertyId: number;
  propertyName: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Submitted' | 'In Progress' | 'Completed' | 'Cancelled';
  date: string;
}

export interface AuditLog {
  id: number;
  userId: number;
  userName: string;
  action: string;
  recordType: string;
  recordId: string;
  details: string;
  date: string;
}

export interface SystemSettings {
  systemName: string;
  currency: string;
  paymentGateway: 'Demo Gateway' | 'Mobile Money' | 'Bank/Card';
  apiKey: string;
  apiSecret: string;
  merchantId: string;
  contactEmail: string;
  dueDayDefault: number;
}

export interface AppNotification {
  id: number;
  title: string;
  desc: string;
  time: string;
  type: 'success' | 'info' | 'warning';
  read: boolean;
  actionTab?: string;
  paymentId?: number;
}


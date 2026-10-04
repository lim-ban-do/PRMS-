import { User, Property, Tenant, Lease, RentBalance, PaymentTransaction, MaintenanceRequest, AuditLog, SystemSettings } from './types';
import { getCurrentMonthDueDate, getPastFormattedDate, getCurrentFormattedDate } from './utils/dateUtils';

// Asset paths
import loginHeroImg from './assets/images/login_building_hero_1791047711212.jpg';
import sunsetImg from './assets/images/sunset_apartments_1791047722202.jpg';
import chalalaImg from './assets/images/chalala_house_1791047732120.jpg';
import riversideImg from './assets/images/riverside_flats_1791047742468.jpg';
import gardenImg from './assets/images/garden_villas_1791047755553.jpg';

export { loginHeroImg, sunsetImg, chalalaImg, riversideImg, gardenImg };

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@demo.com',
    role: 'admin',
    phone: '0977000001',
    status: 'active'
  },
  {
    id: 2,
    name: 'Sarah Mwamba',
    email: 'manager@demo.com',
    role: 'manager',
    phone: '0977000002',
    status: 'active'
  },
  {
    id: 3,
    name: 'John Mwale',
    email: 'john@demo.com',
    role: 'tenant',
    phone: '0978123456',
    status: 'active'
  },
  {
    id: 4,
    name: 'Mary Banda',
    email: 'mary@demo.com',
    role: 'tenant',
    phone: '0978765432',
    status: 'active'
  },
  {
    id: 5,
    name: 'Chris Tembo',
    email: 'chris@demo.com',
    role: 'tenant',
    phone: '0977654321',
    status: 'active'
  },
  {
    id: 6,
    name: 'Patricia Ndlovu',
    email: 'patricia@demo.com',
    role: 'tenant',
    phone: '0977112233',
    status: 'inactive'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 1,
    name: 'Sunset Apartments',
    address: 'Plot 123, Lusaka',
    city: 'Lusaka',
    province: 'Lusaka',
    propertyType: 'Apartment',
    monthlyRent: 4500,
    status: 'Occupied',
    description: 'Modern apartments with 2 bedrooms, close to town.',
    photo: sunsetImg
  },
  {
    id: 2,
    name: 'Chalala House',
    address: 'Chalala, Lusaka',
    city: 'Lusaka',
    province: 'Lusaka',
    propertyType: 'House',
    monthlyRent: 3500,
    status: 'Occupied',
    description: 'Spacious 3-bedroom standalone house in serene residential area.',
    photo: chalalaImg
  },
  {
    id: 3,
    name: 'Riverside Flats',
    address: 'Riverside, Lusaka',
    city: 'Lusaka',
    province: 'Lusaka',
    propertyType: 'Apartment',
    monthlyRent: 2800,
    status: 'Vacant',
    description: 'Quiet riverside complex with secure automated gate and borehole.',
    photo: riversideImg
  },
  {
    id: 4,
    name: 'Garden Villas',
    address: 'Meanwood, Lusaka',
    city: 'Lusaka',
    province: 'Lusaka',
    propertyType: 'House',
    monthlyRent: 5000,
    status: 'Maintenance',
    description: 'Executive luxury villa with paved driveway and private lawn.',
    photo: gardenImg
  }
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 1,
    userId: 3,
    name: 'John Mwale',
    email: 'john@demo.com',
    phone: '0978123456',
    idNumber: 'NRC-284918/11/1',
    propertyId: 2,
    propertyName: 'Chalala House',
    unit: '04',
    status: 'Active'
  },
  {
    id: 2,
    userId: 4,
    name: 'Mary Banda',
    email: 'mary@demo.com',
    phone: '0978765432',
    idNumber: 'NRC-391827/10/2',
    propertyId: 1,
    propertyName: 'Sunset Apartments',
    unit: '02',
    status: 'Active'
  },
  {
    id: 3,
    userId: 5,
    name: 'Chris Tembo',
    email: 'chris@demo.com',
    phone: '0977654321',
    idNumber: 'NRC-194829/11/1',
    propertyId: 3,
    propertyName: 'Riverside Flats',
    unit: '01',
    status: 'Active'
  },
  {
    id: 4,
    userId: 6,
    name: 'Patricia Ndlovu',
    email: 'patricia@demo.com',
    phone: '0977112233',
    idNumber: 'NRC-482910/10/1',
    propertyId: 4,
    propertyName: 'Garden Villas',
    unit: '03',
    status: 'Inactive'
  }
];

export const INITIAL_LEASES: Lease[] = [
  {
    id: 1,
    tenantId: 1,
    tenantName: 'John Mwale',
    propertyId: 2,
    propertyName: 'Chalala House',
    unit: '04',
    monthlyRent: 3500,
    deposit: 3500,
    startDate: '01 Jan 2026',
    endDate: '31 Dec 2026',
    status: 'Active'
  },
  {
    id: 2,
    tenantId: 2,
    tenantName: 'Mary Banda',
    propertyId: 1,
    propertyName: 'Sunset Apartments',
    unit: '02',
    monthlyRent: 4500,
    deposit: 4500,
    startDate: '15 Feb 2026',
    endDate: '14 Feb 2027',
    status: 'Active'
  },
  {
    id: 3,
    tenantId: 3,
    tenantName: 'Chris Tembo',
    propertyId: 3,
    propertyName: 'Riverside Flats',
    unit: '01',
    monthlyRent: 2800,
    deposit: 2800,
    startDate: '10 Mar 2026',
    endDate: '09 Mar 2027',
    status: 'Active'
  },
  {
    id: 4,
    tenantId: 4,
    tenantName: 'Patricia Ndlovu',
    propertyId: 4,
    propertyName: 'Garden Villas',
    unit: '03',
    monthlyRent: 5000,
    deposit: 5000,
    startDate: '01 Apr 2026',
    endDate: '31 Mar 2027',
    status: 'Active'
  }
];

export const INITIAL_BALANCES: Record<number, RentBalance> = {
  1: {
    tenantId: 1,
    monthlyRent: 3500,
    amountPaid: 2000,
    outstandingBalance: 1500,
    dueDate: getCurrentMonthDueDate()
  },
  2: {
    tenantId: 2,
    monthlyRent: 4500,
    amountPaid: 2000,
    outstandingBalance: 2500,
    dueDate: getCurrentMonthDueDate()
  },
  3: {
    tenantId: 3,
    monthlyRent: 2800,
    amountPaid: 0,
    outstandingBalance: 2800,
    dueDate: getCurrentMonthDueDate()
  },
  4: {
    tenantId: 4,
    monthlyRent: 5000,
    amountPaid: 5000,
    outstandingBalance: 0,
    dueDate: getCurrentMonthDueDate()
  }
};

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 1,
    transactionRef: 'PRMS-2026-000123',
    tenantId: 1,
    tenantName: 'John Mwale',
    propertyId: 2,
    propertyName: 'Chalala House',
    unit: 'Room 04',
    amount: 2000,
    method: 'Mobile Money',
    provider: 'MTN',
    gatewayRef: '254789K12245',
    status: 'Successful',
    date: getCurrentFormattedDate(),
    previousBalance: 3500,
    remainingBalance: 1500
  },
  {
    id: 2,
    transactionRef: 'PRMS-2026-000122',
    tenantId: 2,
    tenantName: 'Mary Banda',
    propertyId: 1,
    propertyName: 'Sunset Apartments',
    unit: '02',
    amount: 2000,
    method: 'Mobile Money',
    provider: 'MTN',
    gatewayRef: '254789K12242',
    status: 'Successful',
    date: getPastFormattedDate(1),
    previousBalance: 4500,
    remainingBalance: 2500
  },
  {
    id: 3,
    transactionRef: 'PRMS-2026-000121',
    tenantId: 4,
    tenantName: 'Patricia Ndlovu',
    propertyId: 4,
    propertyName: 'Garden Villas',
    unit: '03',
    amount: 5000,
    method: 'Mobile Money',
    provider: 'Airtel',
    gatewayRef: '254789K12241',
    status: 'Successful',
    date: getPastFormattedDate(3),
    previousBalance: 5000,
    remainingBalance: 0
  },
  {
    id: 4,
    transactionRef: 'PRMS-2026-000120',
    tenantId: 1,
    tenantName: 'John Mwale',
    propertyId: 2,
    propertyName: 'Chalala House',
    unit: 'Room 04',
    amount: 3500,
    method: 'Mobile Money',
    provider: 'MTN',
    gatewayRef: '254789K12240',
    status: 'Successful',
    date: getPastFormattedDate(7),
    previousBalance: 3500,
    remainingBalance: 0
  }
];

export const INITIAL_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: 1,
    tenantId: 1,
    tenantName: 'John Mwale',
    propertyId: 2,
    propertyName: 'Chalala House',
    title: 'Leaking tap',
    description: 'Kitchen mixer tap is leaking around the base and dripping into cupboard.',
    priority: 'Medium',
    status: 'In Progress',
    date: getCurrentFormattedDate()
  },
  {
    id: 2,
    tenantId: 2,
    tenantName: 'Mary Banda',
    propertyId: 1,
    propertyName: 'Sunset Apartments',
    title: 'Power outage',
    description: 'Prepaid circuit breaker trips whenever the geyser heater switch is turned on.',
    priority: 'High',
    status: 'Submitted',
    date: getPastFormattedDate(2)
  },
  {
    id: 3,
    tenantId: 3,
    tenantName: 'Chris Tembo',
    propertyId: 3,
    propertyName: 'Riverside Flats',
    title: 'Broken window',
    description: 'Lounge sliding window latch is loose and glass pane cracked.',
    priority: 'Medium',
    status: 'Completed',
    date: getPastFormattedDate(5)
  },
  {
    id: 4,
    tenantId: 4,
    tenantName: 'Patricia Ndlovu',
    propertyId: 4,
    propertyName: 'Garden Villas',
    title: 'AC not working',
    description: 'Master bedroom split AC unit is blowing ambient air instead of cold.',
    priority: 'Low',
    status: 'Submitted',
    date: '20 Sep 2026'
  }
];

export const INITIAL_AUDIT: AuditLog[] = [
  {
    id: 1,
    userId: 1,
    userName: 'Admin',
    action: 'Admin created property',
    recordType: 'properties',
    recordId: '1',
    details: 'Added Sunset Apartments (Plot 123, Lusaka)',
    date: '01 Sep 2026 09:00'
  },
  {
    id: 2,
    userId: 2,
    userName: 'Sarah Mwamba',
    action: 'Manager added tenant',
    recordType: 'tenants',
    recordId: '1',
    details: 'Assigned John Mwale to Chalala House Room 04',
    date: '02 Sep 2026 11:20'
  },
  {
    id: 3,
    userId: 3,
    userName: 'John Mwale',
    action: 'Tenant made payment',
    recordType: 'payment_transactions',
    recordId: 'PRMS-2026-000123',
    details: 'Paid ZMW 2,000 via Mobile Money (MTN)',
    date: '28 Sep 2026 10:46'
  },
  {
    id: 4,
    userId: 2,
    userName: 'Sarah Mwamba',
    action: 'Manager updated maintenance',
    recordType: 'maintenance_requests',
    recordId: '1',
    details: 'Updated status to In Progress for Leaking tap',
    date: '28 Sep 2026 11:00'
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  systemName: 'PRMS — Property Rental Management System',
  currency: 'ZMW',
  paymentGateway: 'Demo Gateway',
  apiKey: 'demo_key_live_9482947192',
  apiSecret: 'demo_sec_9918237194827103',
  merchantId: 'MERCH_ZAM_884920',
  contactEmail: 'admin@prms.local',
  dueDayDefault: 5
};

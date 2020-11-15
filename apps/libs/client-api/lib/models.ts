export type DATA_TYPES = 'customers' | 'people' | 'sellers';

// tslint:disable-next-line: no-empty-interface
export interface CountryData {
  
}

export interface Person {
  id: number;
  name: string;
  email: string;
  gender: 'Male' | 'Female';
  country: string;
  birthdate: string;
  bio: string;
  language: string;
  lead: boolean;
  balance: number;
  settings: {
    background: string;
    timezone: string;
    emailFrequency: 'Daily' | 'Weekly' | 'Yearly' | 'Often' | 'Seldom' | 'Never';
    avatar: string;
  };
  lastLoginIp: string;
}

export interface Customer {
  id: number;
  name: string;
  country: string;
  jobTitle: string;
  accountId: string;
  accountType: string;
  currencyCode: string;
  primeAccount: boolean;
  balance: number;
  creditScore: number;
  monthlyBalance: number[];
}

export interface Seller {
  id: number;
  name: string;
  company: string;
  department: string;
  country: string;
  email: string;
  sales: number;
  rating: number;
  feedback: number;
  address: string;
}

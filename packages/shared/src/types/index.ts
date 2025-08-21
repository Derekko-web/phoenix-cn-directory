export interface User {
  id: string;
  email: string;
  locale: 'en' | 'zh';
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Business {
  id: string;
  slug: string;
  status: 'pending' | 'approved' | 'rejected';
  ownerUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessLocalized {
  businessId: string;
  lang: 'en' | 'zh';
  name: string;
  description: string;
  slugLocalized: string;
}

export interface BusinessContact {
  businessId: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface BusinessLocation {
  businessId: string;
  addressLines: string[];
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

export interface BusinessHours {
  businessId: string;
  dayOfWeek: number; // 0-6, Sunday = 0
  openTime?: string; // HH:mm format
  closeTime?: string; // HH:mm format
  is24h: boolean;
}

export interface Category {
  id: string;
  parentId?: string;
  key: string;
  icon?: string;
  nameEn: string;
  nameZh: string;
}

export interface BusinessCategory {
  businessId: string;
  categoryId: string;
}

export interface SearchParams {
  query?: string;
  lat?: number;
  lng?: number;
  radius?: number; // in miles
  category?: string;
  openNow?: boolean;
  locale: 'en' | 'zh';
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  businesses: Business[];
  total: number;
  took: number; // milliseconds
}

export type Locale = 'en' | 'zh';
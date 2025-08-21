import type { Category } from '@/lib/api';

export interface BusinessLocalizedSubmission {
  lang: 'en' | 'zh';
  name: string;
  description: string;
  slugLocalized: string;
}

export interface BusinessLocationSubmission {
  addressLines: string[];
  city: string;
  state: string;
  zip: string;
}

export interface BusinessContactSubmission {
  phone: string;
  email: string;
  website: string;
}

export interface BusinessHoursSubmission {
  dayOfWeek: number; // 0-6, Sunday = 0
  openTime: string;
  closeTime: string;
  is24h: boolean;
  isClosed: boolean;
}

export interface PhotoUpload {
  id: string; // Temporary ID for frontend
  file?: File;
  url?: string; // For uploaded photos
  preview?: string; // Object URL for preview
  caption: string;
  lang?: 'en' | 'zh';
  isUploading?: boolean;
  uploadProgress?: number;
  uploadError?: string;
}

export interface BusinessSubmissionData {
  // Basic Info
  localized: BusinessLocalizedSubmission[];
  categories: Category[];
  
  // Location
  location: BusinessLocationSubmission;
  
  // Contact
  contact: BusinessContactSubmission;
  
  // Hours
  hours: BusinessHoursSubmission[];
  
  // Photos
  photos: PhotoUpload[];
  
  // Metadata
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface StepValidation {
  isValid: boolean;
  errors: ValidationError[];
}

// Form step component props
export interface StepProps {
  data: BusinessSubmissionData;
  onUpdate: (updates: Partial<BusinessSubmissionData>) => void;
  locale: 'en' | 'zh';
}

// Utility types for individual steps
export type BasicInfoData = Pick<BusinessSubmissionData, 'localized' | 'categories'>;
export type LocationData = Pick<BusinessSubmissionData, 'location'>;
export type ContactData = Pick<BusinessSubmissionData, 'contact'>;
export type HoursData = Pick<BusinessSubmissionData, 'hours'>;
export type PhotosData = Pick<BusinessSubmissionData, 'photos'>;
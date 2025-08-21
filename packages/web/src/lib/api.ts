const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface BusinessApiResponse {
  businesses: Business[];
  total: number;
  limit: number;
  offset: number;
}

export interface Business {
  id: string;
  slug: string;
  status: 'pending' | 'approved' | 'rejected';
  ownerUserId?: string;
  createdAt: string;
  updatedAt: string;
  localized: BusinessLocalized[];
  contact?: BusinessContact;
  location?: BusinessLocation;
  hours?: BusinessHours[];
  categories: BusinessCategory[];
  photos?: Photo[];
  reviews?: Review[];
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
}

export interface BusinessHours {
  id: string;
  businessId: string;
  dayOfWeek: number;
  openTime?: string;
  closeTime?: string;
  is24h: boolean;
}

export interface BusinessCategory {
  businessId: string;
  categoryId: string;
  category: Category;
}

export interface Category {
  id: string;
  parentId?: string;
  key: string;
  icon?: string;
  nameEn: string;
  nameZh: string;
}

export interface Photo {
  id: string;
  businessId: string;
  url: string;
  caption?: string;
  lang?: string;
  status: string;
}

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  rating: number;
  title?: string;
  body?: string;
  lang: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
  };
}

export interface BusinessQueryParams {
  status?: 'pending' | 'approved' | 'rejected';
  category?: string;
  city?: string;
  state?: string;
  locale?: 'en' | 'zh';
  search?: string;
  limit?: number;
  offset?: number;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const businessApi = {
  // Get list of businesses
  async getBusinesses(params: BusinessQueryParams = {}): Promise<BusinessApiResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = `/v1/businesses${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiRequest<BusinessApiResponse>(endpoint);
  },

  // Get single business by slug
  async getBusiness(slug: string, locale: 'en' | 'zh' = 'en'): Promise<Business> {
    const endpoint = `/v1/businesses/${encodeURIComponent(slug)}?locale=${locale}`;
    return apiRequest<Business>(endpoint);
  },

  // Create new business
  async createBusiness(business: Omit<Business, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<Business> {
    return apiRequest<Business>('/v1/businesses', {
      method: 'POST',
      body: JSON.stringify(business),
    });
  },

  // Update business
  async updateBusiness(id: string, business: Partial<Business>): Promise<Business> {
    return apiRequest<Business>(`/v1/businesses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(business),
    });
  },

  // Delete business
  async deleteBusiness(id: string): Promise<void> {
    await apiRequest<void>(`/v1/businesses/${id}`, {
      method: 'DELETE',
    });
  },

  // Update business status
  async updateBusinessStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Business> {
    return apiRequest<Business>(`/v1/businesses/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

export const categoriesApi = {
  async getCategories(): Promise<Category[]> {
    return apiRequest<Category[]>('/v1/categories');
  },
};

export interface PhotoUploadResponse {
  id: string;
  url: string;
  storageKey: string;
  originalName: string;
  mimeType: string;
  size: number;
  businessId?: string;
  caption?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface MultiplePhotoUploadResponse {
  successful: PhotoUploadResponse[];
  errors: { index: number; error: string }[];
  totalUploaded: number;
  totalFailed: number;
}

export const photosApi = {
  // Upload single photo
  async uploadPhoto(
    file: File,
    businessId?: string,
    caption?: string
  ): Promise<PhotoUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (businessId) formData.append('businessId', businessId);
    if (caption) formData.append('caption', caption);

    const response = await fetch(`${API_BASE_URL}/v1/photos/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `Photo upload failed: ${response.status}`);
    }

    return await response.json();
  },

  // Upload multiple photos
  async uploadMultiplePhotos(
    files: File[],
    businessId?: string
  ): Promise<MultiplePhotoUploadResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (businessId) formData.append('businessId', businessId);

    const response = await fetch(`${API_BASE_URL}/v1/photos/upload-multiple`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `Photos upload failed: ${response.status}`);
    }

    return await response.json();
  },

  // Delete photo
  async deletePhoto(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/v1/photos/${id}`, {
      method: 'DELETE',
    });
  },
};
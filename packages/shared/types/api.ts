// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
}

// Pagination
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Filter params for tours
export interface TourFilterParams extends PaginationParams {
  status?: 'draft' | 'published' | 'archived';
  destinationId?: string;
  minPrice?: number;
  maxPrice?: number;
  durationMin?: number;
  durationMax?: number;
  search?: string;
}

// User roles
export type UserRole = 'admin' | 'manager';

// Tour status
export type TourStatus = 'draft' | 'published' | 'archived';

// Departure status
export type DepartureStatus = 'active' | 'sold_out' | 'cancelled';

// Inquiry status
export type InquiryStatus = 'new' | 'processing' | 'completed' | 'spam';

// Review status
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

// Include category
export type IncludeCategory = 'transport' | 'accommodation' | 'food' | 'sights' | 'services' | 'other';

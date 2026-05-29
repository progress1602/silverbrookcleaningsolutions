/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ServicePlan {
  id: string;
  name: string;
  tagline: string;
  price: number;
  features: string[];
  badge?: string;
  popular?: boolean;
  type: 'residential' | 'deep' | 'commercial';
}

export type PropertyType = 'house' | 'apartment' | 'office' | 'townhom';

export type CleaningType = 'standard' | 'deep' | 'move_out' | 'commercial';

export type ServiceFrequency = 'once' | 'weekly' | 'biweekly' | 'monthly';

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyType: string;
  squareFeet: number;
  beds: number;
  baths: number;
  cleaningType: CleaningType;
  frequency: ServiceFrequency;
  preferredDate: string;
  preferredTime: string;
  specialInstructions?: string;
  addOns: string[];
  estimatedPrice: number;
  status: 'pending' | 'confirmed';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  verified: boolean;
  image: string;
  serviceType: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'residential' | 'commercial' | 'detailed';
  image: string;
  description: string;
}

export interface SavedPlan {
  id: string;
  planId: string;
  planName: string;
  price: number;
  frequency: string;
  savedAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  serviceInterest: string;
  hasRequestedQuote: boolean;
  createdAt: string;
}

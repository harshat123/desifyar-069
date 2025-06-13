export type Category = 'groceries' | 'restaurants' | 'events' | 'markets' | 'sports';

export interface Flyer {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: Category;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  createdAt: string;
  expiresAt: string;
  views: number;
  reactions: number;
  userId: string;
  businessName: string; // Added business name field
  distance?: number; // Calculated field
  discount?: string; // Discount percentage or amount
  couponCode?: string; // General coupon code
  isTrending?: boolean; // Flag for trending flyers
  averageRating?: number; // Average rating from reviews
  reviewCount?: number; // Number of reviews
}

export interface User {
  id: string;
  name: string;
  email: string;
  isVendor: boolean;
  flyersPosted: number;
  isPremium: boolean;
  businessNames?: string[]; // Array of business names used by this user
  redeemedCoupons?: string[]; // Array of redeemed coupon IDs
  monthlyPostingCount?: number; // Number of postings in current month
  lastPostingMonth?: number; // Last month when user posted (to reset counter)
}

export interface RedemptionCode {
  id: string;
  flyerId: string;
  userId: string;
  code: string;
  isRedeemed: boolean;
  redeemedAt?: string;
}

export interface Review {
  id: string;
  flyerId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;
  helpful: number; // Number of users who found this review helpful
}
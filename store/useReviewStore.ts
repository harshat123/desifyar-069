import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Review } from '@/types';

interface ReviewState {
  reviews: Review[];
  addReview: (review: Review) => void;
  getReviewsByFlyerId: (flyerId: string) => Review[];
  getAverageRatingByFlyerId: (flyerId: string) => number;
  markReviewHelpful: (reviewId: string) => void;
  hasUserReviewed: (flyerId: string, userId: string) => boolean;
  updateFlyerWithReviews: (flyerId: string) => { averageRating: number, reviewCount: number };
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [],
      
      addReview: (review) => {
        // Check if user has already reviewed this flyer
        const hasReviewed = get().hasUserReviewed(review.flyerId, review.userId);
        
        if (hasReviewed) {
          // Update existing review
          set((state) => ({
            reviews: state.reviews.map(r => 
              r.flyerId === review.flyerId && r.userId === review.userId
                ? { ...r, ...review, id: r.id }
                : r
            )
          }));
        } else {
          // Add new review
          set((state) => ({
            reviews: [...state.reviews, review]
          }));
        }
      },
      
      getReviewsByFlyerId: (flyerId) => {
        return get().reviews
          .filter(review => review.flyerId === flyerId)
          .sort((a, b) => {
            // Sort by helpful count first, then by date
            if (b.helpful !== a.helpful) {
              return b.helpful - a.helpful;
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
      },
      
      getAverageRatingByFlyerId: (flyerId) => {
        const flyerReviews = get().reviews.filter(review => review.flyerId === flyerId);
        
        if (flyerReviews.length === 0) {
          return 0;
        }
        
        const totalRating = flyerReviews.reduce((sum, review) => sum + review.rating, 0);
        return parseFloat((totalRating / flyerReviews.length).toFixed(1));
      },
      
      markReviewHelpful: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map(review => 
            review.id === reviewId
              ? { ...review, helpful: review.helpful + 1 }
              : review
          )
        }));
      },
      
      hasUserReviewed: (flyerId, userId) => {
        return get().reviews.some(
          review => review.flyerId === flyerId && review.userId === userId
        );
      },
      
      updateFlyerWithReviews: (flyerId) => {
        const averageRating = get().getAverageRatingByFlyerId(flyerId);
        const reviewCount = get().getReviewsByFlyerId(flyerId).length;
        
        return {
          averageRating,
          reviewCount
        };
      },
    }),
    {
      name: 'review-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
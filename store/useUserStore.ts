import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';

interface UserState {
  user: User | null;
  flyersPosted: number;
  isPremium: boolean;
  businessNames: string[];
  monthlyPostingCount: number;
  lastPostingMonth: number;
  setUser: (user: User) => void;
  incrementFlyersPosted: () => void;
  setPremium: (isPremium: boolean) => void;
  addBusinessName: (businessName: string) => boolean;
  isBusinessNameUnique: (businessName: string) => boolean;
  getBusinessNames: () => string[];
  incrementMonthlyPostingCount: () => void;
  resetMonthlyPostingCountIfNeeded: () => void;
  getRemainingFreePostings: () => number;
  getPostingPrice: () => number;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      flyersPosted: 0,
      isPremium: false,
      businessNames: [],
      monthlyPostingCount: 0,
      lastPostingMonth: new Date().getMonth(),
      
      setUser: (user) => set({ user }),
      
      incrementFlyersPosted: () => 
        set((state) => ({ flyersPosted: state.flyersPosted + 1 })),
      
      setPremium: (isPremium) => set({ isPremium }),
      
      addBusinessName: (businessName) => {
        const state = get();
        const normalizedName = businessName.toLowerCase().trim();
        
        // Check if business name is already used
        if (state.businessNames.includes(normalizedName)) {
          return false;
        }
        
        // Add business name to the list
        set((state) => ({
          businessNames: [...state.businessNames, normalizedName]
        }));
        return true;
      },
      
      isBusinessNameUnique: (businessName) => {
        const state = get();
        const normalizedName = businessName.toLowerCase().trim();
        
        // Check if this business name is used by any user
        // In a real app, this would query a database
        const allBusinessNames = [
          ...state.businessNames,
          // Mock some existing business names in the system
          'patel brothers', 'taj mahal restaurant', 'india bazaar', 
          'bombay spice', 'delhi palace', 'krishna groceries'
        ];
        
        return !allBusinessNames.includes(normalizedName);
      },
      
      getBusinessNames: () => {
        return get().businessNames;
      },
      
      incrementMonthlyPostingCount: () => {
        set((state) => ({
          monthlyPostingCount: state.monthlyPostingCount + 1
        }));
      },
      
      resetMonthlyPostingCountIfNeeded: () => {
        const currentMonth = new Date().getMonth();
        const state = get();
        
        if (state.lastPostingMonth !== currentMonth) {
          set({
            monthlyPostingCount: 0,
            lastPostingMonth: currentMonth
          });
        }
      },
      
      getRemainingFreePostings: () => {
        const state = get();
        state.resetMonthlyPostingCountIfNeeded();
        
        if (state.isPremium) {
          return Infinity; // Premium users have unlimited postings
        }
        
        return Math.max(0, 5 - state.monthlyPostingCount);
      },
      
      getPostingPrice: () => {
        const state = get();
        state.resetMonthlyPostingCountIfNeeded();
        
        if (state.isPremium) {
          return 0; // Premium users post for free
        }
        
        if (state.monthlyPostingCount < 5) {
          return 0; // First 5 postings are free
        }
        
        return 5.99; // Price per posting after free limit
      },
      
      logout: () => set({ 
        user: null, 
        flyersPosted: 0, 
        isPremium: false,
        businessNames: [],
        monthlyPostingCount: 0
      }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
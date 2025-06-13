import { create } from 'zustand';
import { Category } from '@/types';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  selectedCategory: Category | null;
  setLocation: (latitude: number, longitude: number, address?: string) => void;
  setSelectedCategory: (category: Category | null) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  address: null,
  selectedCategory: null,
  setLocation: (latitude, longitude, address = null) => 
    set({ latitude, longitude, address }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
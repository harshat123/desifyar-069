import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { RedemptionCode } from '@/types';

interface RedemptionState {
  redemptionCodes: RedemptionCode[];
  generateCode: (flyerId: string, userId: string) => RedemptionCode;
  redeemCode: (codeId: string) => void;
  getCodeByFlyerAndUser: (flyerId: string, userId: string) => RedemptionCode | undefined;
}

// Function to generate a random alphanumeric code
const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const useRedemptionStore = create<RedemptionState>()(
  persist(
    (set, get) => ({
      redemptionCodes: [],
      
      generateCode: (flyerId, userId) => {
        // Check if a code already exists for this flyer and user
        const existingCode = get().getCodeByFlyerAndUser(flyerId, userId);
        if (existingCode) {
          return existingCode;
        }
        
        // Generate a new unique code
        const newCode: RedemptionCode = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          flyerId,
          userId,
          code: generateRandomCode(),
          isRedeemed: false,
        };
        
        set((state) => ({
          redemptionCodes: [...state.redemptionCodes, newCode]
        }));
        
        return newCode;
      },
      
      redeemCode: (codeId) => {
        set((state) => ({
          redemptionCodes: state.redemptionCodes.map(code => 
            code.id === codeId 
              ? { 
                  ...code, 
                  isRedeemed: true, 
                  redeemedAt: new Date().toISOString() 
                } 
              : code
          )
        }));
      },
      
      getCodeByFlyerAndUser: (flyerId, userId) => {
        return get().redemptionCodes.find(
          code => code.flyerId === flyerId && code.userId === userId
        );
      },
    }),
    {
      name: 'redemption-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
import { z } from 'zod';
import { protectedProcedure } from '@/backend/trpc/trpc';

// Define the schema for creating a flyer
const createFlyerSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(['groceries', 'restaurants', 'events', 'markets', 'sports']),
  imageUrl: z.string().url("Invalid image URL"),
  location: z.object({
    address: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
  expiresAt: z.string(),
  discount: z.string().optional(),
  couponCode: z.string().optional(),
});

export const createFlyerProcedure = protectedProcedure
  .input(createFlyerSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      // In a real app, this would save to a database
      // For now, we'll just return a mock response
      
      const newFlyer = {
        id: `flyer-${Date.now()}`,
        ...input,
        createdAt: new Date().toISOString(),
        views: 0,
        reactions: 0,
        userId: ctx.user?.id || 'anonymous',
        isTrending: false,
        averageRating: 0,
        reviewCount: 0,
      };
      
      return {
        success: true,
        flyer: newFlyer,
        message: "Flyer created successfully"
      };
    } catch (error) {
      console.error("Error creating flyer:", error);
      throw new Error("Failed to create flyer");
    }
  });
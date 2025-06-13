import React from 'react';
import { Stack } from 'expo-router';
import { TRPCProvider } from '@/lib/trpc';

export default function RootLayout() {
  return (
    <TRPCProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="flyer/[id]" options={{ title: 'Flyer Details' }} />
        <Stack.Screen name="create-flyer" options={{ title: 'Create Flyer' }} />
        <Stack.Screen name="subscription" options={{ title: 'Subscription' }} />
        <Stack.Screen name="payment-history" options={{ title: 'Payment History' }} />
        <Stack.Screen name="redeem-coupon" options={{ title: 'Redeem Coupon' }} />
        <Stack.Screen name="map" options={{ title: 'Map View' }} />
      </Stack>
    </TRPCProvider>
  );
}
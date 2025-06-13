import React from 'react';
import { Stack } from 'expo-router';
import { TRPCProvider } from '@/lib/trpc';

export default function RootLayout() {
  return (
    <TRPCProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </TRPCProvider>
  );
}
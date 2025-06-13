import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { colors } from "@/constants/colors";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: Platform.OS === 'ios' ? 'default' : 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="flyer/[id]" 
        options={{ 
          title: "Flyer Details",
          presentation: Platform.OS === 'ios' ? 'card' : 'transparentModal',
        }} 
      />
      <Stack.Screen 
        name="create-flyer" 
        options={{ 
          title: "Create Flyer",
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="subscription" 
        options={{ 
          title: "Premium Subscription",
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="redeem-coupon" 
        options={{ 
          title: "Redeem Coupon",
          presentation: 'modal',
        }} 
      />
    </Stack>
  );
}
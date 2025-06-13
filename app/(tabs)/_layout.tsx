import React from "react";
import { Tabs } from "expo-router";
import { colors } from "@/constants/colors";
import { Home, Search, User, Bell, MapPin } from "lucide-react";
import { Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontWeight: '700',
          color: colors.text,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <View style={styles.logoContainer}>
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1541873676-a18131494184?w=48&h=48&fit=crop&q=80" }}
                  style={styles.logoImage}
                />
                <Text style={styles.logoText}>Desi<Text style={styles.logoHighlight}>Fyar</Text></Text>
              </View>
              <View style={styles.taglineContainer}>
                <Text style={styles.tagline}>Indian Stores & Offers</Text>
              </View>
            </View>
          ),
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => <MapPin size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <Search size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => <Bell size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 28,
    height: 28,
    borderRadius: 8,
    marginRight: 6,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  logoHighlight: {
    color: colors.primary,
  },
  taglineContainer: {
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  tagline: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  }
});
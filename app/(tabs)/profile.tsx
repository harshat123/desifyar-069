import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/useUserStore';
import { mockFlyers } from '@/mocks/flyers';
import { User, LogOut, CreditCard, Settings, FileText, Star, ChevronRight, Receipt, Bell, Shield } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const { user, flyersPosted, isPremium, setUser, incrementFlyersPosted } = useUserStore();
  
  // Mock user login for demo purposes
  useEffect(() => {
    if (!user) {
      setUser({
        id: 'user1',
        name: 'Raj Patel',
        email: 'raj.patel@example.com',
        isVendor: true,
        flyersPosted: 3,
        isPremium: false,
      });
    }
  }, []);
  
  // Filter flyers for this user
  const userFlyers = mockFlyers.filter(flyer => flyer.userId === 'user1');
  
  const handleCreateFlyer = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/create-flyer');
  };
  
  const handleSubscribe = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/subscription');
  };
  
  const handlePaymentHistory = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/payment-history');
  };
  
  const handleLogout = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    // In a real app, we would handle logout logic
    // For this demo, we'll just show an alert
    alert('Logged out successfully');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <User size={40} color={colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name || 'User'}</Text>
            <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
            
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Star size={12} color="#fff" />
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userFlyers.length}</Text>
            <Text style={styles.statLabel}>Flyers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {userFlyers.reduce((sum, flyer) => sum + flyer.views, 0)}
            </Text>
            <Text style={styles.statLabel}>Views</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {userFlyers.reduce((sum, flyer) => sum + flyer.reactions, 0)}
            </Text>
            <Text style={styles.statLabel}>Reactions</Text>
          </View>
        </View>
        
        {!isPremium && (
          <View style={styles.freeUsageInfo}>
            <Text style={styles.freeUsageText}>
              {5 - flyersPosted} free postings remaining
            </Text>
            <TouchableOpacity 
              style={styles.subscribeButton}
              onPress={handleSubscribe}
            >
              <Star size={16} color="#fff" />
              <Text style={styles.subscribeButtonText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <FileText size={20} color={colors.text} style={styles.menuIcon} />
            <Text style={styles.menuText}>My Flyers</Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handlePaymentHistory}
          >
            <Receipt size={20} color={colors.text} style={styles.menuIcon} />
            <Text style={styles.menuText}>Payment History</Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <CreditCard size={20} color={colors.text} style={styles.menuIcon} />
            <Text style={styles.menuText}>Payment Methods</Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Bell size={20} color={colors.text} style={styles.menuIcon} />
            <Text style={styles.menuText}>Notification Preferences</Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Shield size={20} color={colors.text} style={styles.menuIcon} />
            <Text style={styles.menuText}>Privacy & Security</Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Settings size={20} color={colors.text} style={styles.menuIcon} />
            <Text style={styles.menuText}>Settings</Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <LogOut size={20} color={colors.error} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: colors.error }]}>Log Out</Text>
            <ChevronRight size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateFlyer}
        >
          <Text style={styles.createButtonText}>Create New Flyer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  premiumText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  freeUsageInfo: {
    backgroundColor: `${colors.secondary}10`,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  freeUsageText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
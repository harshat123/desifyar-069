import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/useUserStore';
import { Check, X, CreditCard, Star, Shield, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit / Debit Card', icon: 'credit-card' },
  { id: 'upi', name: 'UPI Payment', icon: 'upi' },
  { id: 'paypal', name: 'PayPal', icon: 'paypal' },
  { id: 'apple', name: 'Apple Pay', icon: 'apple', platform: 'ios' },
  { id: 'google', name: 'Google Pay', icon: 'google', platform: 'android' },
];

export default function SubscriptionScreen() {
  const { setPremium } = useUserStore();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePlanSelect = (plan: 'monthly' | 'yearly') => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setSelectedPlan(plan);
  };
  
  const handlePaymentSelect = (paymentId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setSelectedPayment(paymentId);
  };
  
  const handleSubscribe = async () => {
    if (!selectedPayment) {
      Alert.alert("Payment Method Required", "Please select a payment method to continue.");
      return;
    }
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // In a real app, we would handle payment processing
      // For this demo, we'll just set the premium flag
      setPremium(true);
      
      Alert.alert(
        "Subscription Successful",
        "Thank you for subscribing to DesiFlexUSA Premium!",
        [{ text: "Continue", onPress: () => router.back() }]
      );
    }, 2000);
  };
  
  const getPaymentIcon = (iconName: string) => {
    switch (iconName) {
      case 'credit-card':
        return <CreditCard size={24} color={colors.text} />;
      case 'upi':
        return <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1657299170950-2a5f0d04e3d1' }} 
          style={styles.paymentIcon} 
        />;
      case 'paypal':
        return <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1583308148228-5c4d6a99d7ec' }} 
          style={styles.paymentIcon} 
        />;
      case 'apple':
        return <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956' }} 
          style={styles.paymentIcon} 
        />;
      case 'google':
        return <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd' }} 
          style={styles.paymentIcon} 
        />;
      default:
        return <CreditCard size={24} color={colors.text} />;
    }
  };
  
  const filteredPaymentMethods = PAYMENT_METHODS.filter(method => {
    if (!method.platform) return true;
    return method.platform === Platform.OS;
  });
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <Stack.Screen
        options={{
          title: 'Premium Subscription',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Star size={32} color={colors.primary} />
          </View>
          <Text style={styles.title}>Upgrade to Premium</Text>
          <Text style={styles.subtitle}>
            Post unlimited flyers and reach more customers in the Indian-American community
          </Text>
        </View>
        
        <View style={styles.planSelector}>
          <TouchableOpacity 
            style={[
              styles.planOption,
              selectedPlan === 'monthly' && styles.selectedPlan
            ]}
            onPress={() => handlePlanSelect('monthly')}
          >
            <Text style={[
              styles.planName,
              selectedPlan === 'monthly' && styles.selectedPlanText
            ]}>
              Pay Per Flyer
            </Text>
            <Text style={[
              styles.planPrice,
              selectedPlan === 'monthly' && styles.selectedPlanText
            ]}>
              $5.99
            </Text>
            <Text style={styles.planPeriod}>per flyer</Text>
            <Text style={styles.planLimit}>5 free flyers per month</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.planOption,
              selectedPlan === 'yearly' && styles.selectedPlan
            ]}
            onPress={() => handlePlanSelect('yearly')}
          >
            <View style={styles.saveBadge}>
              <Text style={styles.saveText}>Save 20%</Text>
            </View>
            <Text style={[
              styles.planName,
              selectedPlan === 'yearly' && styles.selectedPlanText
            ]}>
              Yearly
            </Text>
            <Text style={[
              styles.planPrice,
              selectedPlan === 'yearly' && styles.selectedPlanText
            ]}>
              $49.99
            </Text>
            <Text style={styles.planPeriod}>unlimited flyers</Text>
            <Text style={styles.planLimit}>No posting limits</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Premium Benefits</Text>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors.success} style={styles.featureIcon} />
            <Text style={styles.featureText}>
              {selectedPlan === 'monthly' ? 'Pay per flyer after 5 free monthly postings' : 'Unlimited flyer postings'}
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors.success} style={styles.featureIcon} />
            <Text style={styles.featureText}>Priority placement in search results</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors.success} style={styles.featureIcon} />
            <Text style={styles.featureText}>Detailed analytics and insights</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors.success} style={styles.featureIcon} />
            <Text style={styles.featureText}>Extended expiry dates (30 days)</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Check size={20} color={colors.success} style={styles.featureIcon} />
            <Text style={styles.featureText}>Custom redemption codes</Text>
          </View>
          
          {selectedPlan === 'yearly' && (
            <View style={styles.featureItem}>
              <Check size={20} color={colors.success} style={styles.featureIcon} />
              <Text style={styles.featureText}>Email marketing to local customers</Text>
            </View>
          )}
        </View>
        
        <View style={styles.paymentMethodsContainer}>
          <Text style={styles.paymentMethodsTitle}>Payment Method</Text>
          
          {filteredPaymentMethods.map((method) => (
            <TouchableOpacity 
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedPayment === method.id && styles.selectedPaymentMethod
              ]}
              onPress={() => handlePaymentSelect(method.id)}
            >
              {getPaymentIcon(method.icon)}
              <Text style={styles.paymentText}>{method.name}</Text>
              {selectedPayment === method.id && (
                <Check size={20} color={colors.primary} style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.securityNote}>
          <Shield size={16} color={colors.textSecondary} />
          <Text style={styles.securityText}>
            Your payment information is secure and encrypted
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.subscribeButton,
            (!selectedPayment || isProcessing) && styles.disabledButton
          ]}
          onPress={handleSubscribe}
          disabled={!selectedPayment || isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.subscribeButtonText}>
                {selectedPlan === 'monthly' ? 'Pay $5.99 per Flyer' : 'Subscribe for $49.99/year'}
              </Text>
              <ArrowRight size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
        
        <Text style={styles.termsText}>
          By subscribing, you agree to our Terms of Service and Privacy Policy.
          You can cancel your subscription at any time.
        </Text>
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
    paddingBottom: 32,
  },
  closeButton: {
    padding: 8,
    marginRight: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  planSelector: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  planOption: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlan: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  planPeriod: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  planLimit: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  selectedPlanText: {
    color: colors.primary,
  },
  saveBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  saveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  featuresContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  paymentMethodsContainer: {
    marginBottom: 24,
  },
  paymentMethodsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPaymentMethod: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  paymentIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  paymentText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  checkIcon: {
    marginLeft: 8,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  securityText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  subscribeButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
    opacity: 0.7,
  },
  subscribeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  termsText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
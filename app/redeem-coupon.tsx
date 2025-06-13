import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Share, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/useUserStore';
import { useRedemptionStore } from '@/store/useRedemptionStore';
import { mockFlyers } from '@/mocks/flyers';
import { Flyer } from '@/types';
import { Ticket, Copy, Share2, CheckCircle, X, MapPin, Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function RedeemCouponScreen() {
  const { flyerId } = useLocalSearchParams<{ flyerId: string }>();
  const { user } = useUserStore();
  const { generateCode, getCodeByFlyerAndUser, redeemCode } = useRedemptionStore();
  
  const [flyer, setFlyer] = useState<Flyer | null>(null);
  const [redemptionCode, setRedemptionCode] = useState<string | null>(null);
  const [isRedeemed, setIsRedeemed] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  
  useEffect(() => {
    if (flyerId) {
      const foundFlyer = mockFlyers.find(f => f.id === flyerId);
      if (foundFlyer) {
        setFlyer(foundFlyer);
      }
    }
  }, [flyerId]);
  
  useEffect(() => {
    if (flyer && user) {
      // Check if user already has a code for this flyer
      const existingCode = getCodeByFlyerAndUser(flyer.id, user.id);
      
      if (existingCode) {
        setRedemptionCode(existingCode.code);
        setIsRedeemed(existingCode.isRedeemed);
      } else {
        // Generate a new code
        const newCode = generateCode(flyer.id, user.id);
        setRedemptionCode(newCode.code);
        setIsRedeemed(newCode.isRedeemed);
      }
    }
  }, [flyer, user]);
  
  useEffect(() => {
    // Start pulsing animation for the code
    if (redemptionCode && !isRedeemed) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [redemptionCode, isRedeemed]);
  
  const handleCopyCode = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    Alert.alert(
      "Code Copied",
      "Your redemption code has been copied to clipboard",
      [{ text: "OK" }]
    );
  };
  
  const handleShareCode = async () => {
    if (!flyer || !redemptionCode) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    try {
      await Share.share({
        message: `Check out this deal at ${flyer.title}! Use my code ${redemptionCode} for ${flyer.discount}. Download DesiFlexUSA to get your own discounts on Indian stores and restaurants!`,
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleMarkRedeemed = () => {
    if (!flyer || !user) return;
    
    const existingCode = getCodeByFlyerAndUser(flyer.id, user.id);
    if (existingCode) {
      redeemCode(existingCode.id);
      setIsRedeemed(true);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      Alert.alert(
        "Coupon Redeemed",
        "Your coupon has been marked as redeemed",
        [{ text: "OK" }]
      );
    }
  };
  
  if (!flyer || !redemptionCode) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <Stack.Screen
        options={{
          title: "Your Coupon",
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
      
      <View style={styles.content}>
        <View style={styles.couponCard}>
          <View style={styles.couponHeader}>
            <Ticket size={24} color={colors.primary} />
            <Text style={styles.couponTitle}>{flyer.title}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.couponDetails}>
            <Text style={styles.discountLabel}>Discount:</Text>
            <Text style={styles.discountValue}>{flyer.discount}</Text>
            
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <MapPin size={16} color={colors.textSecondary} />
                <Text style={styles.metaText}>{flyer.location.address}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <Calendar size={16} color={colors.textSecondary} />
                <Text style={styles.metaText}>
                  Valid until {formatDate(flyer.expiresAt)}
                </Text>
              </View>
            </View>
            
            <Text style={styles.codeLabel}>Your Unique Code:</Text>
            <Animated.View 
              style={[
                styles.codeContainer,
                { transform: [{ scale: pulseAnim }] },
                isRedeemed && styles.redeemedCodeContainer
              ]}
            >
              <Text style={[
                styles.codeValue,
                isRedeemed && styles.redeemedCodeValue
              ]}>
                {redemptionCode}
              </Text>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
                <Copy size={20} color={isRedeemed ? colors.textSecondary : colors.primary} />
              </TouchableOpacity>
            </Animated.View>
            
            {isRedeemed && (
              <View style={styles.redeemedBadge}>
                <CheckCircle size={16} color="#fff" />
                <Text style={styles.redeemedText}>Redeemed</Text>
              </View>
            )}
            
            <Text style={styles.instructions}>
              Show this code to the cashier at {flyer.title} to redeem your discount.
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleShareCode}
            >
              <Share2 size={20} color={colors.primary} />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.redeemButton,
                isRedeemed && styles.redeemedButton
              ]}
              onPress={handleMarkRedeemed}
              disabled={isRedeemed}
            >
              <CheckCircle size={20} color={isRedeemed ? colors.textSecondary : '#fff'} />
              <Text style={[
                styles.redeemButtonText,
                isRedeemed && styles.redeemedButtonText
              ]}>
                {isRedeemed ? 'Redeemed' : 'Mark as Redeemed'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>How to use your coupon:</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>1.</Text>
            <Text style={styles.infoText}>Show this code to the cashier at the store</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>2.</Text>
            <Text style={styles.infoText}>The cashier will verify and apply your discount</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>3.</Text>
            <Text style={styles.infoText}>Mark as redeemed after successful use</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>4.</Text>
            <Text style={styles.infoText}>Share with friends to support Indian businesses in the USA</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    padding: 8,
    marginRight: 8,
  },
  content: {
    padding: 16,
  },
  couponCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  couponTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  couponDetails: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  discountLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  discountValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 16,
  },
  metaContainer: {
    width: '100%',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  codeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}10`,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  redeemedCodeContainer: {
    backgroundColor: `${colors.textSecondary}10`,
    borderColor: colors.textSecondary,
  },
  codeValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 4,
    marginRight: 16,
  },
  redeemedCodeValue: {
    color: colors.textSecondary,
  },
  copyButton: {
    padding: 4,
  },
  redeemedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  redeemedText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  instructions: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    flex: 1,
    marginRight: 8,
  },
  shareButtonText: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    flex: 1,
    marginLeft: 8,
  },
  redeemedButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  redeemButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  redeemedButtonText: {
    color: colors.textSecondary,
  },
  infoContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    width: 24,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
});
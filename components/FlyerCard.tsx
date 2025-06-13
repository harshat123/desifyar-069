import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Flyer } from '@/types';
import { colors } from '@/constants/colors';
import { Eye, Heart, Tag, Clock, MapPin, TrendingUp, Star } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface FlyerCardProps {
  flyer: Flyer;
  onPress: (flyer: Flyer) => void;
}

export default function FlyerCard({ flyer, onPress }: FlyerCardProps) {
  const daysLeft = Math.ceil(
    (new Date(flyer.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  
  const categoryColor = colors.categories[flyer.category];
  
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress(flyer);
  };
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: flyer.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      
      <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20`, borderColor: categoryColor }]}>
        <Text style={[styles.categoryText, { color: categoryColor }]}>
          {flyer.category}
        </Text>
      </View>
      
      {flyer.discount && (
        <View style={styles.discountBadge}>
          <Tag size={14} color="#fff" />
          <Text style={styles.discountText}>{flyer.discount}</Text>
        </View>
      )}
      
      {flyer.isTrending && (
        <View style={styles.trendingBadge}>
          <TrendingUp size={14} color="#fff" />
          <Text style={styles.trendingText}>Trending</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{flyer.title}</Text>
        <Text style={styles.businessName} numberOfLines={1}>{flyer.businessName}</Text>
        <Text style={styles.description} numberOfLines={2}>{flyer.description}</Text>
        
        <View style={styles.metaContainer}>
          {flyer.distance && (
            <View style={styles.metaItem}>
              <MapPin size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>{flyer.distance} km</Text>
            </View>
          )}
          
          <View style={styles.metaItem}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              {daysLeft > 0 ? `${daysLeft} days left` : 'Expires today'}
            </Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.footer}>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Eye size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>{flyer.views}</Text>
            </View>
            <View style={styles.stat}>
              <Heart size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>{flyer.reactions}</Text>
            </View>
            
            {flyer.averageRating && flyer.averageRating > 0 && (
              <View style={styles.ratingContainer}>
                <Star size={16} color={colors.secondary} fill={colors.secondary} />
                <Text style={styles.ratingText}>{flyer.averageRating}</Text>
                {flyer.reviewCount && (
                  <Text style={styles.reviewCountText}>({flyer.reviewCount})</Text>
                )}
              </View>
            )}
          </View>
          
          {flyer.couponCode && (
            <View style={styles.couponIndicator}>
              <Text style={styles.couponText}>Coupon Available</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: colors.card,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.secondary,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  trendingBadge: {
    position: 'absolute',
    top: 56,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.accent,
  },
  trendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  businessName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
    marginLeft: 4,
  },
  reviewCountText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  couponIndicator: {
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  couponText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
});
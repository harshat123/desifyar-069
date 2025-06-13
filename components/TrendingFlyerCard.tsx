import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Flyer } from '@/types';
import { colors } from '@/constants/colors';
import { Star, MapPin } from 'lucide-react-native';

interface TrendingFlyerCardProps {
  flyer: Flyer;
  onPress: (flyer: Flyer) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.32 - 16;

export default function TrendingFlyerCard({ flyer, onPress }: TrendingFlyerCardProps) {
  const handlePress = () => {
    onPress(flyer);
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: flyer.imageUrl }}
        style={styles.image}
        contentFit="cover"
      />
      
      {flyer.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{flyer.discount}</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {flyer.title}
        </Text>
        
        <Text style={styles.businessName} numberOfLines={1}>
          {flyer.businessName}
        </Text>
        
        <View style={styles.locationContainer}>
          <MapPin size={12} color={colors.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {flyer.location.address 
              ? flyer.location.address.split(',')[0] 
              : 'Location N/A'}
          </Text>
        </View>
        
        {flyer.averageRating !== undefined && flyer.averageRating > 0 && (
          <View style={styles.ratingContainer}>
            <Star size={12} color={colors.secondary} fill={colors.secondary} />
            <Text style={styles.ratingText}>
              {flyer.averageRating?.toFixed(1) || '0'} ({flyer.reviewCount || 0})
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 12,
    backgroundColor: colors.card,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    padding: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  businessName: {
    fontSize: 10,
    color: colors.primary,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 9,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 9,
    color: colors.textSecondary,
    marginLeft: 2,
  },
});
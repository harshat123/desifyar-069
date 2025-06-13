import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { colors } from '@/constants/colors';
import { Category } from '@/types';
import { FileQuestion } from 'lucide-react-native';

interface EmptyStateProps {
  category: Category | null;
}

export default function EmptyState({ category }: EmptyStateProps) {
  const getMessage = () => {
    if (!category) {
      return 'Select a category to see store flyers in your area';
    }
    
    switch (category) {
      case 'groceries':
        return 'No grocery stores found in your area';
      case 'restaurants':
        return 'No restaurants found in your area';
      case 'events':
        return 'No cultural events found in your area';
      case 'markets':
        return 'No business markets found in your area';
      case 'sports':
        return 'No sports events found in your area';
      default:
        return `No flyers found in ${category} category in your area`;
    }
  };
  
  const getIllustration = () => {
    if (!category) {
      return <FileQuestion size={80} color={colors.textSecondary} />;
    }
    
    switch (category) {
      case 'groceries':
        return (
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=400&h=400&fit=crop' }}
            style={styles.illustration}
          />
        );
      case 'restaurants':
        return (
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?w=400&h=400&fit=crop' }}
            style={styles.illustration}
          />
        );
      case 'events':
        return (
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=400&fit=crop' }}
            style={styles.illustration}
          />
        );
      case 'markets':
        return (
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop' }}
            style={styles.illustration}
          />
        );
      case 'sports':
        return (
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&h=400&fit=crop' }}
            style={styles.illustration}
          />
        );
      default:
        return <FileQuestion size={80} color={colors.textSecondary} />;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        {getIllustration()}
      </View>
      <Text style={styles.message}>{getMessage()}</Text>
      <Text style={styles.subMessage}>
        Try selecting a different category or updating your location
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  illustrationContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: `${colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
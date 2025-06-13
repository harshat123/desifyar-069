import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, ImageBackground } from 'react-native';
import { Category } from '@/types';
import { colors } from '@/constants/colors';
import { ShoppingCart, Utensils, Calendar, Store, Trophy } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  isSelected: boolean;
}

const getCategoryIcon = (category: Category, color: string) => {
  switch (category) {
    case 'groceries':
      return <ShoppingCart size={24} color={color} />;
    case 'restaurants':
      return <Utensils size={24} color={color} />;
    case 'events':
      return <Calendar size={24} color={color} />;
    case 'markets':
      return <Store size={24} color={color} />;
    case 'sports':
      return <Trophy size={24} color={color} />;
    default:
      return null;
  }
};

const getCategoryTitle = (category: Category): string => {
  switch (category) {
    case 'groceries':
      return 'Groceries';
    case 'restaurants':
      return 'Restaurants';
    case 'events':
      return 'Cultural Events';
    case 'markets':
      return 'Bazaars';
    case 'sports':
      return 'Sports';
    default:
      return category;
  }
};

const getCategoryImage = (category: Category): string => {
  switch (category) {
    case 'groceries':
      return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop';
    case 'restaurants':
      return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop';
    case 'events':
      return 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=400&fit=crop';
    case 'markets':
      return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop';
    case 'sports':
      return 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=400&fit=crop';
    default:
      return '';
  }
};

export default function CategoryCard({ category, onPress, isSelected }: CategoryCardProps) {
  const categoryColor = colors.categories[category];
  const categoryImage = getCategoryImage(category);
  
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onPress(category);
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor: categoryColor },
        isSelected && { borderWidth: 2 }
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <ImageBackground
        source={{ uri: categoryImage }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <LinearGradient
          colors={[`${categoryColor}90`, `${categoryColor}CC`]}
          style={styles.gradient}
        />
        
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}90` }]}>
            {getCategoryIcon(category, '#FFFFFF')}
          </View>
          
          <Text style={styles.title}>
            {getCategoryTitle(category)}
          </Text>
        </View>
        
        {isSelected && (
          <View style={[styles.selectedIndicator, { backgroundColor: categoryColor }]} />
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 8,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyle: {
    borderRadius: 16,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
});
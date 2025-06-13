import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, FlatList, ScrollView, Text, Animated, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Category, Flyer } from '@/types';
import { colors } from '@/constants/colors';
import { useLocationStore } from '@/store/useLocationStore';
import { getFilteredFlyers, getTrendingFlyers } from '@/mocks/flyers';
import CategoryCard from '@/components/CategoryCard';
import FlyerCard from '@/components/FlyerCard';
import LocationBar from '@/components/LocationBar';
import CreateFlyerButton from '@/components/CreateFlyerButton';
import EmptyState from '@/components/EmptyState';
import TrendingFlyerCard from '@/components/TrendingFlyerCard';
import * as Haptics from 'expo-haptics';
import { Compass, MessageCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const categories: Category[] = ['groceries', 'restaurants', 'events', 'markets', 'sports'];

export default function DiscoverScreen() {
  const { latitude, longitude, selectedCategory, setSelectedCategory } = useLocationStore();
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [trendingFlyers, setTrendingFlyers] = useState<Flyer[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Get flyers based on selected category and location
    const filteredFlyers = getFilteredFlyers(selectedCategory, latitude, longitude);
    setFlyers(filteredFlyers);
    
    // Get trending flyers
    const trending = getTrendingFlyers();
    setTrendingFlyers(trending);
  }, [selectedCategory, latitude, longitude]);
  
  const handleCategoryPress = (category: Category) => {
    // Toggle category selection
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setSelectedCategory(selectedCategory === category ? null : category);
  };
  
  const handleFlyerPress = (flyer: Flyer) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/flyer/${flyer.id}`);
  };
  
  const handleViewMap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/map');
  };
  
  const handleContactTeam = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // In a real app, this would navigate to a messaging screen
    router.push('/redeem-coupon'); // Temporary navigation to an existing screen
  };
  
  // Animation values
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [50, 0],
    extrapolate: 'clamp',
  });
  
  // Helper function to get category title
  const getCategoryTitle = (category: Category): string => {
    switch (category) {
      case 'groceries':
        return 'Groceries';
      case 'restaurants':
        return 'Restaurants';
      case 'events':
        return 'Events';
      case 'markets':
        return 'Bazaars';
      case 'sports':
        return 'Sports';
      default:
        return category;
    }
  };
  
  // Render a grid item for flyers
  const renderFlyerItem = ({ item }: { item: Flyer }) => (
    <View style={[
      styles.flyerGridItem,
      // For 3 items per row on larger screens
      width > 768 && { width: '32%' }
    ]}>
      <FlyerCard flyer={item} onPress={handleFlyerPress} />
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <LocationBar />
      
      <Animated.View style={[styles.welcomeContainer, { opacity: headerOpacity, height: headerHeight }]}>
        <Text style={styles.welcomeText}>
          Discover authentic Indian stores and offers
        </Text>
      </Animated.View>
      
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {categories.map((category) => (
            <CategoryCard
              key={category}
              category={category}
              onPress={handleCategoryPress}
              isSelected={selectedCategory === category}
            />
          ))}
        </ScrollView>
      </View>
      
      {flyers.length > 0 ? (
        <Animated.FlatList
          data={flyers}
          keyExtractor={(item) => item.id}
          renderItem={renderFlyerItem}
          numColumns={width > 768 ? 3 : 2}
          columnWrapperStyle={styles.flyerGridRow}
          contentContainerStyle={styles.flyersContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          ListHeaderComponent={
            <View style={styles.headerComponent}>
              {trendingFlyers.length > 0 && !selectedCategory && (
                <View style={styles.trendingSection}>
                  <Text style={styles.trendingSectionTitle}>Trending Now</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.trendingScrollContent}
                    decelerationRate="fast"
                    snapToInterval={width * 0.75 + 12}
                    snapToAlignment="start"
                  >
                    {trendingFlyers.slice(0, 6).map((flyer) => (
                      <View key={flyer.id} style={styles.trendingItem}>
                        <TrendingFlyerCard 
                          flyer={flyer} 
                          onPress={handleFlyerPress} 
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
              
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {selectedCategory 
                    ? getCategoryTitle(selectedCategory)
                    : 'All Offers'}
                </Text>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.mapViewButton}
                    onPress={handleViewMap}
                  >
                    <Compass size={16} color={colors.primary} />
                    <Text style={styles.mapViewText}>Map</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={handleContactTeam}
                  >
                    <MessageCircle size={16} color={colors.secondary} />
                    <Text style={styles.contactButtonText}>Message</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {latitude && longitude && (
                <Text style={styles.locationHint}>
                  Showing results near your location
                </Text>
              )}
              
              {selectedCategory === 'sports' && (
                <View style={styles.sportsHighlight}>
                  <View style={styles.sportsImageContainer}>
                    <View style={styles.sportsImageOverlay} />
                    <Text style={styles.sportsHighlightText}>Cricket, Badminton, Tennis & More</Text>
                  </View>
                  <View style={styles.sportsCategories}>
                    <TouchableOpacity style={styles.sportsCategoryButton}>
                      <Text style={styles.sportsCategoryText}>Cricket</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sportsCategoryButton}>
                      <Text style={styles.sportsCategoryText}>Badminton</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sportsCategoryButton}>
                      <Text style={styles.sportsCategoryText}>Tennis</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sportsCategoryButton}>
                      <Text style={styles.sportsCategoryText}>Volleyball</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          }
        />
      ) : (
        <EmptyState category={selectedCategory} />
      )}
      
      <CreateFlyerButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  welcomeContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    overflow: 'hidden',
  },
  welcomeText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoriesScrollContent: {
    paddingHorizontal: 8,
  },
  headerComponent: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 4, // Add padding to prevent text from touching the edge
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  mapViewText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.secondary}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  contactButtonText: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
    marginLeft: 4,
  },
  locationHint: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingHorizontal: 4, // Add padding to prevent text from touching the edge
  },
  flyersContainer: {
    padding: 16,
    paddingBottom: 100, // Extra padding for the create button
  },
  flyerGridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  flyerGridItem: {
    width: '48%',
  },
  trendingSection: {
    marginBottom: 24,
  },
  trendingSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 4, // Add padding to prevent text from touching the edge
  },
  trendingScrollContent: {
    paddingLeft: 4,
    paddingRight: 16,
  },
  trendingItem: {
    marginRight: 12,
    width: width * 0.75, // Fixed width for each trending item
    maxWidth: 320, // Maximum width on larger screens
  },
  sportsHighlight: {
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sportsImageContainer: {
    height: 120,
    backgroundColor: colors.categories.sports,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sportsImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sportsHighlightText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    zIndex: 1,
  },
  sportsCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  sportsCategoryButton: {
    backgroundColor: `${colors.categories.sports}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  sportsCategoryText: {
    color: colors.categories.sports,
    fontWeight: '600',
    fontSize: 12,
  },
});
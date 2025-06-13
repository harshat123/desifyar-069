import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { useLocationStore } from '@/store/useLocationStore';
import { mockFlyers } from '@/mocks/flyers';
import { Flyer, Category } from '@/types';
import { Image } from 'expo-image';
import { MapPin, Tag, Filter, X, Star } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const { latitude, longitude, selectedCategory, setSelectedCategory } = useLocationStore();
  const [nearbyFlyers, setNearbyFlyers] = useState<Flyer[]>([]);
  const [selectedFlyer, setSelectedFlyer] = useState<Flyer | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sportSubcategory, setSportSubcategory] = useState<string | null>(null);
  
  const categories: Category[] = ['groceries', 'restaurants', 'events', 'markets', 'sports'];
  const sportSubcategories = ['Cricket', 'Badminton', 'Tennis', 'Volleyball', 'Pickleball'];
  
  useEffect(() => {
    // Filter flyers based on location and category
    let filtered = [...mockFlyers];
    
    if (selectedCategory) {
      filtered = filtered.filter(flyer => flyer.category === selectedCategory);
      
      // Further filter by sport subcategory if applicable
      if (selectedCategory === 'sports' && sportSubcategory) {
        filtered = filtered.filter(flyer => 
          flyer.title.toLowerCase().includes(sportSubcategory.toLowerCase()) || 
          flyer.description.toLowerCase().includes(sportSubcategory.toLowerCase())
        );
      }
    }
    
    // Calculate distance if location is available
    if (latitude && longitude) {
      filtered = filtered.map(flyer => {
        const distance = calculateDistance(
          latitude,
          longitude,
          flyer.location.latitude,
          flyer.location.longitude
        );
        return { ...flyer, distance };
      });
      
      // Sort by distance
      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    
    setNearbyFlyers(filtered);
  }, [latitude, longitude, selectedCategory, sportSubcategory]);
  
  const handleMarkerPress = (flyer: Flyer) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedFlyer(flyer);
  };
  
  const handleFlyerPress = (flyer: Flyer) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push(`/flyer/${flyer.id}`);
  };
  
  const handleCategoryPress = (category: Category) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setSelectedCategory(selectedCategory === category ? null : category);
    setSportSubcategory(null);
    setShowFilters(false);
  };
  
  const handleSportSubcategoryPress = (subcategory: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setSportSubcategory(sportSubcategory === subcategory ? null : subcategory);
  };
  
  const toggleFilters = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowFilters(!showFilters);
  };
  
  // Haversine formula to calculate distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return parseFloat(d.toFixed(1));
  };
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };
  
  const getCategoryColor = (category: Category): string => {
    return colors.categories[category];
  };
  
  // Helper function to get category title
  const getCategoryTitle = (category: Category): string => {
    switch (category) {
      case 'groceries':
        return 'Groceries';
      case 'restaurants':
        return 'Restaurants';
      case 'events':
        return 'Cultural Events';
      case 'markets':
        return 'Business Markets';
      case 'sports':
        return sportSubcategory || 'Sports';
      default:
        return category;
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <View style={styles.mapContainer}>
        {/* This would be a real map in a production app */}
        <View style={styles.mockMap}>
          <Text style={styles.mockMapText}>Map View</Text>
          <Text style={styles.mockMapSubtext}>
            {latitude && longitude 
              ? 'Showing flyers near your location' 
              : 'Set your location to see nearby flyers'}
          </Text>
          
          {/* Mock map markers */}
          {nearbyFlyers.map((flyer) => (
            <TouchableOpacity
              key={flyer.id}
              style={[
                styles.mapMarker,
                { 
                  left: `${30 + Math.random() * 40}%`, 
                  top: `${20 + Math.random() * 50}%`,
                  backgroundColor: getCategoryColor(flyer.category)
                },
                selectedFlyer?.id === flyer.id && styles.selectedMapMarker
              ]}
              onPress={() => handleMarkerPress(flyer)}
            >
              <MapPin size={16} color="#fff" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={toggleFilters}
      >
        <Filter size={20} color={colors.primary} />
        <Text style={styles.filterButtonText}>
          {selectedCategory ? getCategoryTitle(selectedCategory) : 'All Categories'}
        </Text>
      </TouchableOpacity>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filter by Category</Text>
            <TouchableOpacity onPress={toggleFilters}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  { borderColor: getCategoryColor(category) },
                  selectedCategory === category && { 
                    backgroundColor: `${getCategoryColor(category)}20` 
                  }
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <Text 
                  style={[
                    styles.categoryButtonText,
                    { color: selectedCategory === category 
                        ? getCategoryColor(category) 
                        : colors.text 
                    }
                  ]}
                >
                  {getCategoryTitle(category)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {selectedCategory === 'sports' && (
            <View style={styles.subcategoriesContainer}>
              <Text style={styles.subcategoriesTitle}>Sports Type</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.subcategoriesScrollContent}
              >
                {sportSubcategories.map((subcategory) => (
                  <TouchableOpacity
                    key={subcategory}
                    style={[
                      styles.subcategoryButton,
                      sportSubcategory === subcategory && { 
                        backgroundColor: `${colors.categories.sports}40` 
                      }
                    ]}
                    onPress={() => handleSportSubcategoryPress(subcategory)}
                  >
                    <Text 
                      style={[
                        styles.subcategoryButtonText,
                        sportSubcategory === subcategory && { 
                          color: colors.categories.sports,
                          fontWeight: '600'
                        }
                      ]}
                    >
                      {subcategory}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}
      
      {selectedFlyer ? (
        <TouchableOpacity 
          style={styles.selectedFlyerCard}
          onPress={() => handleFlyerPress(selectedFlyer)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: selectedFlyer.imageUrl }}
            style={styles.flyerImage}
            contentFit="cover"
          />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.flyerGradient}
          />
          
          <View style={[
            styles.flyerCategoryBadge, 
            { backgroundColor: getCategoryColor(selectedFlyer.category) }
          ]}>
            <Text style={styles.flyerCategoryText}>
              {selectedFlyer.category}
            </Text>
          </View>
          
          {selectedFlyer.discount && (
            <View style={styles.flyerDiscountBadge}>
              <Tag size={14} color="#fff" />
              <Text style={styles.flyerDiscountText}>{selectedFlyer.discount}</Text>
            </View>
          )}
          
          <View style={styles.flyerContent}>
            <Text style={styles.flyerTitle}>{selectedFlyer.title}</Text>
            <Text style={styles.flyerBusinessName}>{selectedFlyer.businessName}</Text>
            
            {selectedFlyer.averageRating !== undefined && selectedFlyer.averageRating > 0 && (
              <View style={styles.ratingContainer}>
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>{selectedFlyer.averageRating}</Text>
                {selectedFlyer.reviewCount && (
                  <Text style={styles.reviewCountText}>({selectedFlyer.reviewCount})</Text>
                )}
              </View>
            )}
            
            <View style={styles.flyerLocation}>
              <MapPin size={14} color="#fff" />
              <Text style={styles.flyerLocationText} numberOfLines={1}>
                {selectedFlyer.location.address || 'Location N/A'}
                {selectedFlyer.distance && ` (${selectedFlyer.distance} km away)`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.nearbyFlyersContainer}>
          <Text style={styles.nearbyFlyersTitle}>
            {nearbyFlyers.length > 0 
              ? 'Nearby Flyers' 
              : 'No flyers found in this area'}
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.nearbyFlyersScrollContent}
          >
            {nearbyFlyers.map((flyer) => (
              <TouchableOpacity
                key={flyer.id}
                style={styles.nearbyFlyerCard}
                onPress={() => handleMarkerPress(flyer)}
              >
                <Image
                  source={{ uri: flyer.imageUrl }}
                  style={styles.nearbyFlyerImage}
                  contentFit="cover"
                />
                
                <View style={styles.nearbyFlyerContent}>
                  <Text style={styles.nearbyFlyerTitle} numberOfLines={1}>
                    {flyer.title}
                  </Text>
                  
                  <Text style={styles.nearbyFlyerBusinessName} numberOfLines={1}>
                    {flyer.businessName}
                  </Text>
                  
                  <View style={styles.nearbyFlyerMeta}>
                    <View style={[
                      styles.nearbyFlyerCategory,
                      { backgroundColor: `${getCategoryColor(flyer.category)}20` }
                    ]}>
                      <Text style={[
                        styles.nearbyFlyerCategoryText,
                        { color: getCategoryColor(flyer.category) }
                      ]}>
                        {flyer.category}
                      </Text>
                    </View>
                    
                    {flyer.distance && (
                      <Text style={styles.nearbyFlyerDistance}>
                        {flyer.distance} km
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mockMap: {
    flex: 1,
    backgroundColor: '#E8EEF4',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mockMapText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  mockMapSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  mapMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedMapMarker: {
    transform: [{ scale: 1.2 }],
    zIndex: 10,
  },
  filterButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  filtersContainer: {
    position: 'absolute',
    top: 64,
    left: 16,
    right: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  categoriesContainer: {
    paddingBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  subcategoriesContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  subcategoriesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  subcategoriesScrollContent: {
    paddingBottom: 4,
  },
  subcategoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background,
    marginRight: 8,
  },
  subcategoryButtonText: {
    fontSize: 12,
    color: colors.text,
  },
  selectedFlyerCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  flyerImage: {
    width: '100%',
    height: '100%',
  },
  flyerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  flyerCategoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  flyerCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  flyerDiscountBadge: {
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
  flyerDiscountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  flyerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  flyerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  flyerBusinessName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 4,
  },
  reviewCountText: {
    fontSize: 10,
    color: '#fff',
    opacity: 0.8,
    marginLeft: 2,
  },
  flyerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flyerLocationText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 4,
  },
  nearbyFlyersContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    padding: 16,
  },
  nearbyFlyersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  nearbyFlyersScrollContent: {
    paddingRight: 16,
  },
  nearbyFlyerCard: {
    width: 200,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.card,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nearbyFlyerImage: {
    width: '100%',
    height: 80,
  },
  nearbyFlyerContent: {
    padding: 8,
  },
  nearbyFlyerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  nearbyFlyerBusinessName: {
    fontSize: 12,
    color: colors.primary,
    marginBottom: 4,
  },
  nearbyFlyerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nearbyFlyerCategory: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nearbyFlyerCategoryText: {
    fontSize: 10,
    fontWeight: '500',
  },
  nearbyFlyerDistance: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
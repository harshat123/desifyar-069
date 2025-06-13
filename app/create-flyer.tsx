import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Category } from '@/types';
import { useUserStore } from '@/store/useUserStore';
import { Tag, AlertCircle, MessageCircle } from 'lucide-react-native';
import CustomImagePicker from '@/components/ImagePicker';
import DatePicker from '@/components/DatePicker';
import LocationAutocomplete from '@/components/LocationAutocomplete';
import { mockFirebaseServices } from './firebase-config';
import { trpc, trpcClient } from '@/lib/trpc';
import { TRPCClientError } from '@trpc/client';

// Define the type for the flyer data returned from the mutation
interface FlyerData {
  id: string;
  title: string;
  businessName: string;
  description: string;
  category: Category;
  imageUrl: string;
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  expiresAt: string;
  createdAt: string;
  views: number;
  reactions: number;
  userId: string;
  discount?: string;
  couponCode?: string;
}

export default function CreateFlyerScreen() {
  const { 
    user,
    flyersPosted, 
    isPremium, 
    incrementFlyersPosted, 
    addBusinessName, 
    isBusinessNameUnique,
    getRemainingFreePostings,
    incrementMonthlyPostingCount,
    resetMonthlyPostingCountIfNeeded,
    getBusinessNames
  } = useUserStore();
  
  const [title, setTitle] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [location, setLocation] = useState('');
  const [locationCoords, setLocationCoords] = useState<{lat?: number, lng?: number}>({});
  const [discount, setDiscount] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [businessNameError, setBusinessNameError] = useState('');
  const [remainingFreePostings, setRemainingFreePostings] = useState(5);
  const [showContactSupport, setShowContactSupport] = useState(false);
  
  // tRPC mutation for creating a flyer
  const createFlyerMutation = trpc.flyers.create.useMutation({
    onSuccess: (data: FlyerData) => {
      console.log("Flyer created successfully:", data);
      
      // Add business name to user's list if it's a new business
      const userBusinessNames = getBusinessNames();
      const isExistingBusiness = userBusinessNames.includes(businessName.toLowerCase().trim());
      if (!isExistingBusiness) {
        addBusinessName(businessName);
      }
      
      // Increment counters
      incrementFlyersPosted();
      incrementMonthlyPostingCount();
      
      Alert.alert(
        "Flyer Created",
        "Your flyer has been successfully created!",
        [{ text: "OK", onPress: () => router.back() }]
      );
      
      setIsSubmitting(false);
    },
    onError: (error: TRPCClientError<any>) => {
      console.error("Error creating flyer:", error);
      Alert.alert(
        "Error",
        "Failed to create flyer. Please try again."
      );
      setIsSubmitting(false);
    }
  });
  
  useEffect(() => {
    // Reset monthly posting count if needed (new month)
    resetMonthlyPostingCountIfNeeded();
    
    // Get remaining free postings
    setRemainingFreePostings(getRemainingFreePostings());
    
    // Check if user has already registered a business
    if (user && getBusinessNames().length > 0) {
      setBusinessName(getBusinessNames()[0]);
      setShowContactSupport(true);
    }
  }, []);
  
  const categories: Category[] = ['groceries', 'restaurants', 'events', 'markets', 'sports'];
  
  const handleCategorySelect = (selectedCategory: Category) => {
    setCategory(selectedCategory);
  };
  
  const handleLocationChange = (address: string, lat?: number, lng?: number) => {
    setLocation(address);
    setLocationCoords({ lat, lng });
  };
  
  const handleBusinessNameChange = (text: string) => {
    setBusinessName(text);
    setBusinessNameError('');
    
    // Check if business name is unique
    if (text.trim().length > 0 && !isBusinessNameUnique(text)) {
      setBusinessNameError('This business name is already in use. Please contact support to update your business information.');
    }
  };
  
  const handleContactSupport = () => {
    // In a real app, this would navigate to a messaging screen
    Alert.alert(
      "Contact Support",
      "To update your business information or register a new business, please contact our support team.",
      [{ text: "OK" }]
    );
  };
  
  const handleSubmit = async () => {
    // Check if business name is unique or if it's the user's existing business
    const userBusinessNames = getBusinessNames();
    const isExistingBusiness = userBusinessNames.includes(businessName.toLowerCase().trim());
    
    if (!isExistingBusiness && !isBusinessNameUnique(businessName)) {
      setBusinessNameError('This business name is already in use. Please choose a different name.');
      return;
    }
    
    // Check if user has reached free limit
    if (remainingFreePostings <= 0 && !isPremium) {
      router.push('/subscription');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would upload the image to storage first
      // For this demo, we'll use a mock image URL
      const imageUrl = imageUri || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7';
      
      // Try to use backend if available
      try {
        // Use tRPC mutation to create the flyer
        createFlyerMutation.mutate({
          title,
          businessName,
          description,
          category: category || 'events', // Default to events if no category selected
          imageUrl,
          location: {
            address: location,
            latitude: locationCoords.lat,
            longitude: locationCoords.lng,
          },
          expiresAt: expiryDate,
          discount,
          couponCode,
        });
        
        // The success and error handling is in the mutation hooks
        return;
      } catch (error) {
        console.log("Backend not available, using mock service");
        
        // Fallback to mock service
        await mockFirebaseServices.uploadFile('flyers', imageUri);
        
        await mockFirebaseServices.addDocument('flyers', {
          title,
          businessName,
          description,
          category,
          imageUrl: 'https://example.com/mock-flyer.jpg', // In a real app, this would be the downloadURL
          location: {
            address: location,
            latitude: locationCoords.lat,
            longitude: locationCoords.lng,
          },
          createdAt: new Date().toISOString(),
          expiresAt: expiryDate,
          views: 0,
          reactions: 0,
          userId: mockFirebaseServices.getCurrentUser().uid,
          discount,
          couponCode,
        });
        
        // Add business name to user's list if it's a new business
        if (!isExistingBusiness) {
          addBusinessName(businessName);
        }
        
        // Increment counters
        incrementFlyersPosted();
        incrementMonthlyPostingCount();
        
        Alert.alert(
          "Flyer Created",
          "Your flyer has been successfully created!",
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error("Error creating flyer:", error);
      Alert.alert(
        "Error",
        "Failed to create flyer. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isFormValid = () => {
    return (
      title.trim() !== '' &&
      businessName.trim() !== '' &&
      !businessNameError &&
      description.trim() !== '' &&
      category !== null &&
      imageUri !== null &&
      expiryDate.trim() !== '' &&
      location.trim() !== ''
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <Stack.Screen
        options={{
          title: 'Create Flyer',
          headerRight: () => (
            <TouchableOpacity 
              style={[
                styles.submitButton,
                (!isFormValid() || isSubmitting) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {remainingFreePostings <= 0 && !isPremium ? (
          <View style={styles.premiumNotice}>
            <Text style={styles.premiumNoticeText}>
              You've used all your free postings this month. Subscribe to premium for unlimited flyers or pay $5.99 per flyer.
            </Text>
          </View>
        ) : !isPremium && (
          <View style={styles.freePostingsNotice}>
            <Text style={styles.freePostingsText}>
              You have {remainingFreePostings} free {remainingFreePostings === 1 ? 'posting' : 'postings'} remaining this month
            </Text>
          </View>
        )}
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter flyer title"
            placeholderTextColor={colors.textSecondary}
            maxLength={50}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Business Name</Text>
          <View style={styles.businessNameContainer}>
            <TextInput
              style={[
                styles.input, 
                businessNameError ? styles.inputError : null,
                showContactSupport && styles.inputDisabled
              ]}
              value={businessName}
              onChangeText={handleBusinessNameChange}
              placeholder="Enter your business name"
              placeholderTextColor={colors.textSecondary}
              maxLength={50}
              editable={!showContactSupport}
            />
            
            {showContactSupport && (
              <TouchableOpacity 
                style={styles.contactSupportButton}
                onPress={handleContactSupport}
              >
                <MessageCircle size={20} color={colors.secondary} />
                <Text style={styles.contactSupportText}>Contact Support</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {businessNameError ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={colors.error} />
              <Text style={styles.errorText}>{businessNameError}</Text>
            </View>
          ) : (
            <Text style={styles.helperText}>
              {showContactSupport 
                ? "You can only post flyers for your registered business. Contact support to update information."
                : "This name will be associated with your business and cannot be changed later"}
            </Text>
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && { backgroundColor: `${colors.categories[cat]}20` },
                  category === cat && { borderColor: colors.categories[cat] },
                ]}
                onPress={() => handleCategorySelect(cat)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    category === cat && { color: colors.categories[cat] },
                  ]}
                >
                  {cat === 'groceries' ? 'Groceries' : 
                   cat === 'restaurants' ? 'Restaurants' :
                   cat === 'events' ? 'Cultural Events' :
                   cat === 'sports' ? 'Sports' :
                   'Bazaars'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <CustomImagePicker 
          imageUri={imageUri}
          onImageSelected={setImageUri}
          onImageRemoved={() => setImageUri(null)}
        />
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter flyer description"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            maxLength={200}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Discount Offer</Text>
          <View style={styles.inputWithIcon}>
            <Tag size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.inputWithIconText}
              value={discount}
              onChangeText={setDiscount}
              placeholder="e.g. 20% OFF, Buy 1 Get 1 Free"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Coupon Code (Optional)</Text>
          <TextInput
            style={styles.input}
            value={couponCode}
            onChangeText={setCouponCode}
            placeholder="e.g. DIWALI20, SUMMER50"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="characters"
          />
          <Text style={styles.helperText}>
            Leave blank to generate unique codes for each user
          </Text>
        </View>
        
        <DatePicker
          label="Expiry Date"
          value={expiryDate}
          onChange={setExpiryDate}
          placeholder="Select expiry date"
          maxMonths={2}
        />
        
        <LocationAutocomplete
          label="Location"
          value={location}
          onChange={handleLocationChange}
          placeholder="Enter store location"
        />
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
  submitButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  premiumNotice: {
    backgroundColor: `${colors.secondary}20`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  premiumNoticeText: {
    color: colors.text,
    fontSize: 14,
  },
  freePostingsNotice: {
    backgroundColor: `${colors.primary}15`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  freePostingsText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: `${colors.card}80`,
    color: colors.textSecondary,
  },
  businessNameContainer: {
    marginBottom: 4,
  },
  contactSupportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.secondary}15`,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  contactSupportText: {
    color: colors.secondary,
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginLeft: 6,
  },
  textArea: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    margin: 4,
  },
  categoryButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputWithIconText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
});
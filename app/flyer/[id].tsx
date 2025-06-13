import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Alert, Modal } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { Flyer, Review } from '@/types';
import { mockFlyers } from '@/mocks/flyers';
import { MapPin, Calendar, Eye, Heart, Share2, ArrowLeft, Tag, Ticket, Star, MessageSquare, Edit, MessageCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useUserStore } from '@/store/useUserStore';
import { useRedemptionStore } from '@/store/useRedemptionStore';
import { useReviewStore } from '@/store/useReviewStore';
import { mockReviews } from '@/mocks/reviews';
import ReviewsList from '@/components/ReviewsList';
import WriteReviewForm from '@/components/WriteReviewForm';

const { width } = Dimensions.get('window');

export default function FlyerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [flyer, setFlyer] = useState<Flyer | null>(null);
  const [hasReacted, setHasReacted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  
  const { user } = useUserStore();
  const { generateCode, getCodeByFlyerAndUser } = useRedemptionStore();
  const { reviews, addReview, getReviewsByFlyerId, getAverageRatingByFlyerId, markReviewHelpful, hasUserReviewed, updateFlyerWithReviews } = useReviewStore();
  
  useEffect(() => {
    // Initialize review store with mock data
    if (reviews.length === 0) {
      mockReviews.forEach(review => {
        addReview(review);
      });
    }
  }, []);
  
  useEffect(() => {
    if (id) {
      const foundFlyer = mockFlyers.find(f => f.id === id);
      if (foundFlyer) {
        // Increment view count
        const updatedFlyer = {
          ...foundFlyer,
          views: foundFlyer.views + 1
        };
        
        // Update with review data
        const reviewData = updateFlyerWithReviews(id);
        updatedFlyer.averageRating = reviewData.averageRating;
        updatedFlyer.reviewCount = reviewData.reviewCount;
        
        setFlyer(updatedFlyer);
      }
    }
  }, [id]);
  
  useEffect(() => {
    if (flyer && user) {
      // Check if user has already reviewed this flyer
      const hasReviewed = hasUserReviewed(flyer.id, user.id);
      if (hasReviewed) {
        const review = reviews.find(r => r.flyerId === flyer.id && r.userId === user.id);
        if (review) {
          setUserReview(review);
        }
      }
    }
  }, [flyer, user, reviews]);
  
  const handleReact = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (flyer && !hasReacted) {
      setFlyer({
        ...flyer,
        reactions: flyer.reactions + 1
      });
      setHasReacted(true);
    }
  };
  
  const handleGetCoupon = () => {
    if (!user) {
      Alert.alert(
        "Login Required",
        "Please login to get a coupon code",
        [{ text: "OK" }]
      );
      return;
    }
    
    if (flyer) {
      router.push({
        pathname: '/redeem-coupon',
        params: { flyerId: flyer.id }
      });
    }
  };
  
  const handleWriteReview = () => {
    if (!user) {
      Alert.alert(
        "Login Required",
        "Please login to write a review",
        [{ text: "OK" }]
      );
      return;
    }
    
    setShowReviewForm(true);
  };
  
  const handleEditReview = () => {
    if (!user || !userReview) return;
    
    setShowReviewForm(true);
  };
  
  const handleSubmitReview = (rating: number, comment: string) => {
    if (!user || !flyer) return;
    
    const newReview: Review = {
      id: userReview ? userReview.id : `rev-${Date.now()}`,
      flyerId: flyer.id,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      helpful: userReview ? userReview.helpful : 0
    };
    
    addReview(newReview);
    setUserReview(newReview);
    setShowReviewForm(false);
    
    // Update flyer with new average rating
    const reviewData = updateFlyerWithReviews(flyer.id);
    
    setFlyer({
      ...flyer,
      averageRating: reviewData.averageRating,
      reviewCount: reviewData.reviewCount
    });
  };
  
  const handleMarkHelpful = (reviewId: string) => {
    markReviewHelpful(reviewId);
  };
  
  const handleContactBusiness = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowContactModal(true);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  if (!flyer) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  // Check if user already has a redemption code for this flyer
  const existingCode = user && getCodeByFlyerAndUser(flyer.id, user.id);
  
  // Get reviews for this flyer
  const flyerReviews = getReviewsByFlyerId(flyer.id);
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: flyer.imageUrl }}
          style={styles.image}
          contentFit="cover"
        />
        
        <View style={styles.categoryBadge}>
          <Text style={[styles.categoryText, { color: colors.categories[flyer.category] }]}>
            {flyer.category}
          </Text>
        </View>
        
        {flyer.discount && (
          <View style={styles.discountBadge}>
            <Tag size={16} color="#fff" />
            <Text style={styles.discountText}>{flyer.discount}</Text>
          </View>
        )}
        
        <View style={styles.content}>
          <Text style={styles.title}>{flyer.title}</Text>
          <Text style={styles.businessName}>{flyer.businessName}</Text>
          
          {flyer.averageRating && flyer.averageRating > 0 && (
            <View style={styles.ratingContainer}>
              <Star size={18} color={colors.secondary} fill={colors.secondary} />
              <Text style={styles.ratingValue}>{flyer.averageRating}</Text>
              <Text style={styles.reviewCount}>
                ({flyer.reviewCount} {flyer.reviewCount === 1 ? 'review' : 'reviews'})
              </Text>
            </View>
          )}
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <MapPin size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{flyer.location.address}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Calendar size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>
                Expires {formatDate(flyer.expiresAt)}
              </Text>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Eye size={20} color={colors.textSecondary} />
              <Text style={styles.statValue}>{flyer.views}</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            
            <View style={styles.stat}>
              <Heart 
                size={20} 
                color={hasReacted ? colors.error : colors.textSecondary} 
                fill={hasReacted ? colors.error : 'none'}
              />
              <Text style={styles.statValue}>{flyer.reactions}</Text>
              <Text style={styles.statLabel}>Reactions</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.reviewButton}
              onPress={userReview ? handleEditReview : handleWriteReview}
            >
              {userReview ? (
                <Edit size={20} color={colors.primary} />
              ) : (
                <MessageSquare size={20} color={colors.primary} />
              )}
              <Text style={styles.reviewButtonText}>
                {userReview ? 'Edit Review' : 'Write Review'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{flyer.description}</Text>
          
          {flyer.discount && (
            <View style={styles.couponContainer}>
              <View style={styles.couponHeader}>
                <Ticket size={20} color={colors.primary} />
                <Text style={styles.couponTitle}>Discount Coupon</Text>
              </View>
              
              <View style={styles.couponContent}>
                <Text style={styles.couponValue}>{flyer.discount}</Text>
                <Text style={styles.couponInfo}>
                  Get your unique redemption code to use in-store
                </Text>
                
                <TouchableOpacity 
                  style={styles.getCouponButton}
                  onPress={handleGetCoupon}
                >
                  <Text style={styles.getCouponButtonText}>
                    {existingCode ? "View My Coupon" : "Get Coupon"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.contactBusinessButton}
            onPress={handleContactBusiness}
          >
            <MessageCircle size={20} color={colors.secondary} />
            <Text style={styles.contactBusinessText}>Contact Business</Text>
          </TouchableOpacity>
          
          {flyerReviews.length > 0 && (
            <View style={styles.reviewsSection}>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              <ReviewsList 
                reviews={flyerReviews} 
                onMarkHelpful={handleMarkHelpful}
              />
            </View>
          )}
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                hasReacted ? styles.actionButtonDisabled : styles.actionButtonPrimary
              ]}
              onPress={handleReact}
              disabled={hasReacted}
            >
              <Heart 
                size={20} 
                color={hasReacted ? colors.textSecondary : '#fff'} 
                fill={hasReacted ? 'none' : '#fff'}
              />
              <Text style={[
                styles.actionButtonText,
                hasReacted ? styles.actionButtonTextDisabled : {}
              ]}>
                {hasReacted ? 'Reacted' : 'React'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButtonSecondary}>
              <Share2 size={20} color={colors.primary} />
              <Text style={styles.actionButtonTextSecondary}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      <Modal
        visible={showReviewForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReviewForm(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <WriteReviewForm 
              onSubmit={handleSubmitReview}
              initialRating={userReview?.rating || 0}
              initialComment={userReview?.comment || ''}
              isEditing={!!userReview}
            />
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowReviewForm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <Modal
        visible={showContactModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowContactModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.contactModalTitle}>Contact {flyer.businessName}</Text>
            
            <View style={styles.contactOption}>
              <Text style={styles.contactOptionTitle}>Send Message</Text>
              <Text style={styles.contactOptionDescription}>
                Send a direct message to the business owner
              </Text>
              <TouchableOpacity 
                style={styles.contactOptionButton}
                onPress={() => {
                  setShowContactModal(false);
                  Alert.alert("Message Feature", "Messaging feature coming soon!");
                }}
              >
                <MessageCircle size={20} color="#fff" />
                <Text style={styles.contactOptionButtonText}>Send Message</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowContactModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  scrollContent: {
    paddingBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  image: {
    width: width,
    height: 300,
  },
  categoryBadge: {
    position: 'absolute',
    top: 260,
    left: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  discountBadge: {
    position: 'absolute',
    top: 260,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  discountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  businessName: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  metaContainer: {
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reviewButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}15`,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  reviewButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 24,
  },
  couponContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  couponContent: {
    alignItems: 'center',
  },
  couponValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 8,
  },
  couponInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  getCouponButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  getCouponButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  contactBusinessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.secondary}15`,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  contactBusinessText: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: '600',
    marginLeft: 8,
  },
  reviewsSection: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
  },
  actionButtonDisabled: {
    backgroundColor: colors.card,
  },
  actionButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  actionButtonTextDisabled: {
    color: colors.textSecondary,
  },
  actionButtonTextSecondary: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 32,
  },
  cancelButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  contactModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  contactOption: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  contactOptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  contactOptionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  contactOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  contactOptionButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});
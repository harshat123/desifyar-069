import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { Review } from '@/types';
import { Star, ThumbsUp, Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface ReviewsListProps {
  reviews: Review[];
  onMarkHelpful: (reviewId: string) => void;
}

export default function ReviewsList({ reviews, onMarkHelpful }: ReviewsListProps) {
  const handleMarkHelpful = (reviewId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onMarkHelpful(reviewId);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          color={i <= rating ? colors.secondary : colors.border}
          fill={i <= rating ? colors.secondary : 'none'}
        />
      );
    }
    return stars;
  };
  
  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewerName}>{item.userName}</Text>
        <View style={styles.dateContainer}>
          <Clock size={12} color={colors.textSecondary} />
          <Text style={styles.reviewDate}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>
      
      <View style={styles.starsContainer}>
        {renderStars(item.rating)}
      </View>
      
      <Text style={styles.reviewComment}>{item.comment}</Text>
      
      <View style={styles.reviewFooter}>
        <TouchableOpacity 
          style={styles.helpfulButton}
          onPress={() => handleMarkHelpful(item.id)}
        >
          <ThumbsUp size={14} color={colors.primary} />
          <Text style={styles.helpfulText}>Helpful</Text>
          <Text style={styles.helpfulCount}>({item.helpful})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderReview}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No reviews yet</Text>
          <Text style={styles.emptySubtext}>Be the first to review this business</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  reviewItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  helpfulText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
    marginRight: 2,
  },
  helpfulCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { Star, Send } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface WriteReviewFormProps {
  onSubmit: (rating: number, comment: string) => void;
  initialRating?: number;
  initialComment?: string;
  isEditing?: boolean;
}

export default function WriteReviewForm({ 
  onSubmit, 
  initialRating = 0, 
  initialComment = '',
  isEditing = false
}: WriteReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  
  const handleRatingPress = (selectedRating: number) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setRating(selectedRating);
  };
  
  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === '') {
      return;
    }
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    onSubmit(rating, comment);
    
    // Reset form if not editing
    if (!isEditing) {
      setRating(0);
      setComment('');
    }
  };
  
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRatingPress(i)}
          style={styles.starButton}
        >
          <Star 
            size={32} 
            color={i <= rating ? colors.secondary : colors.border}
            fill={i <= rating ? colors.secondary : 'none'}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEditing ? 'Edit Your Review' : 'Write a Review'}</Text>
      
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Your Rating:</Text>
        <View style={styles.starsContainer}>
          {renderStars()}
        </View>
      </View>
      
      <View style={styles.commentContainer}>
        <Text style={styles.commentLabel}>Your Review:</Text>
        <TextInput
          style={styles.commentInput}
          value={comment}
          onChangeText={setComment}
          placeholder="Share your experience with this business..."
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={4}
          maxLength={500}
        />
        <Text style={styles.characterCount}>
          {comment.length}/500
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.submitButton,
          (rating === 0 || comment.trim() === '') && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={rating === 0 || comment.trim() === ''}
      >
        <Send size={20} color="#fff" />
        <Text style={styles.submitButtonText}>
          {isEditing ? 'Update Review' : 'Submit Review'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  ratingContainer: {
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    padding: 4,
  },
  commentContainer: {
    marginBottom: 16,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  characterCount: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});
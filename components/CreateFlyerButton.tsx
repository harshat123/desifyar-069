import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Animated } from 'react-native';
import { colors } from '@/constants/colors';
import { Plus } from "lucide-react";
import { useUserStore } from '@/store/useUserStore';
import { router } from 'expo-router';

export default function CreateFlyerButton() {
  const { flyersPosted, isPremium } = useUserStore();
  const [animation] = React.useState(new Animated.Value(0));
  
  React.useEffect(() => {
    // Start animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });
  
  const handlePress = () => {
    if (flyersPosted >= 5 && !isPremium) {
      // Navigate to subscription screen
      router.push('/subscription');
    } else {
      // Navigate to create flyer screen
      router.push('/create-flyer');
    }
  };
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
        <Plus size={24} color="#fff" />
      </Animated.View>
      {flyersPosted >= 5 && !isPremium && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>$5.99</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
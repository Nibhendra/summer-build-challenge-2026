import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function FloatingAddButton() {
  const router = useRouter();
  const shift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shift, {
        toValue: 1,
        duration: 3500, // Smooth continuous rotation
        useNativeDriver: true,
        easing: Easing.linear, // CRITICAL: This makes the rotation constant speed with no stopping/resetting
      })
    ).start();
  }, [shift]);

  // Infinite 360-degree rotation
  const spin = shift.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity
      style={styles.fabWrap}
      onPress={() => router.push('/add-expense')}
      activeOpacity={0.85}
    >
      <View style={styles.mask}>
        <Animated.View style={[styles.gradientContainer, { transform: [{ rotate: spin }] }]}>
          <LinearGradient
            // 7 dynamic colors for a vibrant, funky effect
            colors={[
              '#FF4757', // Red
              '#FF9A3C', // Orange
              '#FFD200', // Yellow
              '#00E5C0', // Green
              '#4FACFE', // Blue
              '#7C6EF6', // Indigo
              '#FF6B9D', // Pink
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
        </Animated.View>
        <View style={styles.iconContainer} pointerEvents="none">
          <Text style={styles.fabIcon}>+</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fabWrap: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    borderRadius: 30,
    shadowColor: '#4FACFE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  mask: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientContainer: {
    width: 150, // Much larger than the mask so it fills the corners while rotating
    height: 150,
    position: 'absolute',
  },
  gradient: {
    flex: 1,
  },
  iconContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '300',
    marginTop: -2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

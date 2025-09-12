import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Zap as Train } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    // Logo animation
    scale.value = withSequence(
      withTiming(1.2, { duration: 800, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 400, easing: Easing.inOut(Easing.cubic) })
    );
    
    opacity.value = withTiming(1, { duration: 1000 });
    
    // Subtle rotation animation
    rotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
      opacity: opacity.value,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: withTiming(0, { duration: 1200 }) }]
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Train size={80} color="#FFFFFF" strokeWidth={2} />
        </Animated.View>
        
        <Animated.View style={textAnimatedStyle}>
          <Text style={styles.appName}>RailEase</Text>
          <Text style={styles.tagline}>Your Railway Travel Companion</Text>
        </Animated.View>
        
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBar}>
            <Animated.View style={[styles.loadingProgress]} />
          </View>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 140,
    height: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: '#BFDBFE',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 60,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    width: '100%',
  },
  loadingText: {
    fontSize: 16,
    color: '#BFDBFE',
    fontFamily: 'Inter-Medium',
  },
});
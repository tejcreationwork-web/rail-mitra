import React from 'react';
import { View, Text, StyleSheet, Dimensions, AccessibilityInfo } from 'react-native';
import { Zap as Train } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolate
} from 'react-native-reanimated';
import { Easing } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);
  const progress = useSharedValue(0);

  React.useEffect(() => {
    // Announce to screen readers
    AccessibilityInfo.announceForAccessibility('RailEase app is loading');
    
    // Logo animation
    scale.value = withSequence(
      withTiming(1.2, { duration: 800, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 400, easing: Easing.inOut(Easing.cubic) })
    );
    
    opacity.value = withTiming(1, { duration: 1000 });
    
    // Loading progress animation
    progress.value = withTiming(1, { 
      duration: 2500, 
      easing: Easing.out(Easing.cubic) 
    });
    
    // Gentle pulse animation for logo
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.sine) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sine) })
      ),
      -1,
      true
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value }
      ],
      opacity: opacity.value,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => {
    const progressWidth = interpolate(progress.value, [0, 1], [0, 200]);
    return {
      width: progressWidth,
    };
  });

  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityLabel="RailEase app loading screen"
      accessibilityRole="progressbar"
    >
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Train 
            size={80} 
            color="#FFFFFF" 
            strokeWidth={2}
            accessibilityLabel="RailEase train logo"
          />
        </Animated.View>
        
        <Animated.View style={textAnimatedStyle}>
          <Text 
            style={styles.appName}
            accessible={true}
            accessibilityRole="header"
          >
            RailEase
          </Text>
          <Text 
            style={styles.tagline}
            accessible={true}
          >
            Your Railway Travel Companion
          </Text>
        </Animated.View>
        
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBar}>
            <Animated.View style={[styles.loadingProgress, progressAnimatedStyle]} />
          </View>
          <Text 
            style={styles.loadingText}
            accessible={true}
            accessibilityLiveRegion="polite"
          >
            Loading your travel companion...
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563EB',
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
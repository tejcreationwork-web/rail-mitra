import React from 'react';
import { View, Text, StyleSheet, Dimensions, AccessibilityInfo } from 'react-native';
import { Zap as Train } from 'lucide-react-native';
import { ImageBackground } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';


const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);
  const progress = useSharedValue(0);

  React.useEffect(() => {
    // Announce to screen readers
    AccessibilityInfo.announceForAccessibility('RailEase app is loading');
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
  <ImageBackground 
    source={require('../assets/images/splash-bg.jpg')} // 👈 replace with your image path
    style={styles.container}
    resizeMode="cover"
  >
    <View 
      style={styles.container}
      accessible={true}
      accessibilityLabel="RailEase app loading screen"
      accessibilityRole="progressbar"
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Train 
            size={80} 
            color="#FFFFFF" 
            strokeWidth={2}
            accessibilityLabel="RailEase train logo"
          />
        </View>
      
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
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(37, 99, 235, 0.8)', // blue tint with transparency
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
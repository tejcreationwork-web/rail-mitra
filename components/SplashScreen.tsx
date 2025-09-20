import React from 'react';
import { View, Text, StyleSheet, Dimensions, AccessibilityInfo, ActivityIndicator } from 'react-native';
import { Brain as Train } from 'lucide-react-native';
import { ImageBackground } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolate,
  Easing,
  useEffect,
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

    // Logo animation
    scale.value = withSequence(
      withTiming(1.1, { duration: 800, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 400, easing: Easing.inOut(Easing.quad) })
    );

    opacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.quad) });

    // Loading progress animation
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
      -1,
      false
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
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
      source={require('../assets/images/image.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Logo Container */}
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <View style={styles.logoBackground}>
              <Train 
                size={80} 
                color="#FFFFFF" 
                strokeWidth={2}
                accessibilityLabel="RailEase train logo"
              />
            </View>
          </Animated.View>

          {/* App Name and Tagline */}
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

          {/* Loading Indicator */}
          <View style={styles.loadingContainer}>
            <ActivityIndicator 
              size="large" 
              color="#FFFFFF"
              accessible={true}
              accessibilityLabel="Loading your travel companion"
            />
            <Text 
              style={styles.loadingText}
              accessible={true}
              accessibilityLiveRegion="polite"
            >
              Loading your travel companion...
            </Text>
          </View>
        </View>

        {/* Bottom Branding */}
        <View style={styles.bottomContainer}>
          <Text style={styles.brandingText}>Powered by RailEase</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(37, 99, 235, 0.1)', // Light blue overlay to enhance readability
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 60,
    alignItems: 'center',
  },
  logoBackground: {
    width: 160,
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  appName: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Poppins-ExtraBold',
    letterSpacing: 2,
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 80,
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Medium',
    marginTop: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  brandingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  versionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Inter-Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
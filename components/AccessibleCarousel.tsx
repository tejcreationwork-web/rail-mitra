import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  AccessibilityInfo,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface CarouselItem {
  id: string;
  content: React.ReactNode;
  accessibilityLabel?: string;
}

interface AccessibleCarouselProps {
  items: CarouselItem[];
  title?: string;
  showControls?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  itemWidth?: number;
  spacing?: number;
  style?: any;
}

export default function AccessibleCarousel({
  items,
  title,
  showControls = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  itemWidth,
  spacing = 16,
  style,
}: AccessibleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();
  const screenWidth = Dimensions.get('window').width;
  const effectiveItemWidth = itemWidth || screenWidth - 40;

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isUserInteracting && items.length > 1) {
      autoPlayRef.current = setInterval(() => {
        const nextIndex = (currentIndex + 1) % items.length;
        goToSlide(nextIndex);
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, currentIndex, isUserInteracting, items.length]);

  const goToSlide = (index: number) => {
    if (index < 0 || index >= items.length) return;
    
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * (effectiveItemWidth + spacing),
      animated: true,
    });

    // Announce to screen readers
    AccessibilityInfo.announceForAccessibility(
      `Showing item ${index + 1} of ${items.length}${
        items[index].accessibilityLabel ? `: ${items[index].accessibilityLabel}` : ''
      }`
    );
  };

  const handlePrevious = () => {
    setIsUserInteracting(true);
    const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    goToSlide(prevIndex);
    setTimeout(() => setIsUserInteracting(false), 1000);
  };

  const handleNext = () => {
    setIsUserInteracting(true);
    const nextIndex = (currentIndex + 1) % items.length;
    goToSlide(nextIndex);
    setTimeout(() => setIsUserInteracting(false), 1000);
  };

  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / (effectiveItemWidth + spacing));
    if (index !== currentIndex && index >= 0 && index < items.length) {
      setCurrentIndex(index);
    }
  };

  const handleScrollBeginDrag = () => {
    setIsUserInteracting(true);
  };

  const handleScrollEndDrag = () => {
    setTimeout(() => setIsUserInteracting(false), 1000);
  };

  return (
    <View style={[styles.container, style]}>
      {title && (
        <Text 
          style={styles.title}
          accessible={true}
          accessibilityRole="header"
        >
          {title}
        </Text>
      )}

      <View style={styles.carouselContainer}>
        {/* Navigation Controls */}
        {showControls && items.length > 1 && (
          <>
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton]}
              onPress={handlePrevious}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Previous item"
              accessibilityHint={`Go to item ${currentIndex === 0 ? items.length : currentIndex} of ${items.length}`}
            >
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={handleNext}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Next item"
              accessibilityHint={`Go to item ${currentIndex + 2 > items.length ? 1 : currentIndex + 2} of ${items.length}`}
            >
              <ChevronRight size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </>
        )}

        {/* Carousel Content */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled={false}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          accessible={true}
          accessibilityRole="list"
          accessibilityLabel={`Carousel with ${items.length} items`}
        >
          {items.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.carouselItem,
                { width: effectiveItemWidth, marginRight: index < items.length - 1 ? spacing : 0 }
              ]}
              accessible={true}
              accessibilityLabel={item.accessibilityLabel || `Item ${index + 1} of ${items.length}`}
            >
              {item.content}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Pagination Dots */}
      {items.length > 1 && (
        <View style={styles.pagination}>
          <Text 
            style={styles.paginationText}
            accessible={true}
            accessibilityLiveRegion="polite"
          >
            {currentIndex + 1} of {items.length}
          </Text>
          <View style={styles.dots}>
            {items.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && styles.activeDot
                ]}
                onPress={() => goToSlide(index)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Go to item ${index + 1}`}
                accessibilityState={{ selected: index === currentIndex }}
              />
            ))}
          </View>
        </View>
      )}

      {/* Skip Navigation for Screen Readers */}
      <TouchableOpacity
        style={styles.skipButton}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Skip carousel"
        accessibilityHint="Skip past the carousel content"
        onPress={() => {
          // This would typically focus the next element after the carousel
          AccessibilityInfo.announceForAccessibility('Skipped carousel');
        }}
      >
        <Text style={styles.skipButtonText}>Skip Carousel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    paddingHorizontal: 20,
    fontFamily: 'Poppins-Bold',
  },
  carouselContainer: {
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  carouselItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    transform: [{ translateY: -22 }],
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  paginationText: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 16,
    fontFamily: 'Inter-Medium',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
    minWidth: 44, // Minimum touch target
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDot: {
    backgroundColor: '#2563EB',
    width: 24,
  },
  skipButton: {
    position: 'absolute',
    top: -1000, // Hidden by default
    left: 0,
    backgroundColor: '#2563EB',
    padding: 8,
    borderRadius: 4,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
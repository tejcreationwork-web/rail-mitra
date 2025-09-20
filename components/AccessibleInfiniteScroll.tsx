import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  AccessibilityInfo,
  RefreshControl,
} from 'react-native';
import { CircleAlert as AlertCircle, RefreshCw } from 'lucide-react-native';

interface InfiniteScrollItem {
  id: string;
  [key: string]: any;
}

interface AccessibleInfiniteScrollProps<T extends InfiniteScrollItem> {
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement;
  onLoadMore: () => Promise<void>;
  onRefresh?: () => Promise<void>;
  loading?: boolean;
  hasMore?: boolean;
  error?: string | null;
  emptyMessage?: string;
  loadingMessage?: string;
  errorRetryMessage?: string;
  itemsPerPage?: number;
  threshold?: number;
  style?: any;
  contentContainerStyle?: any;
  keyExtractor?: (item: T, index: number) => string;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export default function AccessibleInfiniteScroll<T extends InfiniteScrollItem>({
  data,
  renderItem,
  onLoadMore,
  onRefresh,
  loading = false,
  hasMore = true,
  error = null,
  emptyMessage = 'No items found',
  loadingMessage = 'Loading more items...',
  errorRetryMessage = 'Failed to load. Tap to retry.',
  itemsPerPage = 20,
  threshold = 0.7,
  style,
  contentContainerStyle,
  keyExtractor,
  ListHeaderComponent,
  ListFooterComponent,
}: AccessibleInfiniteScrollProps<T>) {
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [announceLoadMore, setAnnounceLoadMore] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const lastAnnouncedCount = useRef(0);

  // Announce when new items are loaded
  useEffect(() => {
    if (data.length > lastAnnouncedCount.current && announceLoadMore) {
      const newItemsCount = data.length - lastAnnouncedCount.current;
      AccessibilityInfo.announceForAccessibility(
        `${newItemsCount} new items loaded. Total ${data.length} items.`
      );
      setAnnounceLoadMore(false);
    }
    lastAnnouncedCount.current = data.length;
  }, [data.length, announceLoadMore]);

  const handleLoadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore || error) return;

    setLoadingMore(true);
    setAnnounceLoadMore(true);
    
    try {
      await onLoadMore();
    } catch (err) {
      console.error('Error loading more items:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, hasMore, error, onLoadMore]);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh || refreshing) return;

    setRefreshing(true);
    AccessibilityInfo.announceForAccessibility('Refreshing content');
    
    try {
      await onRefresh();
      AccessibilityInfo.announceForAccessibility('Content refreshed');
    } catch (err) {
      console.error('Error refreshing:', err);
      AccessibilityInfo.announceForAccessibility('Failed to refresh content');
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, refreshing]);

  const handleRetry = useCallback(async () => {
    AccessibilityInfo.announceForAccessibility('Retrying to load content');
    await handleLoadMore();
  }, [handleLoadMore]);

  const renderFooter = () => {
    if (error) {
      return (
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Retry loading"
            accessibilityHint={errorRetryMessage}
          >
            <AlertCircle size={20} color="#DC2626" />
            <Text style={styles.retryText}>{errorRetryMessage}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (loadingMore && hasMore) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator 
            size="small" 
            color="#2563EB"
            accessible={true}
            accessibilityLabel={loadingMessage}
          />
          <Text 
            style={styles.loadingText}
            accessible={true}
            accessibilityLiveRegion="polite"
          >
            {loadingMessage}
          </Text>
        </View>
      );
    }

    if (!hasMore && data.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <Text 
            style={styles.endText}
            accessible={true}
            accessibilityRole="text"
          >
            You've reached the end
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderEmpty = () => {
    if (loading && data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator 
            size="large" 
            color="#2563EB"
            accessible={true}
            accessibilityLabel="Loading content"
          />
          <Text 
            style={styles.emptyText}
            accessible={true}
            accessibilityLiveRegion="polite"
          >
            Loading...
          </Text>
        </View>
      );
    }

    if (error && data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <AlertCircle size={48} color="#DC2626" />
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Retry loading content"
          >
            <RefreshCw size={20} color="#2563EB" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text 
          style={styles.emptyText}
          accessible={true}
          accessibilityRole="text"
        >
          {emptyMessage}
        </Text>
      </View>
    );
  };

  // Load More Button (Alternative to infinite scroll)
  const LoadMoreButton = () => {
    if (!hasMore || error || data.length === 0) return null;

    return (
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={handleLoadMore}
        disabled={loadingMore}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Load more items"
        accessibilityHint={`Load ${itemsPerPage} more items`}
        accessibilityState={{ disabled: loadingMore }}
      >
        {loadingMore ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.loadMoreButtonText}>Load More</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor || ((item, index) => item.id || index.toString())}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={threshold}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#2563EB']}
              tintColor="#2563EB"
              accessible={true}
              accessibilityLabel="Pull to refresh"
            />
          ) : undefined
        }
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={
          <>
            {renderFooter()}
            <LoadMoreButton />
            {ListFooterComponent}
          </>
        }
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.contentContainer,
          contentContainerStyle,
          data.length === 0 && styles.emptyContentContainer
        ]}
        showsVerticalScrollIndicator={true}
        accessible={true}
        accessibilityRole="list"
        accessibilityLabel={`List with ${data.length} items${hasMore ? ', more available' : ''}`}
        removeClippedSubviews={true}
        maxToRenderPerBatch={itemsPerPage}
        windowSize={10}
        initialNumToRender={itemsPerPage}
        getItemLayout={undefined} // Let FlatList calculate automatically for better performance
      />

      {/* Accessibility announcement for total items */}
      <View 
        style={styles.srOnly}
        accessible={true}
        accessibilityLiveRegion="polite"
      >
        <Text>
          {data.length > 0 ? `Showing ${data.length} items` : ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 8,
  },
  emptyContentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  footerContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-Medium',
  },
  endText: {
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: 'Inter-Regular',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  retryText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#DC2626',
    fontFamily: 'Inter-Medium',
  },
  retryButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2563EB',
    fontFamily: 'Inter-SemiBold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  loadMoreButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 16,
    minHeight: 48, // Minimum touch target
  },
  loadMoreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  srOnly: {
    position: 'absolute',
    left: -10000,
    width: 1,
    height: 1,
    overflow: 'hidden',
  },
});
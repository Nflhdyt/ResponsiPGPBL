import React from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ReportCard } from '@/components/reports/ReportCard';
import { useReportsFeed } from '@/hooks/useReportsFeed';
import { AppColors } from '@/constants/theme';

export default function DamagedRoadsFeedScreen() {
  const { reports, loading, refreshing, handleValidate, onRefresh } = useReportsFeed();

  if (loading) {
    return (
      <SafeAreaProvider style={{ flex: 1, backgroundColor: AppColors.background }}>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text style={styles.loadingText}>Loading road reports...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: AppColors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReportCard report={item} onValidate={handleValidate} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No road damage reports yet.</Text>
              <Text style={styles.emptySubtext}>Be the first to report!</Text>
            </View>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: AppColors.textSecondary,
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textSecondary,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
});

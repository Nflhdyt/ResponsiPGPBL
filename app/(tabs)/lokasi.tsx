import { ReportCard } from '@/components/reports/ReportCard';
import { AppColors } from '@/constants/theme';
import { useReportsFeed } from '@/hooks/useReportsFeed';
import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Use only SafeAreaView

export default function DamagedRoadsFeedScreen() {
  const { reports, loading, refreshing, handleValidate, onRefresh } = useReportsFeed();

  // Loading State
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text style={styles.loadingText}>Memuat data laporan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReportCard report={item} onValidate={handleValidate} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[AppColors.primary]} />
        }
        contentContainerStyle={styles.listContent} // Style for the inner content
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>Belum ada laporan kerusakan.</Text>
            <Text style={styles.emptySubtext}>Jadilah yang pertama melapor!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // CRITICAL: Ensure full height
    backgroundColor: AppColors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100, // Push down a bit if empty
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 100, // Extra padding at bottom for tab bar
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});
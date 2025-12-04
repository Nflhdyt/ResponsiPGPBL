import { ThemedText } from '@/components/themed-text';
import { AppColors } from '@/constants/theme';
import { useStatistics } from '@/hooks/useStatistics';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatsCard } from '@/components/statistics/StatsCard';
import { SeverityCard } from '@/components/statistics/SeverityCard';
import { EngagementCard } from '@/components/statistics/EngagementCard';

// Main component for the Statistics Screen
const StatisticsScreen = () => {
  // Fetch statistics data using the custom hook
  const { stats, loading, error } = useStatistics();

  // Display a loading indicator while data is being fetched
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <ThemedText style={{ marginTop: 12 }}>Memuat statistik...</ThemedText>
      </View>
    );
  }

  // Display an error message if fetching fails
  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <ThemedText type="subtitle">Gagal memuat data</ThemedText>
        <ThemedText>{error}</ThemedText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.headerTitle}>
          Statistik Laporan
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Ringkasan data laporan kerusakan jalan.
        </ThemedText>

        {/* --- Main Stats Grid --- */}
        <View style={styles.gridContainer}>
          <StatsCard style={styles.gridItem} title="Total Laporan" value={stats.total} icon="file-text" />
          <StatsCard style={styles.gridItem} title="Total Vote" value={stats.totalValidations} icon="check-circle" />
        </View>

        {/* --- Severity Section --- */}
        <View style={styles.sectionContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Berdasarkan Tingkat Kerusakan
          </ThemedText>
          <SeverityCard severity="Heavy" count={stats.heavy} />
          <SeverityCard severity="Medium" count={stats.medium} />
          <SeverityCard severity="Light" count={stats.light} />
        </View>

        {/* --- Engagement Section --- */}
        <View style={styles.sectionContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Engagement Komunitas
          </ThemedText>
          <EngagementCard 
            totalValidations={stats.totalValidations} 
            averageUrgency={stats.averageUrgency} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.background,
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollContent: {
    padding: 16,
  },
  headerTitle: {
    marginBottom: 4,
  },
  headerSubtitle: {
    marginBottom: 24,
    color: AppColors.textSecondary,
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  gridItem: {
    flex: 1, // Each card takes equal space
  },
  sectionContainer: {
    marginTop: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
});

export default StatisticsScreen;

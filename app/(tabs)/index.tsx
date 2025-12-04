import { ActionButtons } from '@/components/home/ActionButtons';
import { CallToActionButton } from '@/components/home/CallToActionButton';
import { Header } from '@/components/home/Header';
import { StatsGrid } from '@/components/home/StatsGrid';
import { TopReportsList } from '@/components/home/TopReportsList';
import { AppColors } from '@/constants/theme';
import { useReports } from '@/hooks/useReports';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { stats, topReports, loading } = useReports();

  if (loading) {
    return (
      <SafeAreaProvider style={{ flex: 1, backgroundColor: AppColors.background }}>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text style={styles.loadingText}>Loading Bengkulu Mulus...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: AppColors.background }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: AppColors.background }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Header />
          <CallToActionButton />
          <StatsGrid stats={stats} />
          <ActionButtons />
          <TopReportsList reports={topReports} />
        </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
});

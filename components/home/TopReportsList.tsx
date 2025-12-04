import { AppColors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Report {
  id: string;
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
  };
  severity: 'Light' | 'Medium' | 'Heavy';
  description: string;
  voteCount: number;
  urgencyScore?: number;
}

interface TopReportsListProps {
  reports: Report[];
}

const getSeverityColor = (severity: string): string => {
    switch (severity) {
        case 'Heavy':
            return '#FF0000';
        case 'Medium':
            return '#FFA500';
        case 'Light':
            return '#FFFF00';
        default:
            return '#808080';
    }
};

export const TopReportsList: React.FC<TopReportsListProps> = ({ reports }) => {
  const router = useRouter();

    const renderReportItem = ({ item, index }: { item: Report; index: number }) => (
        <TouchableOpacity style={styles.urgentCard} onPress={() => router.push('/(tabs)/lokasi')}>
            <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
            <View style={styles.urgentCardContent}>
                <Image source={{ uri: item.imageUrl }} style={styles.urgentCardImage} resizeMode="cover" />
                <View style={styles.urgentCardInfo}>
                    <View style={styles.urgentCardHeader}>
                        <View style={styles.severityContainer}>
                            <MaterialCommunityIcons name="circle" size={12} color={getSeverityColor(item.severity)} />
                            <Text style={styles.urgentCardTitle}>{item.severity}</Text>
                        </View>
                        <View style={[styles.urgencySeverityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
                            <Text style={styles.urgencySeverityText}>{item.urgencyScore ?? 0}</Text>
                        </View>
                    </View>
                    <Text style={styles.urgentCardDescription} numberOfLines={2}>
                        {item.description}
                    </Text>
                    <View style={styles.urgentCardFooter}>
                        <View style={styles.locationContainer}>
                            <MaterialCommunityIcons name="map-marker-outline" size={14} color={AppColors.textSecondary} />
                            <Text style={styles.urgentCardLocation}>
                              {item.location?.lat ? (item.location.lat).toFixed(4) : 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.voteBadge}>
                            <MaterialCommunityIcons name="thumb-up-outline" size={12} color="#fff" style={{ marginRight: 4 }} />
                            <Text style={styles.voteBadgeText}>{item.voteCount || 0}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

  return (
    <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
                <MaterialCommunityIcons name="fire" size={24} color={AppColors.primary} />
                <Text style={styles.sectionTitle}>Top Priority</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/lokasi')}>
                <Text style={styles.seeAllLink}>See All →</Text>
            </TouchableOpacity>
        </View>

        {reports.length > 0 ? (
            <FlatList
                data={reports}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={renderReportItem}
            />
        ) : (
            <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No reports yet</Text>
                <Text style={styles.emptyStateSubtext}>Be the first to report!</Text>
            </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: AppColors.textPrimary,
        marginLeft: 8,
    },
    seeAllLink: {
        color: AppColors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    urgentCard: {
        backgroundColor: AppColors.surface,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: AppColors.border,
    },
    rankBadge: {
        position: 'absolute',
        left: 8,
        top: 8,
        backgroundColor: AppColors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        zIndex: 2,
    },
    rankText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    urgentCardContent: {
        flex: 1,
        flexDirection: 'row',
    },
    urgentCardImage: {
        width: 100,
        height: 100,
    },
    urgentCardInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    urgentCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    severityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    urgentCardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: AppColors.textPrimary,
        marginLeft: 8,
    },
    urgencySeverityBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    urgencySeverityText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    urgentCardDescription: {
        fontSize: 12,
        color: AppColors.textSecondary,
        marginVertical: 4,
    },
    urgentCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    urgentCardLocation: {
        fontSize: 12,
        color: AppColors.textSecondary,
        marginLeft: 4,
    },
    voteBadge: {
        backgroundColor: AppColors.primary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    voteBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: AppColors.surface,
        borderRadius: 12,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        color: AppColors.textSecondary,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: AppColors.textSecondary,
    },
});

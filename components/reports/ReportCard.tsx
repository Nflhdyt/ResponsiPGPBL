import { AppColors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

interface ReportCardProps {
  report: Report;
  onValidate: (reportId: string, currentVotes: number) => void;
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

export const ReportCard: React.FC<ReportCardProps> = ({ report, onValidate }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: report.imageUrl }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(report.severity) }]}>
          <Text style={styles.severityBadgeText}>{report.severity}</Text>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.cardTitle} numberOfLines={1}>Road Damage Report</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {report.description}
        </Text>
        <View style={styles.locationRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={14} color={AppColors.textSecondary} />
          <Text style={styles.locationText}>
            {(report.location?.lat || 0).toFixed(4)}, {(report.location?.lng || 0).toFixed(4)}
          </Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Validations</Text>
            <Text style={styles.statValue}>{report.voteCount || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Urgency</Text>
            <Text style={styles.statValue}>{report.urgencyScore ?? 0}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.validateButton}
          onPress={() => onValidate(report.id, report.voteCount)}
        >
          <MaterialCommunityIcons name="thumb-up-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.validateButtonText}>Validate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: AppColors.surface,
      borderRadius: 12,
      marginVertical: 8,
      marginHorizontal: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: AppColors.border,
    },
    imageContainer: {
        width: 120,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    severityBadge: {
      position: 'absolute',
      top: 8,
      left: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    severityBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    detailsContainer: {
        flex: 1,
        padding: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: AppColors.textPrimary,
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 12,
        color: AppColors.textSecondary,
        marginBottom: 8,
        lineHeight: 16,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationText: {
        fontSize: 12,
        color: AppColors.textSecondary,
        marginLeft: 4,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: AppColors.textSecondary,
    },
    statValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: AppColors.primary,
    },
    validateButton: {
      backgroundColor: AppColors.primary,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      paddingHorizontal: 12,
    },
    validateButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '700',
    },
});

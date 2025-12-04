import { AppColors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Report {
  id: string;
  imageUrl: string;
  location: {
    latitude?: number; // Changed to optional to handle different data shapes
    longitude?: number;
    lat?: number; // Support legacy lat/lng
    lng?: number;
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

// Updated colors to match Heatmap Legend
const getSeverityColor = (severity: string): string => {
    switch (severity) {
        case 'Heavy':
            return '#FF3B30'; // Red
        case 'Medium':
            return '#FF9500'; // Orange
        case 'Light':
            return '#FFCC00'; // Yellow
        default:
            return '#808080';
    }
};

export const ReportCard: React.FC<ReportCardProps> = ({ report, onValidate }) => {
  // Safe location access
  const lat = report.location?.latitude ?? report.location?.lat ?? 0;
  const lng = report.location?.longitude ?? report.location?.lng ?? 0;

  return (
    <View style={styles.card}>
      {/* Full Width Image */}
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

      {/* Details Below Image */}
      <View style={styles.detailsContainer}>
        <View style={styles.headerRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>Laporan Kerusakan</Text>
            <Text style={styles.dateText}>Baru Saja</Text>
        </View>
        
        <Text style={styles.cardDescription} numberOfLines={2}>
          {report.description}
        </Text>

        <View style={styles.locationRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={16} color={AppColors.textSecondary} />
          <Text style={styles.locationText}>
            {lat.toFixed(5)}, {lng.toFixed(5)}
          </Text>
        </View>

        <View style={styles.footerRow}>
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <MaterialCommunityIcons name="thumb-up" size={14} color={AppColors.primary} />
                    <Text style={styles.statValue}>{report.voteCount || 0}</Text>
                </View>
                <View style={styles.statItem}>
                    <MaterialCommunityIcons name="alert-circle" size={14} color="#FF9500" />
                    <Text style={styles.statValue}>{report.urgencyScore ?? 0}</Text>
                </View>
            </View>

            <TouchableOpacity
            style={styles.validateButton}
            onPress={() => onValidate(report.id, report.voteCount)}
            >
            <Text style={styles.validateButtonText}>Validasi</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    card: {
      backgroundColor: AppColors.surface,
      borderRadius: 16,
      marginBottom: 16, // Space between cards
      marginHorizontal: 20, // Side margins
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#F0F0F0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    imageContainer: {
        width: '100%',
        height: 180, // Taller image
        backgroundColor: '#F5F5F5',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    severityBadge: {
      position: 'absolute',
      top: 12,
      left: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
    },
    severityBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    detailsContainer: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    dateText: {
        fontSize: 12,
        color: '#999',
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#F9F9F9',
        padding: 8,
        borderRadius: 8,
    },
    locationText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 6,
        fontFamily: 'monospace', // Monospace for coords
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#999',
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    validateButton: {
        backgroundColor: AppColors.primary,
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    validateButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
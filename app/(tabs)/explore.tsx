import React from 'react';
import { ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Send, Star, Map, BarChart2, ThumbsUp, FileText, Gift, Phone } from 'lucide-react-native';
import { AppColors } from '@/constants/theme';
import { GuideSection } from '@/components/explore/GuideSection';
import { FeatureCard } from '@/components/explore/FeatureCard';
import { TipCard } from '@/components/explore/TipCard';
import { ContactCard } from '@/components/explore/ContactCard';

export default function ExploreScreen() {
  const howToStartTips = [
    "Tekan tombol 'Lapor' untuk mengambil foto kerusakan. Lokasi Anda akan terdeteksi secara otomatis.",
    "Pilih tingkat keparahan: Ringan, Sedang, atau Berat untuk membantu prioritas perbaikan.",
    "Jelaskan detail kondisi seperti lubang atau retakan agar petugas lebih mudah memahami masalah.",
  ];

  const features = [
    {
      icon: Map,
      title: 'Heat Map',
      description: 'Visualisasi area dengan konsentrasi kerusakan tinggi.',
    },
    {
      icon: BarChart2,
      title: 'Analytics',
      description: 'Statistik kerusakan jalan berdasarkan tingkat keparahan.',
    },
    {
      icon: ThumbsUp,
      title: 'Validasi Laporan',
      description: 'Validasi laporan lain untuk meningkatkan prioritasnya.',
    },
    {
      icon: FileText,
      title: 'Feed Laporan',
      description: 'Lihat semua laporan kerusakan terurut berdasarkan urgensi.',
    },
  ];

  const tips = [
    'Ambil foto berkualitas dengan pencahayaan yang baik.',
    'Sertakan landmark atau nama jalan dalam deskripsi.',
    'Validasi laporan lain untuk membantu pengambilan keputusan.',
  ];

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: AppColors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Panduan Pengguna</Text>
            <Text style={styles.headerSubtitle}>Tips & Trik untuk aplikasi Bengkulu Mulus</Text>
          </View>

          <GuideSection title="Cara Memulai" icon={Send}>
            {howToStartTips.map((tip, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>{index + 1}.</Text>
                <Text style={styles.cardText}>{tip}</Text>
              </View>
            ))}
          </GuideSection>

          <GuideSection title="Fitur Utama" icon={Star}>
            <View style={styles.card}>
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </View>
          </GuideSection>

          <GuideSection title="Tips & Trik" icon={Gift}>
            <TipCard tips={tips} />
          </GuideSection>

          <GuideSection title="Hubungi Kami" icon={Phone}>
            <ContactCard />
          </GuideSection>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: AppColors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 20,
  },
});

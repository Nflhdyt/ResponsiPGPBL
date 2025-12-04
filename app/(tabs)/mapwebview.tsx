import { FAB } from '@/components/ui/FAB';
import { AppColors } from '@/constants/theme';
import { db } from '@/firebaseConfig'; // Database kamu
import { useMapReports } from '@/hooks/useMapReports';
import { useRouter } from 'expo-router'; // Buat navigasi
import { deleteDoc, doc } from 'firebase/firestore'; // Buat hapus data
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

// Pastikan path ini benar sesuai struktur folder kamu
const mapHtml = require('../../assets/images/html/map.html');

export default function MapScreen() {
  const webViewRef = useRef<WebView>(null);
  
  // Pastikan hook useMapReports kamu sudah meng-return 'refetch'
  const { reports, loading, refetch } = useMapReports(); 
  const router = useRouter();

  // Fungsi untuk menyuntikkan data marker ke HTML
  const updateMapMarkers = () => {
    if (webViewRef.current && reports.length > 0) {
      const script = `addMarkersToMap(${JSON.stringify(reports)});`;
      webViewRef.current.injectJavaScript(script);
    }
  };

  // Update marker setiap kali data reports berubah
  useEffect(() => {
    updateMapMarkers();
  }, [reports]);

  // --- FUNGSI UTAMA: MENANGANI KLIK TOMBOL DARI HTML ---
  const handleWebViewMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data); // Baca data { type, id }
      
      if (data.type === 'DELETE') {
        // Logika Hapus dengan Konfirmasi
        Alert.alert(
            "Konfirmasi Hapus",
            "Yakin ingin menghapus laporan ini?",
            [
                { text: "Batal", style: "cancel" },
                { 
                    text: "Hapus", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            // 1. Hapus dari Firestore
                            await deleteDoc(doc(db, "reports", data.id));
                            Alert.alert("Sukses", "Laporan berhasil dihapus.");
                            
                            // 2. Refresh Data & Peta
                            if (refetch) {
                                refetch(); 
                            } else {
                                console.warn("Fungsi refetch belum ada di hook useMapReports!");
                            }
                            
                        } catch (error) {
                            console.error(error);
                            Alert.alert("Error", "Gagal menghapus data.");
                        }
                    }
                }
            ]
        );
      } 
      
      else if (data.type === 'EDIT') {
        // Logika Edit -> Cuma Alert dulu (nanti bisa diarahkan ke form edit)
        Alert.alert("Info", "Fitur Edit ID: " + data.id);
        
        // Contoh kalau mau pindah ke halaman form:
        // router.push({ pathname: "/forminputlocation", params: { id: data.id, isEdit: 'true' } });
      }

    } catch (e) {
      console.log("Error parsing message from WebView", e);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.webview}
        source={mapHtml}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        // Saat loading selesai, injek data marker
        onLoadEnd={updateMapMarkers}
        // PENTING: Menerima pesan dari tombol HTML
        onMessage={handleWebViewMessage} 
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={AppColors.primary || '#FF3B30'} />
        </View>
      )}

      <FAB />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },
});
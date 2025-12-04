import { db } from '@/firebaseConfig';
import { useMapReports } from '@/hooks/useMapReports';
import { useFocusEffect, useRouter } from 'expo-router';
import { deleteDoc, doc } from 'firebase/firestore';
import { RefreshCw } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

const mapHtml = require('../../assets/images/html/map.html');

export default function MapScreen() {
  const webViewRef = useRef<WebView>(null);
  const { reports, loading, refetch } = useMapReports(); 
  const router = useRouter();
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. AUTO REFRESH (Ringan)
  useFocusEffect(
    useCallback(() => {
      if (refetch) refetch();
    }, [])
  );

  // 2. LOGIC UPDATE MARKER (Cerdas)
  const updateMapMarkers = () => {
    // Kita kirim data reports terbaru ke HTML
    // Walaupun data kosong [], dia akan otomatis menghapus semua marker lama
    if (webViewRef.current && reports) {
      const script = `addMarkersToMap(${JSON.stringify(reports)});`;
      webViewRef.current.injectJavaScript(script);
    }
  };

  // Jalan otomatis saat data reports berubah
  useEffect(() => {
    updateMapMarkers();
  }, [reports]);

  // 3. MANUAL REFRESH (OPTIMASI: SOFT REFRESH)
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    
    // --- PERBAIKAN DISINI ---
    // Jangan pakai reload()! Itu bikin berat dan layar putih.
    // Cukup tarik data baru, nanti useEffect di atas akan otomatis update gambarnya.
    
    if (refetch) {
        try {
            await refetch(); // Tunggu data baru
            // updateMapMarkers(); // Opsional, karena useEffect sudah menanganinya
            Alert.alert("Sukses", "Data peta berhasil diperbarui (Mode Ringan).");
        } catch (e) {
            Alert.alert("Gagal", "Tidak bisa memperbarui data.");
        }
    }
    
    setIsRefreshing(false);
  };

  const handleWebViewMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data); 
      
      if (data.type === 'DELETE') {
        Alert.alert(
            "Konfirmasi Hapus",
            "Laporan akan dihapus permanen.",
            [
                { text: "Batal", style: "cancel" },
                { 
                    text: "Hapus", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "reports", data.id));
                            if (refetch) await refetch();
                            Alert.alert("Sukses", "Marker dihapus.");
                        } catch (error) {
                            Alert.alert("Error", "Gagal menghapus data.");
                        }
                    }
                }
            ]
        );
      } 
      else if (data.type === 'EDIT') {
        router.push({ 
            pathname: "/formeditlocation", 
            params: { id: data.id } 
        });
      }

    } catch (e) {
      console.log("Error parsing message", e);
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
        onLoadEnd={updateMapMarkers}
        onMessage={handleWebViewMessage} 
      />

      {(loading || isRefreshing) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={'#FF3B30'} />
        </View>
      )}

      {/* Tombol Refresh Biru */}
      <TouchableOpacity 
        style={styles.refreshButton} 
        onPress={handleManualRefresh}
        activeOpacity={0.8}
      >
        <RefreshCw size={24} color="#FFFFFF" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Transparansi lebih tinggi biar gak ganggu
    justifyContent: 'center', alignItems: 'center', zIndex: 20,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, shadowRadius: 4, zIndex: 10,
  }
});
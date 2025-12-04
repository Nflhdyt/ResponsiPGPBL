import { FAB } from '@/components/ui/FAB';
import { db } from '@/firebaseConfig';
import { useMapReports } from '@/hooks/useMapReports';
import { useFocusEffect, useRouter } from 'expo-router';
import { deleteDoc, doc } from 'firebase/firestore';
import React, { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const mapHtml = require('../../assets/images/html/map.html');

export default function MapScreen() {
  const webViewRef = useRef<WebView>(null);
  const { reports, loading, refetch } = useMapReports(); 
  const router = useRouter();

  // 1. AUTO REFRESH SAAT LAYAR DIBUKA KEMBALI
  useFocusEffect(
    useCallback(() => {
      console.log("Layar Peta Fokus -> Refresh Data...");
      if (refetch) refetch();
    }, []) 
  );

  // 2. FUNGSI UPDATE MARKER
  const updateMapMarkers = () => {
    if (webViewRef.current && reports) {
      const script = `addMarkersToMap(${JSON.stringify(reports)});`;
      webViewRef.current.injectJavaScript(script);
    }
  };

  // Update otomatis setiap kali data berubah
  useEffect(() => {
    updateMapMarkers();
  }, [reports]);

  const handleWebViewMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data); 
      
      if (data.type === 'DELETE') {
        // --- LOGIKA DELETE ---
        Alert.alert(
            "Hapus Laporan?",
            "Yakin ingin menghapus laporan ini?",
            [
                { text: "Batal", style: "cancel" },
                { 
                    text: "Hapus", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "reports", data.id));
                            if (refetch) {
                                await refetch();
                                Alert.alert("Sukses", "Marker dihapus dari peta.");
                            }
                        } catch (error) {
                            Alert.alert("Error", "Gagal menghapus data.");
                        }
                    }
                }
            ]
        );
      } 
      else if (data.type === 'EDIT') {
        console.log("Navigasi ke Form Edit ID:", data.id);
        
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

      {loading && (
        <View style={styles.loadingOverlay}>
          {}
          <ActivityIndicator size="large" color={'#FF3B30'} />
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
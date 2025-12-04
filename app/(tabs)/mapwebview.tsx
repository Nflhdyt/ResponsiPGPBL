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

  // Auto Refresh
  useFocusEffect(
    useCallback(() => {
      if (refetch) refetch();
    }, [])
  );

  // Update Peta
  const updateMapMarkers = () => {
    if (webViewRef.current && reports) {
        const script = `addMarkersToMap(${JSON.stringify(reports)});`;
        webViewRef.current.injectJavaScript(script);
    }
  };

  useEffect(() => { updateMapMarkers(); }, [reports]);

  // Refresh Manual
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    if (webViewRef.current) webViewRef.current.reload(); 
    if (refetch) {
        refetch().finally(() => setTimeout(() => setIsRefreshing(false), 1500));
    }
  };

  // --- HANDLE PESAN DARI HTML ---
  const handleWebViewMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data); 
      
      if (data.type === 'DELETE') {
        Alert.alert("Hapus Laporan?", "Yakin?", [
            { text: "Batal", style: "cancel" },
            { 
                text: "Hapus", style: "destructive", 
                onPress: async () => {
                    try {
                        await deleteDoc(doc(db, "reports", data.id));
                        if (refetch) await refetch();
                        Alert.alert("Sukses", "Terhapus.");
                    } catch (e) { Alert.alert("Error", "Gagal hapus."); }
                }
            }
        ]);
      } 
      else if (data.type === 'EDIT') {
        // CEK DULU ID NYA ADA GAK
        if (!data.id) {
            Alert.alert("Error", "ID Laporan tidak terbaca dari peta.");
            return;
        }

        console.log("Navigasi ke Form Edit dengan ID:", data.id);
        
        // Pindah ke Form Edit
        router.push({ 
            pathname: "/formeditlocation", 
            params: { id: data.id } 
        });
      }
    } catch (e) { console.log("Error msg:", e); }
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
        onLoadEnd={() => { if(reports) updateMapMarkers(); }}
        onMessage={handleWebViewMessage} 
      />
      {(loading || isRefreshing) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={'#FF3B30'} />
        </View>
      )}
      <TouchableOpacity style={styles.refreshButton} onPress={handleManualRefresh} activeOpacity={0.8}>
        <RefreshCw size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 20 },
  refreshButton: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', elevation: 6, zIndex: 10 }
});
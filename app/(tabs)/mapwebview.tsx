import { db } from '@/firebaseConfig';
import { useMapReports } from '@/hooks/useMapReports';
import { useFocusEffect, useRouter } from 'expo-router';
import { deleteDoc, doc } from 'firebase/firestore';
import { RefreshCw } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
// 1. IMPORT CUSTOM ALERT
import { CustomAlert } from '@/components/ui/CustomAlert';

const mapHtml = require('../../assets/images/html/map.html');

export default function MapScreen() {
  const webViewRef = useRef<WebView>(null);
  const { reports, loading, refetch } = useMapReports(); 
  const router = useRouter();
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 2. STATE UNTUK ALERT
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'warning', // 'warning' | 'success' | 'delete' | 'error'
    title: '',
    message: '',
    onConfirm: () => {},
    showCancel: false, // Untuk tombol batal
  });
  const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (refetch) refetch();
    }, [])
  );

  const updateMapMarkers = () => {
    if (webViewRef.current && reports) {
        const script = `addMarkersToMap(${JSON.stringify(reports)});`;
        webViewRef.current.injectJavaScript(script);
    }
  };

  useEffect(() => { updateMapMarkers(); }, [reports]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    if (webViewRef.current) webViewRef.current.reload(); 
    if (refetch) {
        refetch().finally(() => setTimeout(() => setIsRefreshing(false), 1500));
    }
  };

  // --- FUNGSI EKSEKUTOR HAPUS ---
  const executeDelete = async () => {
    // Tutup alert konfirmasi
    setAlertConfig(prev => ({ ...prev, visible: false }));
    
    if (!targetDeleteId) return;

    try {
        await deleteDoc(doc(db, "reports", targetDeleteId));
        if (refetch) await refetch();
        
        // Tampilkan Alert Sukses (Ganteng)
        setTimeout(() => {
            setAlertConfig({
                visible: true,
                type: 'success',
                title: 'Terhapus!',
                message: 'Laporan berhasil dihapus dari peta.',
                showCancel: false,
                onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false }))
            });
        }, 500);

    } catch (error) {
        console.log("Gagal hapus");
    }
  };

  const handleWebViewMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data); 
      
      if (data.type === 'DELETE') {
        // --- 3. GANTI ALERT DELETE BAWAAN ---
        setTargetDeleteId(data.id);
        setAlertConfig({
            visible: true,
            type: 'delete',
            title: 'Hapus Laporan?',
            message: 'Yakin ingin menghapus laporan ini secara permanen?',
            showCancel: true,
            onConfirm: executeDelete
        });
      } 
      else if (data.type === 'EDIT') {
        router.push({ 
            pathname: "/formeditlocation", 
            params: { id: data.id } 
        });
      }

    } catch (e) {
      console.log("Msg Error", e);
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

      {/* --- 4. PASANG KOMPONEN CUSTOM ALERT --- */}
      <CustomAlert 
        visible={alertConfig.visible}
        type={alertConfig.type as any}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.showCancel ? () => setAlertConfig(prev => ({ ...prev, visible: false })) : undefined}
        confirmText={alertConfig.type === 'delete' ? 'Ya, Hapus' : 'OK'}
        cancelText="Batal"
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 255, 255, 0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 20 },
  refreshButton: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', elevation: 6, zIndex: 10 }
});
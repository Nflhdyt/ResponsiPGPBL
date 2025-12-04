import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const AppColors = { primary: '#FF3B30', background: '#FFFFFF', surface: '#FFFFFF', textPrimary: '#000000', textOnPrimary: '#FFFFFF', border: '#E0E0E0', error: '#FF3B30' };

const LocationPicker = () => {
  const router = useRouter();
  // Receive 'savedImage' parameter
  const params = useLocalSearchParams();
  
  const webViewRef = useRef<WebView>(null);
  const [currentMapCenter, setCurrentMapCenter] = useState<{ lat: number; lng: number }>({ lat: -3.7956, lng: 102.2695 });
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [initialLat, setInitialLat] = useState<number>(-3.7956);
  const [initialLng, setInitialLng] = useState<number>(102.2695);

  useEffect(() => {
    const lat = parseFloat(params.latitude as string ?? '0');
    const lng = parseFloat(params.longitude as string ?? '0');
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      setInitialLat(lat);
      setInitialLng(lng);
      setCurrentMapCenter({ lat, lng });
    }
  }, [params.latitude, params.longitude]);

  const generateHtml = (lat: number, lng: number) => `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" /><style>body{margin:0;height:100vh;}#map{width:100%;height:100%;}</style></head><body><div id="map"></div><script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script><script>var map=L.map('map',{zoomControl:false}).setView([${lat},${lng}],15);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);map.on('load',function(){window.ReactNativeWebView.postMessage(JSON.stringify({type:'mapLoaded',lat:map.getCenter().lat,lng:map.getCenter().lng}));});map.on('moveend',function(){var c=map.getCenter();window.ReactNativeWebView.postMessage(JSON.stringify({type:'centerChange',lat:c.lat,lng:c.lng}));});setTimeout(function(){map.invalidateSize();},100);</script></body></html>`;

  const onMessage = (event: any) => {
    try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'mapLoaded' || data.type === 'centerChange') {
          setCurrentMapCenter({ lat: data.lat, lng: data.lng });
          setIsMapLoaded(true);
        }
    } catch (e) {}
  };

  // --- CONFIRMATION LOGIC (UPDATED: RETURN IMAGE) ---
  const handleConfirmLocation = () => {
    // Prepare data to return
    const returnParams: any = {
        latitude: currentMapCenter.lat.toString(),
        longitude: currentMapCenter.lng.toString(),
        // IMPORTANT: Return the saved image!
        savedImage: params.savedImage 
    };

    if (params.returnTo === 'edit') {
        router.replace({
            pathname: "/formeditlocation",
            params: {
                ...returnParams,
                id: params.editId 
            },
        });
    } else {
        router.replace({
            pathname: "/forminputlocation",
            params: returnParams,
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Pilih Lokasi', headerBackTitle: 'Kembali' }} />
      <View style={styles.mapViewContainer}>
        <WebView ref={webViewRef} originWhitelist={['*']} source={{ html: generateHtml(initialLat, initialLng) }} javaScriptEnabled={true} onMessage={onMessage} style={styles.webView} />
        {isMapLoaded && <View style={styles.fixedPin} pointerEvents="none"><Feather name="map-pin" size={40} color={AppColors.error} /></View>}
        {!isMapLoaded && <View style={styles.loadingOverlay}><ActivityIndicator size="large" color={AppColors.primary} /><Text style={styles.loadingText}>Memuat peta...</Text></View>}
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleConfirmLocation}><Text style={styles.buttonText}>Konfirmasi Lokasi</Text></Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background },
  mapViewContainer: { flex: 1, position: 'relative' },
  webView: { flex: 1 },
  fixedPin: { position: 'absolute', top: '50%', left: '50%', marginLeft: -20, marginTop: -40, zIndex: 1 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: AppColors.background, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  loadingText: { marginTop: 10, color: AppColors.textPrimary },
  buttonContainer: { padding: 20, backgroundColor: AppColors.surface, borderTopWidth: 1, borderTopColor: AppColors.border },
  button: { backgroundColor: AppColors.primary, padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: AppColors.textOnPrimary, fontSize: 16, fontWeight: 'bold' },
});

export default LocationPicker;
import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { AppColors } from '@/constants/theme';

// This is the component for the map picker screen using Leaflet in a WebView.
const LocationPicker = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ latitude?: string; longitude?: string }>();
  
  const webViewRef = useRef<WebView>(null);

  const [initialLat, setInitialLat] = useState<number>(-7.7956); // Default: Yogyakarta
  const [initialLng, setInitialLng] = useState<number>(110.3695);
  const [currentMapCenter, setCurrentMapCenter] = useState<{ lat: number; lng: number }>({
    lat: -7.7956,
    lng: 110.3695,
  });
  const [isMapLoaded, setIsMapLoaded] = useState(false);


  useEffect(() => {
    // Set the initial map region based on parameters passed from the previous screen
    const lat = parseFloat(params.latitude ?? '0');
    const lng = parseFloat(params.longitude ?? '0');

    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      setInitialLat(lat);
      setInitialLng(lng);
      setCurrentMapCenter({ lat, lng });
    }
  }, [params.latitude, params.longitude]);

  // HTML content for the WebView, embedding Leaflet.js
  const generateHtml = (lat: number, lng: number) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>Leaflet Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <style>
            body { margin: 0; padding: 0; height: 100vh; width: 100vw; overflow: hidden; }
            #map { width: 100%; height: 100%; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <script>
            var map = L.map('map', { zoomControl: false }).setView([${lat}, ${lng}], 15);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            map.on('load', function() {
                // Initial center when map is fully loaded
                var center = map.getCenter();
                window.ReactNativeWebView.postMessage(JSON.stringify({ 
                    type: 'mapLoaded', 
                    lat: center.lat, 
                    lng: center.lng 
                }));
            });

            map.on('moveend', function() {
                var center = map.getCenter();
                window.ReactNativeWebView.postMessage(JSON.stringify({ 
                    type: 'centerChange', 
                    lat: center.lat, 
                    lng: center.lng 
                }));
            });

            // Post current center continuously while moving (optional, for finer updates)
            // map.on('move', function() {
            //     var center = map.getCenter();
            //     window.ReactNativeWebView.postMessage(JSON.stringify({ 
            //         type: 'centerMoving', 
            //         lat: center.lat, 
            //         lng: center.lng 
            //     }));
            // });

            // Make sure the map resizes correctly within the WebView
            setTimeout(function () {
                map.invalidateSize();
            }, 100);
        </script>
    </body>
    </html>
  `;

  // Handle messages coming from the WebView (Leaflet map)
  const onMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'mapLoaded' || data.type === 'centerChange') {
      setCurrentMapCenter({ lat: data.lat, lng: data.lng });
      setIsMapLoaded(true);
    }
  };

  const handleConfirmLocation = () => {
    // Navigate back to the form screen with the selected coordinates
    router.replace({
      pathname: '/forminputlocation',
      params: {
        latitude: currentMapCenter.lat.toString(),
        longitude: currentMapCenter.lng.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Pilih Lokasi dari Peta' }} />
      
      {/* Map Container */}
      <View style={styles.mapViewContainer}>
        {/* WebView rendering the Leaflet map */}
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: generateHtml(initialLat, initialLng) }}
          javaScriptEnabled={true}
          onMessage={onMessage}
          style={styles.webView}
          onLoadEnd={() => console.log("WebView loaded")}
          onError={(syntheticEvent) => console.error('WebView error: ', syntheticEvent.nativeEvent)}
        />
        
        {/* Fixed Pin Marker in the center */}
        {isMapLoaded && (
          <View style={styles.fixedPin} pointerEvents="none">
            <Feather name="map-pin" size={40} color={AppColors.error} />
          </View>
        )}

        {!isMapLoaded && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={AppColors.primary} />
            <Text style={styles.loadingText}>Memuat peta...</Text>
          </View>
        )}
      </View>

      {/* Confirmation Button */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleConfirmLocation}>
          <Text style={styles.buttonText}>Konfirmasi Lokasi</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  mapViewContainer: {
    flex: 1,
    position: 'relative', // Needed for absolute positioning of the pin
  },
  webView: {
    flex: 1,
  },
  fixedPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    // Adjust these based on the icon's size to perfectly center it
    marginLeft: -20, // Half of icon width (40/2)
    marginTop: -40, // Icon height (40) if anchor is bottom-center, or -20 for center
    zIndex: 1, // Ensure pin is above the map
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Ensure loading overlay is on top
  },
  loadingText: {
    marginTop: 10,
    color: AppColors.textPrimary,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: AppColors.surface,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  button: {
    backgroundColor: AppColors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: AppColors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LocationPicker;

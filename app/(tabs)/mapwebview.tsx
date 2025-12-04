import { FAB } from '@/components/ui/FAB';
import { AppColors } from '@/constants/theme';
import { useMapReports } from '@/hooks/useMapReports';
import React, { useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const mapHtml = require('../../assets/images/html/map.html');

export default function MapScreen() {
  const webViewRef = useRef<WebView>(null);
  const { reports, loading } = useMapReports();

  const injectDataIntoWebView = () => {
    if (webViewRef.current && reports.length > 0) {
      const script = `addMarkersToMap(${JSON.stringify(reports)});`;
      webViewRef.current.injectJavaScript(script);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.webview}
        source={mapHtml}
        javaScriptEnabled={true}
        onLoadEnd={injectDataIntoWebView}
        originWhitelist={['*']}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={AppColors.primary} />
        </View>
      )}

      <FAB />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
import { DetailsCard } from '@/components/form/DetailsCard';
import { ImagePickerCard } from '@/components/form/ImagePickerCard';
import { LocationCard } from '@/components/form/LocationCard';
import { SubmitButton } from '@/components/form/SubmitButton';
import { globalStyles } from '@/constants/styles';
import { db } from '@/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const AppColors = { primary: '#FF3B30', background: '#FFFFFF', surface: '#FFFFFF', textPrimary: '#000000', textSecondary: '#666666' };
const CLOUD_NAME = 'ddlxrhe9n';
const UPLOAD_PRESET = 'bengkulu';
const API_KEY = '737357581632975';

const FormEditLocationScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'Light' | 'Medium' | 'Heavy'>('Medium');
  const [isLoading, setIsLoading] = useState(false);
  
  const [editId, setEditId] = useState<string | null>(null);

  const router = useRouter();
  const params = useLocalSearchParams();

  // --- OPTIMASI GAMBAR (Agar Load Cepat) ---
  const getOptimizedUrl = (url: string | null) => {
    if (!url) return null;
    // Jika url dari Cloudinary, kita minta versi kecil (width 600, quality auto)
    if (url.includes('cloudinary.com') && !url.includes('w_600')) {
        return url.replace('/upload/', '/upload/w_600,q_auto,f_auto/');
    }
    return url;
  };

  // --- 1. LOGIC CERDAS LOAD DATA ---
  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    if (id) {
      if (id !== editId) {
          setEditId(id);
          const hasNewLocation = params.latitude && params.longitude;
          fetchReportData(id, !!hasNewLocation);
      }
    }
    
    if (params.latitude && params.longitude) {
      setLatitude(params.latitude as string);
      setLongitude(params.longitude as string);
    }
  }, [params.id, params.latitude, params.longitude]);

  const fetchReportData = async (id: string, skipLocation: boolean) => {
    setIsLoading(true);
    try {
      const docSnap = await getDoc(doc(db, 'reports', id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        setImageUri(data.imageUrl); // Simpan URL asli di state
        setDescription(data.description || '');
        setSeverity(data.severity || 'Medium');

        if (!skipLocation) {
            if (data.location?.latitude) {
                setLatitude(String(data.location.latitude));
                setLongitude(String(data.location.longitude));
            } else {
                setLatitude(String(data.latitude || ''));
                setLongitude(String(data.longitude || ''));
            }
        }
      } else {
        Alert.alert("Error", "Data tidak ditemukan.");
        router.back();
      }
    } catch (error) {
      Alert.alert("Error", "Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  const pickImageFromGallery = async () => {
    try { const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.3, aspect: [4, 3], allowsEditing: true }); if (!r.canceled) setImageUri(r.assets[0].uri); } catch (e) {}
  };
  
  const getMyLocation = async () => {
    setIsLoading(true); try { const {status} = await Location.requestForegroundPermissionsAsync(); if (status!=='granted') return; const l = await Location.getCurrentPositionAsync({}); setLatitude(String(l.coords.latitude)); setLongitude(String(l.coords.longitude)); } catch(e){} finally{setIsLoading(false);}
  };
  
  const openMapPicker = () => {
    router.replace({ 
        pathname: '/LocationPicker', 
        params: { latitude, longitude, returnTo: 'edit', editId: editId } 
    });
  };

  const uploadImageToCloudinary = async (uri: string) => {
    if (uri.startsWith('http')) return uri;
    const fd = new FormData(); fd.append('file', { uri, type: 'image/jpeg', name: 'up.jpg' } as any); fd.append('upload_preset', UPLOAD_PRESET); fd.append('cloud_name', CLOUD_NAME); fd.append('api_key', API_KEY);
    const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd }); const d = await r.json(); return d.secure_url;
  };

  const handleUpdate = async () => {
    if (!editId) return Alert.alert("Error", "ID Hilang.");
    setIsLoading(true);
    try {
      const url = await uploadImageToCloudinary(imageUri || '');
      await updateDoc(doc(db, 'reports', editId), {
        imageUrl: url,
        location: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        severity, description, timestamp: new Date()
      });
      
      Alert.alert('Sukses', 'Data berhasil diperbarui!', [
          { text: 'OK', onPress: () => router.navigate('/(tabs)/mapwebview') }
      ]);
    } catch (error: any) { Alert.alert('Gagal', error.message); } finally { setIsLoading(false); }
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: AppColors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen options={{ title: 'Edit Laporan', headerStyle: { backgroundColor: AppColors.surface }, headerTintColor: AppColors.textPrimary }} />
        <ScrollView contentContainerStyle={globalStyles.container}>
          {/* TAMPILKAN GAMBAR VERSI RINGAN (OPTIMIZED) */}
          <ImagePickerCard 
            imageUri={getOptimizedUrl(imageUri)} 
            onPress={pickImageFromGallery} 
            isLoading={isLoading} 
          />
          <LocationCard latitude={latitude} longitude={longitude} onLatitudeChange={setLatitude} onLongitudeChange={setLongitude} onGetLocation={getMyLocation} onOpenMapPicker={openMapPicker} isLoading={isLoading} />
          <DetailsCard severity={severity} onSeverityChange={setSeverity} description={description} onDescriptionChange={setDescription} isLoading={isLoading} />
          <SubmitButton onPress={handleUpdate} isLoading={isLoading} label="Simpan Perubahan" />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default FormEditLocationScreen;
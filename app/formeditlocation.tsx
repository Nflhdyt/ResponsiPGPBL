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

const AppColors = {
    primary: '#FF3B30',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    textPrimary: '#000000',
    textSecondary: '#666666',
};

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
  
  // Kita simpan ID yang mau diedit disini
  const [editId, setEditId] = useState<string | null>(null);

  const router = useRouter();
  const params = useLocalSearchParams();

  // 1. LOAD DATA SAAT PERTAMA BUKA
  useEffect(() => {
    // Ambil ID dari parameter navigasi
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    if (id && !editId) {
      console.log("🔒 EDIT MODE: ID KUNCI =", id);
      setEditId(id);
      fetchReportData(id);
    }
    
    // Cek kalau balik dari peta (update lokasi)
    if (params.latitude && params.longitude) {
      setLatitude(params.latitude as string);
      setLongitude(params.longitude as string);
    }
  }, [params.id, params.latitude, params.longitude]);

  const fetchReportData = async (id: string) => {
    setIsLoading(true);
    try {
      const docRef = doc(db, 'reports', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setImageUri(data.imageUrl);
        
        if (data.location?.latitude) {
            setLatitude(String(data.location.latitude));
            setLongitude(String(data.location.longitude));
        } else {
            setLatitude(String(data.latitude || ''));
            setLongitude(String(data.longitude || ''));
        }
        
        setDescription(data.description || '');
        setSeverity(data.severity || 'Medium');
      } else {
        Alert.alert("Error", "Data tidak ditemukan.");
        router.back();
      }
    } catch (error) {
      Alert.alert("Error", "Gagal memuat data edit.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGIC GAMBAR & LOKASI (SAMA) ---
  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.3, 
      });
      if (!result.canceled) setImageUri(result.assets[0].uri);
    } catch (error) { Alert.alert('Error', 'Gagal membuka galeri.'); }
  };

  const getMyLocation = async () => {
    setIsLoading(true);
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return Alert.alert('Izin Ditolak', 'Perlu izin lokasi.');
        const loc = await Location.getCurrentPositionAsync({});
        setLatitude(String(loc.coords.latitude));
        setLongitude(String(loc.coords.longitude));
    } catch (e) { Alert.alert('Error', 'Gagal GPS.'); } finally { setIsLoading(false); }
  };

  const openMapPicker = () => {
    // Kalau mau pilih peta, kita oper ID-nya juga biar pas balik gak hilang
    router.push({ 
        pathname: '/LocationPicker', 
        params: { latitude, longitude, returnTo: 'edit', editId: editId } 
    });
  };

  const uploadImageToCloudinary = async (uri: string) => {
    if (uri.startsWith('http')) return uri; // Gambar gak ganti, pake link lama
    const formData = new FormData();
    let filename = uri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename || '');
    let type = match ? `image/${match[1]}` : `image/jpeg`;
    formData.append('file', { uri, type, name: filename || 'upload.jpg' } as any);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', CLOUD_NAME);
    formData.append('api_key', API_KEY); 
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.secure_url;
  };

  // --- LOGIC UPDATE (HANYA UPDATE, NO CREATE!) ---
  const handleUpdate = async () => {
    if (!editId) {
        Alert.alert("Fatal Error", "ID Laporan Hilang. Silakan kembali dan coba lagi.");
        return;
    }

    if (!imageUri || !latitude || !longitude || !description.trim()) {
      Alert.alert('Error', 'Mohon lengkapi semua data.');
      return;
    }

    setIsLoading(true);

    try {
      const uploadedUrl = await uploadImageToCloudinary(imageUri);

      const reportData = {
        imageUrl: uploadedUrl,
        location: {
          latitude: parseFloat(latitude), 
          longitude: parseFloat(longitude),
        },
        severity,
        description,
        timestamp: new Date(), 
      };

      // EXECUTE UPDATE
      const docRef = doc(db, 'reports', editId);
      await updateDoc(docRef, reportData);
      
      Alert.alert('Sukses', 'Data berhasil diperbarui!', [
          { text: 'OK', onPress: () => router.back() } // Balik ke Peta
      ]);

    } catch (error: any) {
      console.error('Error updating:', error);
      Alert.alert('Gagal', `Gagal update: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: AppColors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen options={{ 
            title: 'Edit Laporan', 
            headerShadowVisible: false, 
            headerStyle: { backgroundColor: AppColors.surface }, 
            headerTintColor: AppColors.textPrimary 
        }} />
        
        <ScrollView contentContainerStyle={globalStyles.container} showsVerticalScrollIndicator={false}>
          <ImagePickerCard imageUri={imageUri} onPress={pickImageFromGallery} isLoading={isLoading} />
          <LocationCard
            latitude={latitude}
            longitude={longitude}
            onLatitudeChange={setLatitude}
            onLongitudeChange={setLongitude}
            onGetLocation={getMyLocation}
            onOpenMapPicker={openMapPicker}
            isLoading={isLoading}
          />
          <DetailsCard
            severity={severity}
            onSeverityChange={setSeverity}
            description={description}
            onDescriptionChange={setDescription}
            isLoading={isLoading}
          />
          <SubmitButton 
            onPress={handleUpdate} 
            isLoading={isLoading} 
            label="Simpan Perubahan" 
          />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default FormEditLocationScreen;
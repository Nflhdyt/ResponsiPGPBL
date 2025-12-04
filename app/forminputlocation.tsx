import { DetailsCard } from '@/components/form/DetailsCard';
import { ImagePickerCard } from '@/components/form/ImagePickerCard';
import { LocationCard } from '@/components/form/LocationCard';
import { SubmitButton } from '@/components/form/SubmitButton';
import { globalStyles } from '@/constants/styles';
import { auth, db } from '@/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore'; // CUMA ADA ADD
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Warna Manual
const AppColors = { primary: '#FF3B30', background: '#FFFFFF', surface: '#FFFFFF', textPrimary: '#000000', textSecondary: '#666666' };
const CLOUD_NAME = 'ddlxrhe9n';
const UPLOAD_PRESET = 'bengkulu';
const API_KEY = '737357581632975';

const FormInputLocationScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'Light' | 'Medium' | 'Heavy'>('Medium');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  // Cek parameter lokasi dari peta picker
  useEffect(() => {
    if (params.latitude && params.longitude) {
      setLatitude(params.latitude as string);
      setLongitude(params.longitude as string);
    }
  }, [params.latitude, params.longitude]);

  // --- LOGIC GAMBAR & LOKASI ---
  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.3 });
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
    // Navigasi ke Peta (Mode Create)
    router.push({ pathname: '/LocationPicker', params: { latitude, longitude, returnTo: 'create' } });
  };

  const uploadImageToCloudinary = async (uri: string) => {
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

  // --- LOGIC SUBMIT (HANYA CREATE) ---
  const handleSubmit = async () => {
    if (!imageUri || !latitude || !longitude || !description.trim()) {
      return Alert.alert('Error', 'Mohon lengkapi semua data.');
    }
    setIsLoading(true);
    try {
      const uploadedUrl = await uploadImageToCloudinary(imageUri);
      const reportData = {
        imageUrl: uploadedUrl,
        location: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        severity, description, timestamp: new Date(),
        userId: auth.currentUser?.uid || 'anonymous',
        voteCount: 0
      };

      // PASTI ADD DOC (CREATE)
      await addDoc(collection(db, 'reports'), reportData);
      
      Alert.alert('Sukses', 'Laporan berhasil dikirim!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (error: any) {
      Alert.alert('Gagal', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: AppColors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen options={{ title: 'Buat Laporan Baru', headerStyle: { backgroundColor: AppColors.surface }, headerTintColor: AppColors.textPrimary }} />
        <ScrollView contentContainerStyle={globalStyles.container}>
          <ImagePickerCard imageUri={imageUri} onPress={pickImageFromGallery} isLoading={isLoading} />
          <LocationCard latitude={latitude} longitude={longitude} onLatitudeChange={setLatitude} onLongitudeChange={setLongitude} onGetLocation={getMyLocation} onOpenMapPicker={openMapPicker} isLoading={isLoading} />
          <DetailsCard severity={severity} onSeverityChange={setSeverity} description={description} onDescriptionChange={setDescription} isLoading={isLoading} />
          <SubmitButton onPress={handleSubmit} isLoading={isLoading} label="Kirim Laporan" />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default FormInputLocationScreen;
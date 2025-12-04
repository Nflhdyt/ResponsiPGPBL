import { auth, db } from '@/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/theme';
import { globalStyles } from '@/constants/styles';
import { ImagePickerCard } from '@/components/form/ImagePickerCard';
import { LocationCard } from '@/components/form/LocationCard';
import { DetailsCard } from '@/components/form/DetailsCard';
import { SubmitButton } from '@/components/form/SubmitButton';

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

  useEffect(() => {
    if (params.latitude && params.longitude) {
      setLatitude(params.latitude as string);
      setLongitude(params.longitude as string);
    }
  }, [params]);

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image Picker Error: ', error);
      Alert.alert('Error', 'Gagal membuka galeri. Pastikan izin telah diberikan.');
    }
  };
  
  const getMyLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Ditolak', 'Izin lokasi diperlukan untuk melaporkan masalah.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLatitude(location.coords.latitude.toString());
      setLongitude(location.coords.longitude.toString());
      Alert.alert('Sukses', 'Lokasi berhasil didapatkan.');
    } catch (error) {
      console.error('Error mendapatkan lokasi:', error);
      Alert.alert('Error', 'Gagal mendapatkan lokasi.');
    } finally {
      setIsLoading(false);
    }
  };

  const openMapPicker = () => {
    router.push({
      pathname: '/LocationPicker',
      params: {
        latitude,
        longitude,
      },
    });
  };

  // Function to upload image to Cloudinary
  const uploadImageToCloudinary = async (imageUri: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', CLOUD_NAME);
    formData.append('api_key', API_KEY); // Added API Key

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json(); // Attempt to parse JSON error
        console.error("Cloudinary upload failed with status:", response.status, "Error details:", errorData);
        throw new Error(`Cloudinary upload failed: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      if (!data.secure_url) {
        throw new Error('Cloudinary response missing secure_url.');
      }
      return data.secure_url;
    } catch (e: any) {
      console.error("Error uploading to Cloudinary:", e.message);
      throw e;
    }
  };

  const handleUpload = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Mohon pilih foto laporan.');
      return;
    }
    if (!latitude || !longitude) {
      Alert.alert('Error', 'Mohon dapatkan lokasi Anda.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Mohon masukkan deskripsi laporan.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Upload image to Cloudinary
      const uploadedUrl = await uploadImageToCloudinary(imageUri);

      // 2. ONLY save to Firestore if the upload returns a valid 'secure_url'
      const reportsCollection = collection(db, 'reports');
      await addDoc(reportsCollection, {
        imageUrl: uploadedUrl,
        location: {
          latitude: parseFloat(latitude), // Use 'latitude' and 'longitude' as specified
          longitude: parseFloat(longitude),
        },
        severity,
        description,
        timestamp: new Date(), // As requested by the user, replacing serverTimestamp()
        userId: auth.currentUser?.uid || 'anonymous',
        voteCount: 0, // Assuming voteCount is still part of the schema
      });

      Alert.alert('Laporan Terkirim', 'Terima kasih atas kontribusi Anda!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error('Error submitting report:', error);
      Alert.alert('Submission Failed', `Terjadi kesalahan saat mengunggah laporan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: AppColors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen options={{ title: 'Buat Laporan Baru', headerShadowVisible: false, headerStyle: { backgroundColor: AppColors.surface }, headerTintColor: AppColors.textPrimary }} />
        
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
          <SubmitButton onPress={handleUpload} isLoading={isLoading} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default FormInputLocationScreen;

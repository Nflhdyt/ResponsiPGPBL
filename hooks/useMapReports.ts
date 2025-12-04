import { db } from '@/firebaseConfig';
import { useIsFocused } from '@react-navigation/native';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface Report {
  id: string;
  latitude: number;
  longitude: number;
  severity: 'Heavy' | 'Medium' | 'Light';
  description: string;
  imageUrl: string;
  voteCount: number;
  color: string;
}

const severityColors = {
  Heavy: '#E11D48',
  Medium: '#FFA500',
  Light: '#FFC700',
};

export const useMapReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      const reportsQuery = query(collection(db, 'reports'));

      const unsubscribe = onSnapshot(
        reportsQuery,
        (snapshot) => {
          console.log('🗺️ Map: Total docs in Firebase:', snapshot.size);

          const fetchedReports = snapshot.docs
            .map(doc => {
              const data = doc.data();
              console.log(`🗺️ Raw doc ${doc.id}:`, JSON.stringify(data, null, 2));

              // Parse coordinates - they might be strings or numbers from Firebase
              let latitude = 0;
              let longitude = 0;

              // Check if location object exists (nested structure)
              if (data.location) {
                latitude = parseFloat(data.location.latitude) || parseFloat(data.location.lat) || 0;
                longitude = parseFloat(data.location.longitude) || parseFloat(data.location.lng) || 0;
                console.log(`🗺️ Location object found. lat=${latitude}, lng=${longitude}`);
              } else {
                // Check for flat structure
                latitude = parseFloat(data.latitude) || 0;
                longitude = parseFloat(data.longitude) || 0;
                console.log(`🗺️ No location object. Using flat. lat=${latitude}, lng=${longitude}`);
              }

              // Skip invalid coordinates
              if (isNaN(latitude) || isNaN(longitude) || latitude === 0 || longitude === 0) {
                console.warn(`🗺️ ❌ Skipping report ${doc.id}: invalid (lat: ${latitude}, lng: ${longitude})`);
                return null;
              }

              console.log(`🗺️ ✅ Added marker for ${doc.id}`);

              const severity = (data.severity as keyof typeof severityColors) || 'Light';
              return {
                id: doc.id,
                latitude,
                longitude,
                severity,
                description: data.description || 'Road Damage Report',
                imageUrl: data.imageUrl || '',
                voteCount: data.voteCount || 0,
                color: severityColors[severity] || '#A4B0BE',
              };
            })
            .filter(report => report !== null);

          console.log('🗺️ Final map reports:', fetchedReports.length, fetchedReports); // Debug log
          setReports(fetchedReports);
          setLoading(false);
        },
        (error) => {
          console.error("🗺️ Error fetching reports: ", error);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      setLoading(false);
      setReports([]);
    }
  }, [isFocused]);

  return { reports, loading };
};

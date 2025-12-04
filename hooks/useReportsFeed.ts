import { db } from '@/firebaseConfig';
import { collection, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface Report {
  id: string;
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
  };
  severity: 'Light' | 'Medium' | 'Heavy';
  description: string;
  voteCount: number;
  createdAt: any;
  urgencyScore?: number;
}

const calculateUrgencyScore = (severity: string, voteCount: number): number => {
    let severityScore = 0;
    switch (severity) {
      case 'Heavy':
        severityScore = 10;
        break;
      case 'Medium':
        severityScore = 5;
        break;
      case 'Light':
        severityScore = 2;
        break;
    }
    return severityScore + voteCount * 2;
};

export const useReportsFeed = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const reportsQuery = query(collection(db, 'reports'));

    const unsubscribe = onSnapshot(
      reportsQuery,
      (snapshot) => {
        console.log('📊 Firebase snapshot received. Total docs:', snapshot.size);
        
        const reportsList: Report[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as any;
          console.log(`📄 Raw doc ${doc.id}:`, JSON.stringify(data, null, 2));
          
          // Parse coordinates - they might be strings or numbers from Firebase
          let latitude = 0;
          let longitude = 0;
          
          // Check if location object exists (nested structure)
          if (data.location) {
            latitude = parseFloat(data.location.latitude) || parseFloat(data.location.lat) || 0;
            longitude = parseFloat(data.location.longitude) || parseFloat(data.location.lng) || 0;
            console.log(`  Location object found. lat=${latitude}, lng=${longitude}`);
          } else {
            // Check for flat structure
            latitude = parseFloat(data.latitude) || 0;
            longitude = parseFloat(data.longitude) || 0;
            console.log(`  No location object. Using flat structure. lat=${latitude}, lng=${longitude}`);
          }
          
          // Skip invalid coordinates
          if (isNaN(latitude) || isNaN(longitude)) {
            console.warn(`❌ Skipping report ${doc.id}: invalid coordinates (lat=${latitude}, lng=${longitude})`);
            return;
          }
          
          const urgencyScore = calculateUrgencyScore(data.severity, data.voteCount);
          reportsList.push({
            id: doc.id,
            imageUrl: data.imageUrl || '',
            location: {
              lat: latitude,
              lng: longitude,
            },
            severity: data.severity || 'Light',
            description: data.description || '',
            voteCount: data.voteCount || 0,
            createdAt: data.createdAt,
            urgencyScore,
          });
          console.log(`✅ Added report ${doc.id} with urgencyScore=${urgencyScore}`);
        });

        reportsList.sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));
        console.log('📋 Final processed reports:', reportsList.length, 'reports', reportsList); // Debug log
        setReports(reportsList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching reports:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleValidate = async (reportId: string, currentVotes: number) => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        voteCount: currentVotes + 1,
      });
      Alert.alert('Success', 'Thank you for validating this report!');
    } catch (error) {
      console.error('Error updating report:', error);
      Alert.alert('Error', 'Failed to validate report');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // You might want to re-fetch the data here, but for now, we'll just simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return { reports, loading, refreshing, handleValidate, onRefresh };
};

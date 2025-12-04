import { db } from '@/firebaseConfig'; 
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

export const useMapReports = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fungsi Fetch yang bisa dipanggil ulang
  const fetchReports = useCallback(async () => {
    // Komen setLoading(true) biar peta gak kedip loading overlay pas delete
    // setLoading(true); 
    try {
      const q = query(collection(db, 'reports'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Update State dengan Array BARU (Spread Operator) biar React sadar ada perubahan
      setReports([...data]); 
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchReports();
  }, [fetchReports]);

  return { reports, loading, refetch: fetchReports };
};
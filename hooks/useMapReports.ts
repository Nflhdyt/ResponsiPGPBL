import { db } from '@/firebaseConfig'; // Pastikan path ini sesuai dengan config kamu
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

export const useMapReports = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Kita bungkus logic ambil data jadi satu fungsi bernama fetchReports
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      // Ambil data dari collection 'reports', urutkan dari yang terbaru
      const q = query(collection(db, 'reports'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Panggil otomatis saat pertama kali load
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // PENTING: Return 'refetch' (yang isinya fungsi fetchReports tadi)
  return { reports, loading, refetch: fetchReports };
};
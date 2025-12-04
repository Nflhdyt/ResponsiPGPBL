import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface DamageStats {
  total: number;
  heavy: number;
  medium: number;
  light: number;
  totalValidations: number;
  averageUrgency: number;
}

export const useStatistics = () => {
  const [stats, setStats] = useState<DamageStats>({
    total: 0,
    heavy: 0,
    medium: 0,
    light: 0,
    totalValidations: 0,
    averageUrgency: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    const reportsQuery = query(collection(db, 'reports'));

    const unsubscribe = onSnapshot(
      reportsQuery,
      (snapshot) => {
        try {
          let heavyCount = 0;
          let mediumCount = 0;
          let lightCount = 0;
          let totalVotes = 0;
          let totalUrgency = 0;

          snapshot.forEach((doc) => {
            const data = doc.data();
            const severity = data.severity;
            const votes = data.voteCount || 0;

            if (severity === 'Heavy') heavyCount++;
            else if (severity === 'Medium') mediumCount++;
            else if (severity === 'Light') lightCount++;

            totalVotes += votes;

            let severityScore = 0;
            if (severity === 'Heavy') severityScore = 10;
            else if (severity === 'Medium') severityScore = 5;
            else if (severity === 'Light') severityScore = 2;

            totalUrgency += severityScore + votes * 2;
          });

          const total = snapshot.size;
          const avgUrgency = total > 0 ? Math.round(totalUrgency / total) : 0;

          setStats({
            total,
            heavy: heavyCount,
            medium: mediumCount,
            light: lightCount,
            totalValidations: totalVotes,
            averageUrgency: avgUrgency,
          });
          setError(null); // Clear any previous errors
        } catch (e: any) {
          console.error('Error processing statistics:', e);
          setError('Gagal memproses data statistik.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        // Handle Firestore snapshot errors
        console.error('Error fetching statistics:', err);
        setError('Gagal mengambil data dari server.');
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Return all three states: data, loading status, and error
  return { stats, loading, error };
};

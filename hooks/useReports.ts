import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

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

interface Stats {
  totalReports: number;
  criticalRoads: number;
  verifiedReports: number;
  totalValidations: number;
  averageUrgency: number;
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

export const useReports = () => {
  const [stats, setStats] = useState<Stats>({
    totalReports: 0,
    criticalRoads: 0,
    verifiedReports: 0,
    totalValidations: 0,
    averageUrgency: 0,
  });
  const [topReports, setTopReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reportsQuery = query(collection(db, 'reports'));

    const unsubscribe = onSnapshot(
      reportsQuery,
      (snapshot) => {
        const reportsList: Report[] = [];
        let critical = 0;
        let verified = 0;
        let totalVotes = 0;
        let totalUrgency = 0;

        snapshot.forEach((doc) => {
          const data = doc.data() as Omit<Report, 'id'>;
          const urgencyScore = calculateUrgencyScore(data.severity, data.voteCount);

          if (data.severity === 'Heavy') critical++;
          if (data.voteCount > 5) verified++;
          totalVotes += data.voteCount;
          totalUrgency += urgencyScore;

          reportsList.push({
            id: doc.id,
            ...data,
            urgencyScore,
          });
        });

        reportsList.sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));
        const top3 = reportsList.slice(0, 3);
        const avgUrgency = reportsList.length > 0 ? Math.round(totalUrgency / reportsList.length) : 0;

        setStats({
          totalReports: snapshot.size,
          criticalRoads: critical,
          verifiedReports: verified,
          totalValidations: totalVotes,
          averageUrgency: avgUrgency,
        });
        setTopReports(top3);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching reports:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { stats, topReports, loading };
};

import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Firebase Configuration for Bengkulu Mulus - Road Repair Reporting App
const firebaseConfig = {
  apiKey: 'AIzaSyCHYMD2z1-Ph4iV8ira3TBvK-tq2nmw1KM',
  authDomain: 'nfl-reactnative.firebaseapp.com',
  databaseURL: 'https://nfl-reactnative-default-rtdb.firebaseio.com',
  projectId: 'nfl-reactnative',
  storageBucket: 'nfl-reactnative.firebasestorage.app',
  messagingSenderId: '962146808958',
  appId: '1:962146808958:web:bfe6dbe0511a232778142f',
  measurementId: 'G-M52EQ30YBT',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore Database
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Conditionally initialize Analytics only on web or if supported
let analytics;
if (Platform.OS === 'web') {
  analytics = getAnalytics(app);
} else {
  isSupported().then((result) => {
    if (result) {
      analytics = getAnalytics(app);
    }
  });
}


// Export modules for use throughout the app
export { analytics, app, auth, db, storage };
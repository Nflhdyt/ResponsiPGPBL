// This Firebase config is deprecated - using firebaseConfig.js instead
// Keeping this file to prevent import errors from old references

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCHYMD2z1-Ph4iV8ira3TBvK-tq2nmw1KM",
  authDomain: "nfl-reactnative.firebaseapp.com",
  projectId: "nfl-reactnative",
  storageBucket: "nfl-reactnative.firebasestorage.app",
  messagingSenderId: "962146808958",
  databaseURL: "https://nfl-reactnative-default-rtdb.firebaseio.com",
  appId: "1:962146808958:web:bfe6dbe0511a232778142f"
};

// Initialize Firebase only if it hasn't been initialized already
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const db = getDatabase(app);

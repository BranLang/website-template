declare const process: any;
const env: any = (typeof process !== 'undefined' && process?.env) ? process.env : {};

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  defaultSiteSlug: 'just-eurookna',
  firebaseConfig: {
    apiKey: env.FIREBASE_API_KEY || '',
    authDomain: env.FIREBASE_AUTH_DOMAIN || '',
    databaseURL: env.FIREBASE_DATABASE_URL || '',
    projectId: env.FIREBASE_PROJECT_ID || '',
    storageBucket: env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: env.FIREBASE_APP_ID || '',
    measurementId: env.FIREBASE_MEASUREMENT_ID || '',
  }
};

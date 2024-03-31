import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAOmgmjB_k7AzapNtXEBcxT53BvR_WbCyw',
  authDomain: 'crisp-b06bf.firebaseapp.com',
  projectId: 'crisp-b06bf',
  storageBucket: 'crisp-b06bf.appspot.com',
  messagingSenderId: '712604544303',
  appId: '1:712604544303:web:52821ca807fa74e2da85da',
  measurementId: 'G-6MTNM6EBKH',
};

const app = initializeApp(firebaseConfig);
const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export default app;
export { auth, db, storage, secondaryApp };

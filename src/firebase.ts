import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "loyal-axon-vkm1r",
  appId: "1:903033271827:web:44307ea9ae29c1c4a171e6",
  apiKey: "AIzaSyDkjBj4CJZmFOTIMeuHkFkEclRd1S8CKkI",
  authDomain: "loyal-axon-vkm1r.firebaseapp.com",
  storageBucket: "loyal-axon-vkm1r.firebasestorage.app",
  messagingSenderId: "903033271827"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-84c5da22-bd43-48e9-b9df-9d33d0616e0c");

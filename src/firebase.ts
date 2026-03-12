// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDw8DOiovem3nQi05Vw4XMZ7OmUhIYwMbw',
  authDomain: 'notes-dotnet.firebaseapp.com',
  projectId: 'notes-dotnet',
  storageBucket: 'notes-dotnet.firebasestorage.app',
  messagingSenderId: '839133684329',
  appId: '1:839133684329:web:f7bdf06b8c9293e13ab8f8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

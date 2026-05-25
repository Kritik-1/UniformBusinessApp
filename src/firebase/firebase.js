import { initializeApp } from "firebase/app"

import { getFirestore } from "firebase/firestore"

import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyALIZKv6dx2sEeAky9U1GIiswqQcLVe0fQ",
    authDomain: "uniform-business.firebaseapp.com",
    projectId: "uniform-business",
    storageBucket: "uniform-business.firebasestorage.app",
    messagingSenderId: "476726069396",
    appId: "1:476726069396:web:aae747c1878f80884c4c81"
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

const auth = getAuth(app)

export { db, auth }
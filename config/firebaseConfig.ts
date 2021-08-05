import { initializeApp, credential } from "firebase-admin";

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG!);
export const app = initializeApp({
  credential: credential.cert(firebaseConfig),
});

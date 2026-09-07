// Initialisation Firebase (Realtime Database) partagée par toutes les pages du projet.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
  update,
  onValue,
  query as rtdbQuery,
  orderByChild,
  equalTo,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHjH-pL8-e7ltOn6SpEYgbmAcSpwS12Yo",
  authDomain: "couple-together-e6ed3.firebaseapp.com",
  projectId: "couple-together-e6ed3",
  databaseURL: "https://couple-together-e6ed3-default-rtdb.firebaseio.com",
  storageBucket: "couple-together-e6ed3.firebasestorage.app",
  messagingSenderId: "493218381649",
  appId: "1:493218381649:web:483c08dd6f3769e4ecdd70"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// ---------------------------------------------------------------------------
// Couche de compatibilité : imite l'API Firestore utilisée dans le reste du
// projet pour ne pas avoir à réécrire morpion.html / puissance4.html /
// ballons.html / dessin.html.
// ---------------------------------------------------------------------------

// doc(db, "couples", id, "games", "morpion") -> ref RTDB "couples/id/games/morpion"
export function doc(_db, ...segments) {
  return ref(_db, segments.join("/"));
}

export function collection(_db, path) {
  return ref(_db, path);
}

// Imite un DocumentSnapshot Firestore : exists() / data() / id
export async function getDoc(reference) {
  const snap = await get(reference);
  return { exists: () => snap.exists(), data: () => snap.val(), id: reference.key };
}

export const setDoc = set;
export const updateDoc = update;

// onSnapshot(ref, cb) -> cb reçoit un objet { exists(), data(), id } à chaque
// changement. onValue renvoie déjà la fonction de désabonnement.
export function onSnapshot(reference, cb) {
  return onValue(reference, (snap) => {
    cb({ exists: () => snap.exists(), data: () => snap.val(), id: reference.key });
  });
}

// where("champ","==",valeur) -> contrainte appliquée à une query RTDB
// (seul "==" est utilisé dans le projet).
export function where(field, _op, value) {
  return (q) => rtdbQuery(q, orderByChild(field), equalTo(value));
}

export function query(baseRef, ...constraints) {
  return constraints.reduce((q, c) => c(q), baseRef);
}

// Imite un QuerySnapshot Firestore : { empty, docs:[{id, data()}] }
export async function getDocs(q) {
  const snap = await get(q);
  const docs = [];
  snap.forEach((child) => docs.push({ id: child.key, data: () => child.val() }));
  return { empty: docs.length === 0, docs };
}

export {
  ref,
  get,
  set,
  update,
  runTransaction,
  serverTimestamp,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
};

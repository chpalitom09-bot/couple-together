import {
  db, doc, getDoc, setDoc, updateDoc, onSnapshot,
  collection, query, where, getDocs, serverTimestamp, runTransaction
} from "./firebase.js";

function randomCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans caractères ambigus
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// Crée le document utilisateur au premier login, avec son propre code de parrainage.
export async function ensureUserDoc(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();
  const data = {
    email: user.email,
    inviteCode: randomCode(),
    coupleId: null,
    createdAt: serverTimestamp()
  };
  await setDoc(ref, data);
  return data;
}

export function listenUserDoc(uid, cb) {
  return onSnapshot(doc(db, "users", uid), (snap) => cb(snap.exists() ? snap.data() : null));
}

export function listenCouple(coupleId, cb) {
  return onSnapshot(doc(db, "couples", coupleId), (snap) => cb(snap.exists() ? snap.data() : null));
}

// Utilise le code du/de la partenaire pour créer le couple. Le code devient invalide ensuite.
export async function linkWithCode(myUid, code) {
  const cleanCode = code.trim().toUpperCase();
  const q = query(collection(db, "users"), where("inviteCode", "==", cleanCode));
  const results = await getDocs(q);
  if (results.empty) throw new Error("Ce code ne correspond à aucun compte.");
  const partnerDoc = results.docs[0];
  const partnerUid = partnerDoc.id;

  if (partnerUid === myUid) throw new Error("Tu ne peux pas utiliser ton propre code.");
  if (partnerDoc.data().coupleId) throw new Error("Cette personne est déjà en couple avec quelqu'un.");

  const coupleId = [myUid, partnerUid].sort().join("_");

  await runTransaction(db, async (tx) => {
    const myRef = doc(db, "users", myUid);
    const partnerRef = doc(db, "users", partnerUid);
    const myFresh = await tx.get(myRef);
    if (myFresh.data().coupleId) throw new Error("Tu es déjà en couple avec quelqu'un.");

    tx.set(doc(db, "couples", coupleId), {
      members: [myUid, partnerUid].sort(),
      roles: { [myUid]: "a", [partnerUid]: "b" },
      createdAt: serverTimestamp()
    });
    tx.update(myRef, { coupleId, inviteCode: randomCode() });
    tx.update(partnerRef, { coupleId, inviteCode: randomCode() });
  });

  return coupleId;
}

export function myRole(couple, uid) {
  return couple.roles[uid];
}

export function partnerUid(couple, uid) {
  return couple.members.find((m) => m !== uid);
}

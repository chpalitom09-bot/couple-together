import { db, ref, get, set, update, onSnapshot, query, where, collection, getDocs, serverTimestamp, runTransaction, doc, setDoc, getDoc } from "./firebase.js";

function randomCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans caractères ambigus
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// Crée le nœud utilisateur au premier login, avec son propre code de parrainage.
export async function ensureUserDoc(user) {
  const uref = ref(db, `users/${user.uid}`);
  const snap = await get(uref);
  if (snap.exists()) return snap.val();
  const data = {
    email: user.email,
    inviteCode: randomCode(),
    coupleId: null,
    createdAt: serverTimestamp()
  };
  await set(uref, data);
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

  // Réservation atomique : chaque compte ne peut être lié qu'une seule fois.
  // (Realtime Database ne fait des transactions que sur un seul chemin à la fois,
  // donc on réserve le champ coupleId de chacun l'un après l'autre.)
  const myCoupleRef = ref(db, `users/${myUid}/coupleId`);
  const myTx = await runTransaction(myCoupleRef, (current) => (current ? undefined : coupleId));
  if (!myTx.committed) throw new Error("Tu es déjà en couple avec quelqu'un.");

  const partnerCoupleRef = ref(db, `users/${partnerUid}/coupleId`);
  const partnerTx = await runTransaction(partnerCoupleRef, (current) => (current ? undefined : coupleId));
  if (!partnerTx.committed) {
    await set(myCoupleRef, null); // on annule notre propre réservation
    throw new Error("Cette personne est déjà en couple avec quelqu'un.");
  }

  await update(ref(db), {
    [`couples/${coupleId}`]: {
      members: [myUid, partnerUid].sort(),
      roles: { [myUid]: "a", [partnerUid]: "b" },
      createdAt: serverTimestamp()
    },
    [`users/${myUid}/inviteCode`]: randomCode()
  });

  return coupleId;
}

export function myRole(couple, uid) {
  return couple.roles[uid];
}

export function partnerUid(couple, uid) {
  return couple.members.find((m) => m !== uid);
}

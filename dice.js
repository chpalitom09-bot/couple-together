import { db, doc, onSnapshot, updateDoc } from "./firebase.js";
import { icon } from "./icons.js";

// Ouvre l'overlay de lancer de dé sur le document de partie fourni (gameRef).
// À la résolution, appelle onStarter(role) avec 'a' ou 'b' et nettoie le champ diceRoll.
export function startDiceDuel(gameRef, myRole, onStarter) {
  const overlay = document.createElement("div");
  overlay.className = "dice-overlay";
  overlay.innerHTML = `
    <div class="dice-panel">
      <h2>Qui commence ?</h2>
      <p>Lancez le dé chacun votre tour. Le plus gros score démarre la partie.</p>
      <div class="dice-faces">
        <div>
          <div class="die mine" id="die-mine">?</div>
          <div class="die-label">Toi</div>
        </div>
        <div>
          <div class="die theirs" id="die-theirs">?</div>
          <div class="die-label">Partenaire</div>
        </div>
      </div>
      <div id="dice-status" class="hint">À toi de lancer.</div>
      <button class="btn" id="btn-roll">${icon("dice")} Lancer le dé</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const rollBtn = overlay.querySelector("#btn-roll");
  const status = overlay.querySelector("#dice-status");
  const dieMine = overlay.querySelector("#die-mine");
  const dieTheirs = overlay.querySelector("#die-theirs");
  const otherRole = myRole === "a" ? "b" : "a";

  let unsub = onSnapshot(gameRef, async (snap) => {
    const data = snap.data();
    if (!data) return;
    const roll = data.diceRoll || {};
    dieMine.textContent = roll[myRole] ?? "?";
    dieTheirs.textContent = roll[otherRole] ?? "?";

    rollBtn.disabled = roll[myRole] != null;

    if (roll.a != null && roll.b != null) {
      if (roll.a === roll.b) {
        status.textContent = "Égalité ! On relance dans un instant...";
        if (myRole === "a") {
          setTimeout(() => updateDoc(gameRef, { diceRoll: { a: null, b: null } }), 1400);
        }
      } else {
        const starter = roll.a > roll.b ? "a" : "b";
        status.textContent = starter === myRole ? "Tu commences !" : "C'est ton/ta partenaire qui commence.";
        setTimeout(async () => {
          unsub();
          overlay.remove();
          if (myRole === "a") {
            await updateDoc(gameRef, { diceRoll: { a: null, b: null } });
          }
          onStarter(starter);
        }, 1200);
      }
    } else if (roll[myRole] != null) {
      status.textContent = "En attente du lancer de ton/ta partenaire...";
    }
  });

  rollBtn.onclick = async () => {
    rollBtn.disabled = true;
    const value = 1 + Math.floor(Math.random() * 6);
    // Realtime Database : chemin imbriqué avec "/" (et non "." comme Firestore).
    const field = `diceRoll/${myRole}`;
    await updateDoc(gameRef, { [field]: value });
  };
}

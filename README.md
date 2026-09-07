# À Deux — jeux de couple en temps réel

Morpion, Puissance 4, ballons empoisonnés (avec gages) et dessin à deviner (300 mots),
jouables à deux en temps réel. Auth par mail/mot de passe, liaison de couple par code
de parrainage à usage unique (plus besoin de code de partie ensuite), PWA installable.

Tout le projet est à la racine, aucun bundler nécessaire : ce sont des fichiers statiques
qui utilisent le SDK Firebase modulaire directement en `import` dans le navigateur.

## 1. Configurer Firebase

Le projet Firebase (`couple-together-e6ed3`) est déjà branché dans `firebase.js`.
Dans la [console Firebase](https://console.firebase.google.com/) de ce projet :

1. **Authentication → Sign-in method** → active **Email/Password**.
2. **Firestore Database** → crée la base (mode production).
3. **Firestore → Rules** → colle le contenu de `firestore.rules` fourni ici, puis publie.
4. (Optionnel) **Firestore → Indexes** : la requête `where("inviteCode", "==", code)`
   fonctionne sans index composite, rien à faire de plus.

## 2. Déployer sur GitHub Pages

1. Pousse tout le contenu de ce dossier à la racine d'un dépôt GitHub.
2. Dans les paramètres du dépôt → **Pages** → Source : branche `main`, dossier `/ (root)`.
3. L'app est servie en HTTPS par défaut, ce qui est nécessaire pour l'installation PWA
   et pour que le service worker fonctionne.

## 3. Installer la PWA

Une fois le site ouvert sur mobile (Chrome/Safari) ou desktop, une option
« Ajouter à l'écran d'accueil » / « Installer l'application » apparaît automatiquement
grâce à `manifest.json` et `sw.js`.

## Comment ça marche

- **Liaison de couple** : à la création de compte, chacun reçoit un code à 6 caractères.
  Le/la partenaire l'entre une seule fois pour lier les deux comptes définitivement
  (`couple.js`). Ensuite, plus jamais besoin de code : chaque jeu se retrouve
  automatiquement via l'identifiant du couple.
- **Dé partagé** (`dice.js`) : avant chaque partie, les deux lancent un dé (1 à 6).
  Le plus haut score commence ; égalité → on relance. Réutilisé par les 4 jeux.
- **Temps réel** : chaque jeu a un document Firestore sous
  `couples/{coupleId}/games/{jeu}`, synchronisé en direct via `onSnapshot`.
- **Dessin à deviner** : le mot est tiré dans `words.js` (300 mots) et stocké dans un
  document séparé (`games/dessin_secret`) dont les règles Firestore n'autorisent la
  lecture qu'à la personne qui dessine — le mot reste donc réellement caché de la
  personne qui doit deviner.
- **Ballons empoisonnés** : les 9 gages sont écrits à tour de rôle par les deux
  partenaires, puis chacun·e choisit en secret 3 ballons empoisonnés (union des deux
  choix). Note : par souci de simplicité, le choix des ballons empoisonnés n'est
  masqué que côté interface, pas au niveau des règles Firestore (contrairement au mot
  du dessin) — largement suffisant pour un usage entre vous deux, mais à savoir.

## Fichiers

```
index.html        Auth + liaison de couple + accueil
morpion.html       Jeu du morpion
puissance4.html     Jeu du puissance 4
ballons.html        Jeu des ballons empoisonnés
dessin.html          Jeu de dessin à deviner
firebase.js        Init Firebase (app, auth, firestore)
couple.js          Liaison de couple par code
dice.js             Dé partagé réutilisé par les 4 jeux
icons.js             Icônes SVG (pas d'emoji)
words.js              300 mots à dessiner
styles.css             Charte graphique
manifest.json + sw.js + icon-192.png + icon-512.png   PWA
firestore.rules          Règles de sécurité à coller dans la console Firebase
```

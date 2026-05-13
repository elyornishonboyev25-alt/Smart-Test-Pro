// Initialize Firebase Admin SDK and configure to use emulators when available
const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT || null;
try {
  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount), projectId: process.env.FIREBASE_PROJECT_ID });
  } else {
    admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
  }
} catch (e) {
  console.warn('Could not parse service account JSON, falling back to default credentials/emulator.', e.message);
  admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
}

// Connect to emulators if env provided (local dev)
if (process.env.FIRESTORE_EMULATOR_HOST) {
  const db = admin.firestore();
  db.settings({ host: process.env.FIRESTORE_EMULATOR_HOST, ssl: false });
}

if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST.replace(/^http:\/\//, '');
}

module.exports = {
  admin,
  db: admin.firestore(),
  auth: admin.auth()
};

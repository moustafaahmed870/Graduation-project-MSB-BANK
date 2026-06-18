// config/firebase.js
const admin = require('firebase-admin');
const path = require('path');

// ✅ استخدم مسار مطلق
const serviceAccount = require(path.join(__dirname, '../../serviceAccountKey.json'));

// تأكد من عدم تهيئته أكثر من مرة
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = { admin, db };
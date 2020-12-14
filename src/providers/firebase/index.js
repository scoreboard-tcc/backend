const admin = require('firebase-admin');
const firebaseConfig = require('../../config/firebase');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: firebaseConfig.databaseUrl,
  storageBucket: firebaseConfig.storageBucket,
});

module.exports = admin;

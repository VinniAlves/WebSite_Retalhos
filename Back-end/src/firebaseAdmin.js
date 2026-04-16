const admin = require("firebase-admin");
const serviceAccount = require("../firebaseServiceAccount.json");

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = { firebaseAdmin };
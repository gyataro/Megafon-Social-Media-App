//Firebase admin utility

const admin     = require('firebase-admin');

const SERVICEACCOUNT = require("../megafon-4396da857861.json");

admin.initializeApp({
    credential: admin.credential.cert(SERVICEACCOUNT),
    databaseURL: "https://megafon-fc1c3.firebaseio.com"
});

const db = admin.firestore();

module.exports = { admin, db };
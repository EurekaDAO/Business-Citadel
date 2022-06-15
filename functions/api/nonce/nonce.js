const functions = require("firebase-functions");
const admin = require('firebase-admin');
const crypto = require("crypto");

const db = admin.firestore();

// Create NONCE for FCL Login
exports.createNonce = functions.https.onCall((data, context) => {
    const nonce = crypto.randomBytes(32).toString('hex')

    try {
        db.collection("nonce").doc(nonce).set({
            nonce: nonce
        })
    } catch (error) {
        console.log(error);
        return false
    }

    return {
        appIdentifier: "Awesome App",
        nonce: nonce
    }
});
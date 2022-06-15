const functions = require("firebase-functions");
const admin = require('firebase-admin');
const crypto = require("crypto");
const fcl = require('@onflow/fcl');

const db = admin.firestore();
const auth = admin.auth();
const appIdentifier = "Awesome App"

//Not working with emulator - hardcoding values for development.
// fcl.config()
//     .put("accessNode.api", "http://localhost:8888")
//     .put("flow.network", "testnet")

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
        appIdentifier: appIdentifier,
        nonce: nonce
    }
});

//Remove NONCE from completed FCL Login
exports.verifyNonce = functions.https.onCall(async (data, context) => {
    try {
        const nonce = await db.collection("nonce").doc(data.accountProof.nonce).get()

        if (!nonce.exists) {
            return {
                nonceValid: false
            }
        } else {
            const accountProofData = {
                address: data.accountProof.address,
                nonce: data.accountProof.nonce,
                signatures: data.accountProof.signatures
            }
            
            //Not working with emulator - hardcoding to true for development
            // const validProof = await fcl.AppUtils.verifyAccountProof(appIdentifier, accountProofData)
            const validProof = true

            if (validProof) {
                const token = await auth.createCustomToken(data.accountProof.address)
                return {
                    nonceValid: true,
                    token: token
                }
            } else {
                return {
                    nonceValid: false
                }
            }
        }
    } catch (error) {
        console.log(error);
        return {
            error: true,
            errorMessage: error.message
        }
    }
});
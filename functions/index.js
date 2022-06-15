const functions = require("firebase-functions");
const crypto = require("crypto");

let front_endServer;
exports.front_end = functions.region("us-central1").https.onRequest(async (request, response) => {
    if (!front_endServer) {
        functions.logger.info("Initialising SvelteKit SSR entry");
        front_endServer = require("./front_end/index").default;
        functions.logger.info("SvelteKit SSR entry initialised!");
    }
    functions.logger.info("Requested resource: " + request.originalUrl);
    return front_endServer(request, response);
});

// Create NONCE for FCL Login
exports.createNonce = functions.https.onCall((data, context) => {
    return {
        nonce: crypto.randomBytes(32).toString('hex')
    }
});
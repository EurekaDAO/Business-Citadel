//firebase
import { httpsCallable } from "firebase/functions";
import { functions } from '../firebase/firebaseConfig';

const createNonce = httpsCallable(functions, 'createNonce');

export const resolver = async () => {
    const response = await createNonce()
    return {
        appIdentifier: "Awesome App",
        nonce: response.data.nonce
    }
}
//firebase
import { httpsCallable } from "firebase/functions";
import { functions } from '../firebase/firebaseConfig';

const createNonce = httpsCallable(functions, 'api-nonce-createNonce');

export const resolver = async () => {
    const response = await createNonce()
    return response.data
}
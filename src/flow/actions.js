import { browser } from '$app/env';
import { get } from 'svelte/store';

import * as fcl from "@onflow/fcl";
import "./config";
import { user, profile, transactionStatus, transactionInProgress, txId } from './stores';
//firebase
import { httpsCallable } from "firebase/functions";
import { signInWithCustomToken, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, functions } from '../firebase/firebaseConfig';

if(browser) {
  // set Svelte $user store to currentUser, 
  // so other components can access it
  fcl.currentUser.subscribe(user.set, [])
}

// Lifecycle FCL/Firebase Auth functions
onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    // User is signed into firebase check if logged into FCL account
    // if (!user?.loggedIn) {
    //   try {
    //     signOut(auth)
    //     console.log("signed out of firebase account")
    //   } catch (error) {
    //     // TODO: handle error
    //     console.log(error);
    //   }
    // }
    console.log(user)
  } else {
    // User is signed out
    // ...
  }
});
export const unauthenticate = () => {
  try {
    signOut(auth)
    console.log("signed out of firebase account")
  } catch (error) {
    // TODO: handle error
    console.log(error);
  }
  fcl.unauthenticate()
}
export const logIn = async () => {
  let res = await fcl.authenticate();

  const accountProofService = res.services.find(services => services.type === 'account-proof' );

  if (accountProofService) {
    const verifyNonce = httpsCallable(functions, 'api-nonce-verifyNonce');

    const response = await verifyNonce({ accountProof: accountProofService.data })

    if (response.data.sucess) {
      try {
        const userCredential = await signInWithCustomToken(auth, response.data.token)

        // TODO: Complete some further sign in functions and/or trigger listners
      } catch (error) {
        
      }
    } else {
      if (response.data.errorMessage) {
        // TODO: handle error message
        console.log(response.data.errorMessage)
        unauthenticate()
      } else {
        // TODO: handle invalid NONCE response
        console.log("Invalid NONCE response")
        unauthenticate()
      }
    }
  }
}
export const signUp = () => fcl.signUp()

// init account
export const initAccount = async () => {
  let transactionId = false;
  initTransactionState()

  try {
    transactionId = await fcl.mutate({
      cadence: `
        import EmployeeProfile from 0xProfile

        transaction {
          prepare(account: AuthAccount) {
            // Only initialize the account if it hasn't already been initialized
            if (!EmployeeProfile.check(account.address)) {
              // This creates and stores the profile in the user's account
              account.save(<- EmployeeProfile.new(), to: EmployeeProfile.privatePath)

              // This creates the public capability that lets applications read the profile's info
              account.link<&EmployeeProfile.Base{EmployeeProfile.Public}>(EmployeeProfile.publicPath, target: EmployeeProfile.privatePath)
            }
          }
        }
      `,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50
    })

    txId.set(transactionId);

    fcl.tx(transactionId).subscribe(res => {
      transactionStatus.set(res.status)
      if(res.status === 4) {
        setTimeout(() => transactionInProgress.set(false),2000)
      }
    })

  } catch (e) {
    transactionStatus.set(99)
    console.log(e)
  }
}

// send a transaction to get a user's profile
export const sendQuery = async (addr) => {
  let profileQueryResult = false;

  try {
    profileQueryResult = await fcl.query({
      cadence: `
        import EmployeeProfile from 0xProfile
  
        pub fun main(address: Address): EmployeeProfile.ReadOnly? {
          return EmployeeProfile.read(address)
        }
      `,
      args: (arg, t) => [arg(addr, t.Address)]
    })
    console.log(profileQueryResult)
    profile.set(profileQueryResult);

  } catch(e) {
    console.log(e);
  }
}

export const executeTransaction = async () => {
  initTransactionState()
  try {
    const transactionId = await fcl.mutate({
      cadence: `
        import EmployeeProfile from 0xProfile
  
        transaction(name: String, color: String, info: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&EmployeeProfile.Base{EmployeeProfile.Owner}>(from: EmployeeProfile.privatePath)!
              .setName(name)

            account
              .borrow<&EmployeeProfile.Base{EmployeeProfile.Owner}>(from: EmployeeProfile.privatePath)!
              .setInfo(info)

            account
              .borrow<&EmployeeProfile.Base{EmployeeProfile.Owner}>(from: EmployeeProfile.privatePath)!
              .setColor(color)
          }
        }
      `,
      args: (arg, t) => [
        arg(get(profile).name, t.String),
        arg(get(profile).color, t.String),
        arg(get(profile).info, t.String),
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50
    })

    
    txId.set(transactionId);

    fcl.tx(transactionId).subscribe(res => {
      transactionStatus.set(res.status)
      if(res.status === 4) {
        setTimeout(() => transactionInProgress.set(false),2000)
      }
    })
  } catch(e) {
    console.log(e);
    transactionStatus.set(99)
  }
}

function initTransactionState() {
  txId.set(false);
  transactionInProgress.set(true);
  transactionStatus.set(-1);
}
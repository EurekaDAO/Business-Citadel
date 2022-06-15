import { config } from "@onflow/config";

const resolver = async () => ({
  appIdentifier: "Awesome App (v0.0)",
  nonce: "3037366134636339643564623330316636626239323161663465346131393662",
})

config({
  "app.detail.title": "Business Citadel", // Shows user what dapp is trying to connect
  "app.detail.icon": "https://unavatar.io/boiseitguru.com", // shows image to the user to display your dapp brand
  "accessNode.api": import.meta.env.VITE_ACCESS_NODE_API,
  "discovery.wallet": import.meta.env.VITE_DISCOVERY_WALLET,
  "0xProfile": import.meta.env.VITE_PROFILE_ADDRESS,
  "flow.network": "local",
  "fcl.accountProof.resolver": resolver,
})
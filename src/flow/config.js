import { config } from "@onflow/config";
import { resolver } from "../firebase/nonceResolver";

config({
  "app.detail.title": "Business Citadel", // Shows user what dapp is trying to connect
  "app.detail.icon": "https://unavatar.io/boiseitguru.com", // shows image to the user to display your dapp brand
  "accessNode.api": import.meta.env.VITE_ACCESS_NODE_API,
  "discovery.wallet": import.meta.env.VITE_DISCOVERY_WALLET,
  "0xProfile": import.meta.env.VITE_PROFILE_ADDRESS,
  "flow.network": "local",
  "fcl.accountProof.resolver": resolver,
})
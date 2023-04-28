import "react-native-get-random-values";
import "@ethersproject/shims";
import "fast-text-encoding"; // + `TextEncoder` / `TextDecoder`

if (typeof Buffer === "undefined") {
  globalThis.Buffer = require("buffer").Buffer;
}

// Use a `WebCrypto` polyfill because
// `crypto-browserify` doesn't support `crypto.createPrivateKey(...)`
const { Crypto } = require("@peculiar/webcrypto");
globalThis.crypto = new Crypto();

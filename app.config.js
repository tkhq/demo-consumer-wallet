// @ts-check

const dotenv = require("dotenv");

const envResult = dotenv.config();

if (envResult.error) {
  console.error(envResult.error);
  throw envResult.error;
}

/**
 * @type {import("@expo/config").ExpoConfig}
 */
const config = {
  name: "turnkey-demo-consumer-wallet",
  slug: "turnkey-demo-consumer-wallet",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: envResult.parsed,
  plugins: [
    [
      "expo-barcode-scanner",
      {
        cameraPermission:
          "Allow $(PRODUCT_NAME) to access your camera for QR code scanning.",
      },
    ],
  ],
};

module.exports = config;

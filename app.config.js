// @ts-check

const path = require("path");
const dotenv = require("dotenv");

const envResult = dotenv.config({
  path: path.resolve(process.cwd(), ".env.development.local"),
});

const INCLUDE_ENV_FOR_DEV = process.env.INCLUDE_ENV_FOR_DEV === "1";

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
  extra: {
    ...(INCLUDE_ENV_FOR_DEV ? envResult.parsed : {}),
  },
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

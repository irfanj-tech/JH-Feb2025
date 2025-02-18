// src/config.js


export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const CAPTCHA_SITEKEY = process.env.REACT_APP_CAPTCHA_SITEKEY;
export const COMMENT_THRESHOLD = Number(process.env.REACT_APP_COMMENT_THRESHOLD);

export const config = {
  siteA: {
    siteName: "UpdatedCNN",
    logo: {
      src: "/assets/images/logo-siteA.png",
      alt: "LLC Logo",
    },
    colors: {
      primary: "#FF0000",
      secondary: "#00FF00",
    },
  },
  siteB: {
    siteName: "Vice",
    logo: {
      src: "/assets/images/logo-siteB.png",
      alt: "Vice Logo",
    },
    colors: {
      primary: "#0000FF",
      secondary: "#FF00FF",
    },
  },
  default: {
    siteName: "CNN",
    logo: {
      src: "/assets/images/logo-default.png",
      alt: "CNN Logo",
    },
    colors: {
      primary: " #C8102E",
      secondary: "#000000",
    },
  },
};

// Determine which config to export based on environment variable
const currentConfig = process.env.REACT_APP_CONFIG
  ? config[process.env.REACT_APP_CONFIG]
  : config.default;

export default currentConfig;

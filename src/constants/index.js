/*
 * @flow
 * @providesModule localyyz/constants
 */
/*global __DEV__:true*/

import { Platform } from "react-native";

// other exports
export { default as Sizes } from "./sizes";
export { default as Colours } from "./colours";
export { default as Styles } from "./styles";
export { default as Event } from "./postMessage";
export { default as Config } from "./config";

// keys
export const GOOGLE_PLACES_KEY = "AIzaSyCyDtar76vRMUbDlv6uvTai9b_8F7_UBWE";
export const STRIPE_PUB_KEY = __DEV__
  ? "pk_test_niTKL8wfaUtS6YoRDl6iBaJr"
  : "pk_live_hWOrjVkLRkwWH866iWpqhZen";
export const STRIPE_DEF_MERCHANT_ID = "merchant.com.localyyz.toronto";
export const BRANCH_UUID = "535881353091109066"

// links
export const PRIVACY_POLICY_URI
  = "https://localyyz.com/business/privacy-policy-businesses.html";
export const TERMS_AND_CONDITIONS_URI
  = "https://localyyz.com/business/terms-and-conditions-businesses.html";
export const DEV_REMOTE_API = "https://api-staging.localyyz.com";

// form labels
export const DEFAULT_ADDRESS = "required";
export const DEFAULT_ADDRESS_OPT = "optional";
export const DEFAULT_NAME = "required";
export const DEFAULT_EMAIL = "required";
export const DEFAULT_DISCOUNT_CODE = "optional";

// statuses
export const CART_STATUS_INPROGRESS = "inprogress";
export const CART_STATUS_PAYMENT_SUCCESS = "payment_success";

// search suggestions
export const SEARCH_SUGGESTIONS_MALE = [
  "Dress Shirts",
  "Wingtip Shoes",
  "Shorts",
  "Dolce & Gabbana",
  "Kiton"
];
export const SEARCH_SUGGESTIONS_FEMALE = [
  "Summer Dresses",
  "Rompers",
  "Bikinis",
  "Dolce & Gabbana",
  "Sandals",
  "Quay Sunglasses",
  "Fenty x Puma"
];

// sizes
export { NAVBAR_HEIGHT } from "../components/NavBar";

// toggles
export const IS_DEALS_SUPPORTED = Platform.OS === "ios";

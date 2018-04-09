/*
 * @flow
 * @providesModule localyyz/constants
 */
/*global __DEV__:true*/

export { API_URL, IMGRY_URL } from "./urls";

export { default as Sizes } from "./sizes";
export { default as Colours } from "./colours";
export { default as Styles } from "./styles";
export { default as Event } from "./postMessage";

export const GOOGLE_PLACES_KEY = "AIzaSyCyDtar76vRMUbDlv6uvTai9b_8F7_UBWE";
export const STRIPE_PUB_KEY = __DEV__
  ? "pk_test_niTKL8wfaUtS6YoRDl6iBaJr"
  : "pk_live_hWOrjVkLRkwWH866iWpqhZen";
export const STRIPE_DEF_MERCHANT_ID = "merchant.com.localyyz.toronto";

export const DEFAULT_ADDRESS = "1 Infinite Loop, Cupertino, CA 95014, US";
export const DEFAULT_ADDRESS_OPT = "Suite 100";
export const DEFAULT_NAME = "Johnny Appleseed";

export const CART_STATUS_INPROGRESS = "inprogress";
export const CART_STATUS_PAYMENT_SUCCESS = "payment_success";

export { NAVBAR_HEIGHT } from "../components/NavBar";

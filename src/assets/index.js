/*
 * @flow
 * @providesModule localyyz/assets
 */
/*global require:true*/

export const logo = require("./appIcon/logo.png");
export const navLogo = require("./appIcon/navLogo.png");
export const applePayButton = require("./icons/apple-pay.png");
export const monogram = require("./images/monogram.jpg");

// today's deal
export const girlVideo = require("./videos/girl.mp4");
export const clocksVideo = require("./videos/clocks.mp4");
export const staticVideo = require("./videos/static.mp4");

// categories
const CATEGORY_ICONS = {
  apparel: require("./icons/categories/apparel.png"),
  activewear: require("./icons/categories/activewear.png"),
  coats: require("./icons/categories/coats.png"),
  dresses: require("./icons/categories/dresses.png"),
  handbags: require("./icons/categories/handbags.png"),
  clutches: require("./icons/categories/clutches.png"),
  ["shoulder bags"]: require("./icons/categories/shoulderbags.png"),
  shoes: require("./icons/categories/shoes.png"),
  boots: require("./icons/categories/boots.png"),
  flats: require("./icons/categories/flats.png"),
  heels: require("./icons/categories/heels.png"),
  jewelry: require("./icons/categories/jewelry.png"),
  bracelets: require("./icons/categories/bracelets.png")
};

export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category];
}

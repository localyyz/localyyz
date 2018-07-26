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
  // apparel
  apparel: [require("./icons/categories/apparel.png")],
  activewear: [require("./icons/categories/activewear.png")],
  coats: [require("./icons/categories/coats.png")],
  dresses: [require("./icons/categories/dresses.png")],
  jackets: [require("./icons/categories/jackets.png")],
  jeans: [require("./icons/categories/jeans.png")],
  jumpsuits: [require("./icons/categories/jumpsuits.png")],
  pants: [require("./icons/categories/pants.png")],
  skirts: [require("./icons/categories/shirts.png")],
  shirts: [require("./icons/categories/apparel.png")],
  shorts: [require("./icons/categories/shorts.png")],
  suits: [require("./icons/categories/suits.png")],
  ["sweaters & knitwear"]: [require("./icons/categories/sweaters.png")],
  tops: [require("./icons/categories/tops.png")],
  ["t-shirts"]: [require("./icons/categories/apparel.png")],
  tuxedo: [require("./icons/categories/tuxedo.png")],

  // handbags
  handbags: [require("./icons/categories/handbags.png")],
  clutches: [require("./icons/categories/clutches.png")],
  ["shoulder bags"]: [require("./icons/categories/shoulderbags.png")],

  // shoes
  shoes: [require("./icons/categories/shoes.png")],
  boots: [require("./icons/categories/boots.png")],
  flats: [require("./icons/categories/flats.png")],
  heels: [require("./icons/categories/heels.png")],
  ["lace-ups"]: [require("./icons/categories/laceups.png")],
  ["slip-ons"]: [require("./icons/categories/slipons.png")],
  wedges: [require("./icons/categories/wedges.png")],

  // jewelry
  jewelry: [require("./icons/categories/jewelry.png")],
  bracelets: [require("./icons/categories/bracelets.png")],
  earring: [require("./icons/categories/earring.png")],
  necklaces: [require("./icons/categories/necklaces.png")],
  rings: [require("./icons/categories/jewelry.png")],

  // accessories
  accessories: [require("./icons/categories/accessories.png")],
  belts: [require("./icons/categories/belts.png")],
  cufflinks: [require("./icons/categories/cufflinks.png")],
  gloves: [require("./icons/categories/gloves.png")],
  handkerchiefs: [require("./icons/categories/handkerchief.png")],
  hats: [require("./icons/categories/accessories.png")],
  sunglasses: [require("./icons/categories/sunglasses.png")],

  // cosmetics
  cosmetics: [require("./icons/categories/cosmetics.png")],
  ["after shave"]: [require("./icons/categories/aftershave.png")],
  ["bath bomb"]: [require("./icons/categories/bathbomb.png")],
  ["bath oil"]: [require("./icons/categories/bathoil.png")],
  ["bath salt"]: [require("./icons/categories/bathsalt.png")],
  ["eye liner"]: [require("./icons/categories/eyeliner.png")],
  ["face mask"]: [require("./icons/categories/facemasks.png")],
  ["face wash"]: [require("./icons/categories/cosmetics.png")],
  gel: [require("./icons/categories/gel.png")],
  lipstick: [require("./icons/categories/lipstick.png")],
  mascara: [require("./icons/categories/mascara.png")],
  moisturizer: [require("./icons/categories/moisturizer.png")],
  ["nail polish"]: [require("./icons/categories/nailpolish.png")],
  soap: [require("./icons/categories/soap.png")],

  // sneaker
  sneaker: [require("./icons/categories/sneakers.png")],
  sneakers: [require("./icons/categories/sneakers.png")],

  // swimwear
  swimwear: [require("./icons/categories/swimwear.png")],
  beachwear: [require("./icons/categories/beachwear.png")]
};

export function getCategoryIcon(category, shouldGetPhoto) {
  let categoryList = CATEGORY_ICONS[category];
  return categoryList && categoryList[shouldGetPhoto ? 1 : 0];
}

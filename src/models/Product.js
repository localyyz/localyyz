// third party
import { observable, action } from "mobx";

// custom
import { randInt } from "localyyz/helpers";

// local
import Place from "./Place";

// consts
const MAX_DESCRIPTION_WORD_LENGTH = 20;
export const MAX_TITLE_WORD_LENGTH = 4;
const SUPPORTED_SIZE_CHARTS = [
  "shirt",
  "hooded",
  "jean",
  "pant",
  "sweatpant",
  "shorts",
  "sneaker",
  "shoe",
  "flat"
];

export default class Product {
  @observable id = 0;
  @observable title = "";
  @observable description = "";
  @observable imageUrl = "";
  @observable place = null;
  @observable shopUrl = "";
  @observable category = {};
  @observable variants = [];
  @observable etc = {};
  @observable images = [];
  @observable brand = "";

  @observable thumbUrl = "";
  @observable htmlDescription = "";
  @observable noTagDescription = "";

  @observable sizes = [];
  @observable colors = [];

  // not part of api product object, but to create separate virtual products
  // based on different colors
  @observable selectedColor;

  // TODO: polyfilled for deals until backend supports it
  @observable viewing = 0;
  @observable sold = 0;

  // extra non observables
  place = {};

  constructor(product, selectedColor) {
    this.setProduct(product, selectedColor);

    // bindings
    this.changeDescriptionWordsLength = this.changeDescriptionWordsLength.bind(
      this
    );
    this.changeTitleWordsLength = this.changeTitleWordsLength.bind(this);

    this.changeTitleWordsLength(product.titleWordsLength);
    this.changeDescriptionWordsLength(product.descriptionWordsLength);
  }

  changeTitleWordsLength(limit) {
    this.titleWordsLength = limit;
    return this;
  }

  changeDescriptionWordsLength(limit) {
    this.descriptionWordsLength = limit;
    return this;
  }

  get truncatedDescription() {
    return truncate(
      this.noTagDescription,
      this.descriptionWordsLength || MAX_DESCRIPTION_WORD_LENGTH
    )
      .trim()
      .replace(/ +(?= )/g, "");
  }

  get truncatedTitle() {
    return truncate(this.title, this.titleWordsLength || MAX_TITLE_WORD_LENGTH)
      .trim()
      .replace(/ +(?= )/g, "");
  }

  get numTitleWords() {
    return this.title ? this.title.split(" ").length : 0;
  }

  // not actually selected variant, but used for a virtual instance to get
  // prices, etc for the current color product variant
  get selectedVariant() {
    return this.variants && this.variants.length > 0
      ? this.variants.find(
          variant => variant.etc && variant.etc.color === this.selectedColor

          // can't find a color match, so fallback to the first variant
        ) || this.variants[0]
      : {};

    // no variants, no idea what to do here
  }

  get price() {
    return this.selectedVariant.price || 0;
  }

  get previousPrice() {
    return this.selectedVariant.prevPrice || 0;
  }

  get discount() {
    return this.previousPrice > 0
      ? (this.previousPrice - this.price) / this.previousPrice
      : 0;
  }

  get shippingPolicy() {
    return this.place.shippingPolicy
      && this.place.shippingPolicy.desc.length > 0
      ? this.place.shippingPolicy
      : null;
  }

  get returnPolicy() {
    return this.place.returnPolicy && this.place.returnPolicy.desc.length > 0
      ? this.place.returnPolicy
      : {
          desc: "All sales are final"
        };
  }

  get isUsed() {
    return this.place && this.place.isUsed;
  }

  get isSizeChartSupported() {
    return (
      !!this.category.type
      && !!SUPPORTED_SIZE_CHARTS.find(type => type === this.category.value)
    );
  }

  get isSocial() {
    return (
      (this.place
        && ((this.place.facebookUrl && this.place.facebookUrl.length > 0)
          || (this.place.instagramUrl && this.place.instagramUrl.length > 0)))
      || null
    );
  }

  get associatedPhotos() {
    let photoGroups = this.photoGroups;

    // proposed, group if exists else common
    return photoGroups[this.selectedColor]
      && photoGroups[this.selectedColor].length > 0
      ? photoGroups[this.selectedColor]
      : photoGroups._common;

    // alternative: merge common with group
    // return [...(photoGroups[this.selectedColor] || []), ...photoGroups._common];
  }

  get photoGroups() {
    let currentGroup = "_common";
    let groups = { [currentGroup]: [] };

    // edge case, if only 1 color, no need to group
    if (this.colors.length == 1) {
      return { ...groups, [this.colors[0]]: this.images.slice() };
    }

    // build keys of imageId's to colours
    let keys = {};
    for (let variant of this.variants) {
      if (variant.imageId) {
        keys[variant.imageId] = variant.etc.color;

        // init the group array
        groups[variant.etc.color] = [];
      }
    }

    // cycle through photos until we hit one thats a "key photo" for a known
    // variant, at which we swap the currentGroup

    // assuming images are grouped by colour, and the first group is
    // common to all
    for (let photo of this.images.slice()) {
      // key has changed, so switch new photos into that group
      if (keys[photo.id]) {
        currentGroup = keys[photo.id];
      }

      groups[currentGroup].push(photo);
    }

    // fail safe: if any color at this point doesn't have any images
    // associated, and that _common is empty.
    if (groups["_common"].length == 0) {
      for (let color of this.colors.slice()) {
        if (!groups[color]) {
          groups[color] = this.images.slice();
        }
      }
    }

    return groups;
  }

  @action
  setProduct = (product, selectedColor) => {
    // set or use default value
    for (let k in product) {
      if (product[k]) {
        this[k] = product[k];
      }
    }

    if (product.place) {
      // set up model
      this.place = new Place(product.place);
    }

    // set first color if not specified
    this.selectedColor
      = selectedColor
      || (this.colors && this.colors.length > 0 ? this.colors[0] : "");

    // TODO: polyfill deals data
    this.viewing = randInt(10) + 50;
    this.sold = randInt(10);
  };
}

function truncate(text, wordLimit) {
  const words = text ? text.split(" ") : [];
  const lastWord = words.length > 0 ? words[words.length - 1] : "";
  return words.length > wordLimit
    ? `${words.slice(0, wordLimit).join(" ")}${
        lastWord[lastWord.length - 1] === "." ? "" : "."
      }.`
    : text;
}

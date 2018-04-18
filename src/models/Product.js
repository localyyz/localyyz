import { observable, action } from "mobx";
import { Image } from "react-native";

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
  @observable category;
  @observable variants = [];
  @observable etc;

  @observable thumbUrl;
  @observable htmlDescription;
  @observable noTagDescription;

  @observable sizes;
  @observable colors;

  // image states and observables
  @observable images = [];
  @observable hasImageError = false;
  @observable imageWidth = 0;
  @observable imageHeight = 0;

  constructor(product) {
    this.setProduct(product);

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

  get price() {
    return (
      (this.variants && this.variants.length > 0 && this.variants[0].price) || 0
    );
  }

  get previousPrice() {
    return (
      (this.variants
        && this.variants.length > 0
        && this.variants[0].prevPrice)
      || 0
    );
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
        && (this.place.facebookUrl.length > 0
          || this.place.instagramUrl.length > 0))
      || null
    );
  }

  @action
  setProduct = product => {
    this.id = product.id;
    this.description = product.description;
    this.title = product.title;
    this.imageUrl = product.imageUrl;
    this.shopUrl = product.shopUrl;
    this.variants = product.variants;
    this.etc = product.etc;
    this.place = product.place;
    this.sizes = product.sizes;
    this.colors = product.colors;
    this.category = product.category;
    this.images = product.images;

    this.htmlDescription = product.htmlDescription;
    this.noTagDescription = product.noTagDescription;
    this.thumbUrl = product.thumbUrl;
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

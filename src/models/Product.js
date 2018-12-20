// third party
import { observable } from "mobx";

import { capitalize } from "~/src/helpers";

// local
import Place from "./Place";

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
  @observable genderHint = "";
  @observable imageUrl = "";
  @observable htmlDescription = "";
  @observable noTagDescription = "";

  @observable sizes = [];
  @observable colors = [];
  @observable isFavourite = false;

  // TODO: polyfilled for deals until backend supports it
  @observable liveViews = 0;
  @observable views = 0;
  @observable purchased = 0;

  @observable hasFreeShipping;
  @observable hasFreeReturn;

  // extra non observables
  place = {};

  constructor(product) {
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
  }

  toGA = () => {
    return {
      //id: `${this.id}`,
      //name: this.title,
      //brand: this.brand,
      //price: this.price,
      ////variant: this.selectedVariant
      ////? [this.selectedVariant.etc.color, this.selectedVariant.etc.size]
      ////.filter(v => v)
      ////.map(v => capitalize(v))
      ////.join("/")
      ////: null,
      //category: this.category.type
      //? [this.genderHint, this.category.type, this.category.value]
      //.map(c => capitalize(c))
      //.join("/")
      //: "",
      //quantity: 1
      ////couponCode: "APPARELSALE"
    };
  };
}

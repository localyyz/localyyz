import { observable } from "mobx";

export default class CartItem {
  @observable id;

  @observable product;
  @observable variant;
  @observable quantity;
  @observable price = 0;

  @observable hasError = false;
  @observable error = "";

  constructor(props) {
    for (let k in props) {
      // NOTE: set if passed in, if not use default
      this[k] = props[k] || this[k];
    }
  }
}

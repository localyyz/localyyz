import { observable } from "mobx"

export default class CartItem {
  @observable id

  @observable product
  @observable variant
  @observable quantity
  @observable price = 0

  constructor(props) {
    for (var key in props) {
      // NOTE: set if passed in, if not use default
      this[key] = props[key] || this[key]
    }
  }
}

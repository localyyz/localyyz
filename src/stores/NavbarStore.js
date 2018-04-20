import { observable, action } from "mobx";

export default class NavbarStore {
  @observable isVisible = true;

  // pullup
  @observable isPullupVisible = false;
  @observable pullupHeight;
  @observable pullupClosestHeight;

  constructor() {
    // bindings
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.togglePullup = this.togglePullup.bind(this);
    this.setPullupHeight = this.setPullupHeight.bind(this);
  }

  @action
  show() {
    this.isVisible = true;
  }

  @action
  hide() {
    this.isVisible = false;
    this.togglePullup(false);
  }

  @action
  togglePullup(forceOpen) {
    this.isPullupVisible =
      forceOpen != null ? forceOpen : !this.isPullupVisible;
  }

  @action
  setPullupHeight(height, closest) {
    this.pullupHeight = height || this.pullupHeight;
    this.pullupClosestHeight = closest || this.pullupClosestHeight;
  }
}

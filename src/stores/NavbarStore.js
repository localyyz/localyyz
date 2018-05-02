import { observable, action, computed } from "mobx";
import { Sizes } from "localyyz/constants";

// custom
import { NavBar } from "localyyz/components";
import { HEIGHT_THRESHOLDS } from "../components/NavBar/components/Pullup";

export default class NavbarStore {
  @observable isVisible = true;

  // pullup
  @observable isPullupVisible = false;
  @observable _pullupHeight = HEIGHT_THRESHOLDS[0];
  @observable _pullupClosestHeight = HEIGHT_THRESHOLDS[0];

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
    this.isPullupVisible
      = forceOpen != null ? forceOpen : !this.isPullupVisible;
  }

  @action
  setPullupHeight(height, closest) {
    this._pullupHeight = height || this._pullupHeight;
    this._pullupClosestHeight = closest || this._pullupClosestHeight;
  }

  @computed
  get pullupHeight() {
    return this._pullupHeight - NavBar.HEIGHT - Sizes.OuterFrame;
  }

  @computed
  get pullupClosestHeight() {
    return this._pullupClosestHeight - NavBar.HEIGHT - Sizes.OuterFrame;
  }
}

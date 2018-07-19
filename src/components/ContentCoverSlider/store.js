// third party
import { observable, action } from "mobx";

// custom
import { Sizes } from "localyyz/constants";

export default class ContentCoverSliderUIStore {
  @observable headerHeight = Sizes.Height;

  constructor() {
    this.onLayout = this.onLayout.bind(this);
  }

  @action
  onLayout({ nativeEvent: { layout: { height } } }) {
    this.headerHeight = height;
  }
}

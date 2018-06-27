// third party
import { observable, action } from "mobx";

export default class ContentCoverSliderUIStore {
  @observable headerHeight = 0;

  constructor() {
    this.onLayout = this.onLayout.bind(this);
  }

  @action
  onLayout({ nativeEvent: { layout: { height } } }) {
    this.headerHeight = height;
  }
}

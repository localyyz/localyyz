// import third party
import { observable, action } from "mobx";

export default class ProviderUIStore {
  @observable isVisible = false;
  @observable visibleField;

  constructor(formUIStore) {
    this.forms = formUIStore;

    // bindings
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  @action
  show(field) {
    this.isVisible = true;
    if (field) {
      this.visibleField = field;
    }
  }

  @action
  hide() {
    this.isVisible = false;
  }
}

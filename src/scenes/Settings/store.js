import { action, observable } from "mobx";

export default class SettingsUIStore {
  @observable isGenderVisible = false;
  @observable gender;

  constructor() {
    // bindings
    this.toggleGenderPicker = this.toggleGenderPicker.bind(this);
  }

  @action
  toggleGenderPicker(show) {
    this.isGenderVisible = show != null ? show : !this.isGenderVisible;
  }

  @action
  setGender(gender) {
    this.gender = gender;
  }
}

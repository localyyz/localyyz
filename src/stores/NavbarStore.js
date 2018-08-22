import { observable, action } from "mobx";

// custom
import { Colours } from "localyyz/constants";

// constants
const DEFAULT_NOTIFICATION_DURATION = 10000;

export default class NavbarStore {
  @observable isVisible = true;
  @observable activeTogglerId;

  // used currently for notifications on products added event
  // TODO: really don't like this here, as cart add event shouldn't be
  // in navbar store
  @observable notification;

  constructor() {
    // bindings
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.releaseToggler = this.releaseToggler.bind(this);
    this.setToggler = this.setToggler.bind(this);
    this.notify = this.notify.bind(this);

    // timeout
    this._notificationTimeout;
  }

  @action
  show(togglerId) {
    this.isVisible
      = !this.activeTogglerId || togglerId === this.activeTogglerId
        ? true
        : this.isVisible;
  }

  @action
  hide(togglerId) {
    this.isVisible
      = !this.activeTogglerId || togglerId === this.activeTogglerId
        ? false
        : this.isVisible;
  }

  @action
  releaseToggler(togglerId) {
    this.activeTogglerId
      = togglerId === this.activeTogglerId ? null : this.activeTogglerId;
  }

  @action
  setToggler(togglerId) {
    this.activeTogglerId = togglerId;
  }

  @action
  notify(
    message,
    actionLabel = "View",
    onPress,
    duration = DEFAULT_NOTIFICATION_DURATION,
    backgroundColor = Colours.MenuBackground,
    textColor = Colours.AlternateText,
    icon
  ) {
    this.notification = message
      ? {
          message: message,
          actionLabel: actionLabel,
          onPress: onPress,
          duration: duration,
          backgroundColor: backgroundColor,
          textColor: textColor,
          icon: icon
        }
      : undefined;
    this._notificationTimeout && clearTimeout(this._notificationTimeout);

    // kill the message once duration is over
    if (message) {
      this._notificationTimeout = setTimeout(() => this.notify(), duration);
    }
  }
}

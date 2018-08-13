import { observable, action, computed } from "mobx";
import { Sizes } from "localyyz/constants";

// custom
import { Colours } from "localyyz/constants";
import { NavBar } from "localyyz/components";
import { HEIGHT_THRESHOLDS } from "../components/NavBar/components/Pullup";

// constants
const DEFAULT_NOTIFICATION_DURATION = 10000;

export default class NavbarStore {
  @observable isVisible = true;

  // pullup
  @observable isPullupVisible = false;
  @observable _pullupHeight = HEIGHT_THRESHOLDS[0];
  @observable _pullupClosestHeight = HEIGHT_THRESHOLDS[0];

  // used currently for notifications on products added event
  // TODO: really don't like this here, as cart add event shouldn't be
  // in navbar store
  @observable notification;

  constructor() {
    // bindings
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.togglePullup = this.togglePullup.bind(this);
    this.setPullupHeight = this.setPullupHeight.bind(this);
    this.notify = this.notify.bind(this);

    // timeout
    this._notificationTimeout;
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

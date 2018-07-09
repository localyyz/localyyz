import {
  GoogleAnalyticsTracker,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";
import DeviceInfo from "react-native-device-info";

export default class GoogleAnalytics {
  constructor() {
    this.tracker = null;
    this.initialize = this.initialize.bind(this);
    this.trackEvent = this.trackEvent.bind(this);
    this.trackScreen = this.trackScreen.bind(this);
  }

  initialize(trackingCode) {
    if (
      trackingCode != null
      && typeof trackingCode === "string"
      && this.tracker == null
    ) {
      let uniqueID = DeviceInfo.getUniqueID();
      this.tracker = new GoogleAnalyticsTracker(trackingCode);
      this.tracker.allowIDFA(true);
      this.tracker.setClient(uniqueID);
      if (!__DEV__) {
        GoogleAnalyticsSettings.setDispatchInterval(30);
      }
    }
  }

  trackEvent(category, action, label, value) {
    if (this.tracker != null) {
      this.tracker.trackEvent(category, action, {
        label: label,
        value: value
      });
    }
  }

  trackScreen(screenName) {
    if (this.tracker != null) {
      this.tracker.trackScreenView(screenName);
    }
  }
}

import {
  GoogleAnalyticsTracker,
  GoogleAnalyticsSettings
} from "react-native-google-analytics-bridge";
import DeviceInfo from "react-native-device-info";
/*global __DEV__:true*/

export default class GoogleAnalytics {
  constructor() {
    this.tracker = null;
  }

  get ProductActions() {
    return {
      Detail: 1,
      Click: 2,
      Add: 3,
      Remove: 4,
      Checkout: 5,
      CheckoutOption: 6,
      Purchase: 7,
      Refund: 8
    };
  }

  initialize = trackingCode => {
    if (
      trackingCode != null
      && typeof trackingCode === "string"
      && this.tracker == null
    ) {
      let uniqueID = DeviceInfo.getUniqueID();
      this.tracker = new GoogleAnalyticsTracker(trackingCode);
      this.tracker.allowIDFA(true);
      this.tracker.setClient(uniqueID);

      const interval = __DEV__ ? 30 : 5;
      GoogleAnalyticsSettings.setDispatchInterval(interval);
    }
  };

  trackEvent = (category, action, label, value, payload) => {
    if (this.tracker != null) {
      this.tracker.trackEvent(
        category,
        action,
        {
          label: label,
          value: value
        },
        payload // enhanced ecommerce payload
      );
    }
  };

  trackScreen = screenName => {
    if (this.tracker != null) {
      this.tracker.trackScreenView(screenName);
    }
  };

  trackException = (errMessage, fatal = false, payload = {}) => {
    if (this.tracker != null) {
      this.tracker.trackException(errMessage, fatal, payload);
    }
  };

  dispatch = () => {
    return this.tracker.dispatch();
  };
}

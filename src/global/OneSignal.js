import { default as parent } from "react-native-onesignal";
import { ApiInstance } from "./index";

export default class OneSignal {
  initialize(appId) {
    parent.init(appId, {
      // display in app notification as a push notf
      kOSSettingsKeyInFocusDisplayOption: 2,
      // do not auto prompt user for permission
      kOSSettingsKeyAutoPrompt: false
    });
    parent.addEventListener("ids", this.onIds);
    parent.configure();
  }

  getSubscriptionState = cb => {
    parent.getPermissionSubscriptionState(cb);
  };

  promptNotify = cb => {
    // check the docs. this is only supported on IOS
    parent.promptForPushNotificationPermissions(cb);
  };

  sendTags = tags => {
    parent.sendTags(tags);
  };

  onIds = device => {
    // sync the player id to backend
    ApiInstance.registerPlayerId(device.userId);
  };
}

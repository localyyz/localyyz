import { default as parent } from "react-native-onesignal";
import { ApiInstance } from "./index";

export default class OneSignal {
  initialize(appId) {
    parent.init(appId, { kOSSettingsKeyAutoPrompt: true });
    parent.addEventListener("ids", this.onIds);
    parent.configure();
  }

  sendTags = tags => {
    parent.sendTags(tags);
  };

  onIds = device => {
    // sync the player id to backend
    ApiInstance.registerPlayerId(device.userId);
  };
}

import { Linking } from "react-native";

// constants
const MESSENGER_URI = "https://m.me/localyyz";

// laying groundwork for support interface when we build this
// out in the future
export default class SupportStore {
  message() {
    return Linking.openURL(MESSENGER_URI);
  }
}

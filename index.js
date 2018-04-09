import { AppRegistry } from "react-native";
import { configure } from "mobx";
configure({ enforceActions: true });

import App from "./src/App";

AppRegistry.registerComponent("localyyz", () => App);

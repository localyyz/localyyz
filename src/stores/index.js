/*
 * @flow
 * @providesModule localyyz/stores
 */

/////////////////////////////////////////////////////////////// IMPORT STORES HERE

import AddressStore from "./AddressStore";
import AssistantStore from "./AssistantStore";
import CartStore from "./CartStore";
import HistoryStore from "./HistoryStore";
import LoginStore from "./LoginStore";
import NavigationStore from "./NavigationStore";
import { userStore } from "./UserStore";
import DeviceStore from "./DeviceStore";

//////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////// INITIATE STORES HERE
const loginStore = new LoginStore(userStore);
const addressStore = new AddressStore();
const assistantStore = new AssistantStore();
const cartStore = new CartStore();
const historyStore = new HistoryStore();
const navStore = new NavigationStore();
const deviceStore = new DeviceStore();

//////////////////////////////////////////////////////////////////////////////////

export const stores = {
  addressStore: addressStore,
  assistantStore: assistantStore,
  cartStore: cartStore,
  historyStore: historyStore,
  loginStore: loginStore,
  navStore: navStore,
  userStore: userStore,
  deviceStore: deviceStore
};

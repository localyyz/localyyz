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
import NavbarStore from "./NavbarStore";

//////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////// INITIATE STORES HERE
export const loginStore = new LoginStore(userStore);
export const addressStore = new AddressStore();
export const assistantStore = new AssistantStore();
export const cartStore = new CartStore();
export const historyStore = new HistoryStore();
export const navStore = new NavigationStore();
export const deviceStore = new DeviceStore();
export const navbarStore = new NavbarStore();

//////////////////////////////////////////////////////////////////////////////////

export const stores = {
  addressStore: addressStore,
  assistantStore: assistantStore,
  cartStore: cartStore,
  historyStore: historyStore,
  loginStore: loginStore,
  navStore: navStore,
  userStore: userStore,
  deviceStore: deviceStore,
  navbarStore: navbarStore
};

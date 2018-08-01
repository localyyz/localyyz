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
import { userStore } from "./UserStore";
import DeviceStore from "./DeviceStore";
import NavbarStore from "./NavbarStore";
import SupportStore from "./SupportStore";

//////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////// INITIATE STORES HERE
export const loginStore = new LoginStore(userStore);
export const addressStore = new AddressStore();
export const assistantStore = new AssistantStore();
export const cartStore = new CartStore();
export const historyStore = new HistoryStore();
export const deviceStore = new DeviceStore();
export const navbarStore = new NavbarStore();
export const supportStore = new SupportStore();

//////////////////////////////////////////////////////////////////////////////////

export const stores = {
  addressStore: addressStore,
  assistantStore: assistantStore,
  cartStore: cartStore,
  historyStore: historyStore,
  loginStore: loginStore,
  userStore: userStore,
  deviceStore: deviceStore,
  navbarStore: navbarStore,
  supportStore: supportStore
};

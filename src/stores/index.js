/*
 * @flow
 * @providesModule localyyz/stores
 */

/////////////////////////////////////////////////////////////// IMPORT STORES HERE

import AddressStore from "./AddressStore";
import AssistantStore from "./AssistantStore";
import CartStore from "./CartStore";
import ExpressCartStore from "./ExpressCartStore";
import HistoryStore from "./HistoryStore";
import LoginStore from "./LoginStore";
import userStoreInstance from "./UserStore";
import DeviceStore from "./DeviceStore";
import NavbarStore from "./NavbarStore";
import SupportStore from "./SupportStore";

export { default as Product } from "./ProductStore";

//////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////// INITIATE STORES HERE
export const loginStore = new LoginStore(userStoreInstance);
export const addressStore = new AddressStore();
export const assistantStore = new AssistantStore();
export const historyStore = new HistoryStore();
export const deviceStore = new DeviceStore();
export const navbarStore = new NavbarStore();
export const supportStore = new SupportStore();
export const expressCartStore = new ExpressCartStore();
export const cartStore = new CartStore();
export { default as userStore } from "./UserStore";

//////////////////////////////////////////////////////////////////////////////////

export const stores = {
  addressStore: addressStore,
  assistantStore: assistantStore,
  cartStore: cartStore,
  expressCartStore: expressCartStore,
  historyStore: historyStore,
  loginStore: loginStore,
  userStore: userStoreInstance,
  deviceStore: deviceStore,
  navbarStore: navbarStore,
  supportStore: supportStore
};

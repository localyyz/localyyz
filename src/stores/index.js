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
import UserStore from "./UserStore";
import DeviceStore from "./DeviceStore";
import NavbarStore from "./NavbarStore";
import SupportStore from "./SupportStore";

export { default as Collection } from "./CollectionStore";
export { default as Product } from "./ProductStore";
export { default as Merchant } from "./MerchantStore";
export { default as Category } from "./CategoryStore";

//////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////// INITIATE STORES HERE
export const userStore = new UserStore();
export const loginStore = new LoginStore(userStore);
export const addressStore = new AddressStore();
export const assistantStore = new AssistantStore();
export const historyStore = new HistoryStore();
export const deviceStore = new DeviceStore();
export const navbarStore = new NavbarStore();
export const supportStore = new SupportStore();
export const expressCartStore = new ExpressCartStore();
export const cartStore = new CartStore();

//////////////////////////////////////////////////////////////////////////////////

export const stores = {
  addressStore: addressStore,
  assistantStore: assistantStore,
  cartStore: cartStore,
  expressCartStore: expressCartStore,
  historyStore: historyStore,
  loginStore: loginStore,
  userStore: userStore,
  deviceStore: deviceStore,
  navbarStore: navbarStore,
  supportStore: supportStore
};

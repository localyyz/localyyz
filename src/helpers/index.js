/*
 * @flow
 * @providesModule localyyz/helpers
 */

import { NavigationActions } from "react-navigation";
import { Alert } from "react-native";
import { observable, computed } from "mobx";
export { default as isCssColor } from "./csscolor";
export { default as linkParser } from "./linkparser";

// usage:
// - instead of the typical `@observable x;`
// pattern used by mobx, wrap the prop by
// `@box x;`
// it will now inherit the custom getter and setter functions
export const box = (target, name, descriptor) => {
  const privateName = `_${name}`;
  observable(target, privateName, descriptor);
  return computed(target, name, {
    get() {
      return this[privateName];
    },
    set(value) {
      this[privateName] = value;
    }
  });
};

export const resetHome = params => {
  let opt = {
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: "App",
        params: params
      })
    ],
    key: null
  };
  return NavigationActions.reset(opt);
};

export const changeTab = (tab, params) => {
  return {
    type: "tab",
    routeName: tab,
    params: params
  };
};

export const resetAction = (routeName, params = {}) => {
  let opt = {
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: routeName,
        params: params
      })
    ]
  };
  if (routeName === "Login") {
    opt.key = null;
  }
  return NavigationActions.reset(opt);
};

export const paramsAction = (key, params = {}) => {
  return NavigationActions.setParams({
    params: params,
    key: key
  });
};

export function randInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function onlyIfLoggedIn({ hasSession }, action, navigation) {
  if (hasSession) {
    action && action();
  } else if (navigation) {
    // only show CTA if navigation is given
    Alert.alert("Please login or create a new account", null, [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "OK",
        onPress: () =>
          navigation.navigate("Login", {
            appContext: "product"
          })
      }
    ]);
  }
}
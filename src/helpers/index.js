/*
 * @flow
 * @providesModule localyyz/helpers
 */

import { NavigationActions } from "react-navigation";
import { Alert } from "react-native";
import { observable, computed } from "mobx";
import getSymbolFromCurrency from "currency-symbol-map";
export { default as isCssColor } from "./csscolor";
export { default as linkParser } from "./linkparser";

// usage:
// - instead of the typical `@observable x;`
// pattern used by mobx, wrap the prop by
// `@box x;`
// it will now inherit the custom getter and setter functions
export function box(target, name, descriptor) {
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
}

// cancelable promise calls
export const makeCancelable = promise => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
      error => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error))
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    }
  };
};

// gets the current screen from navigation state
export function getActiveRoute(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  // return route if no children routes
  // else, recurse
  return route.routes ? getActiveRoute(route) : route;
}

export function paramsAction(key, params = {}) {
  return NavigationActions.setParams({
    params: params,
    key: key
  });
}

export function randInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function capitalize(string) {
  return (string + "").replace(/^(.)|\s+(.)/g, function($1) {
    return $1.toUpperCase();
  });
}

export function capitalizeSentence(string) {
  return string
    .split(" ")
    .map((word, i) => (i > 0 ? word : capitalize(word)))
    .join(" ");
}

export function onlyIfLoggedIn({ hasSession }, action, navigation) {
  if (hasSession) {
    action && action();

    return true;
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

    // used to trigger external events
    return false;
  }
}

export function withCommas(number) {
  return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
}

export function toPriceString(
  price,
  currency = "USD",
  avoidFree = false,
  round = true
) {
  let base = round ? 1 : 100;
  return price != null
    ? price > 0 || avoidFree
      ? `${getSymbolFromCurrency(currency) || "$"}${withCommas(
          (Math.round(price * base) / base).toFixed(`${base}`.length - 1)
        )}`
      : "Free"
    : "";
}

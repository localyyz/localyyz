/*
 * @flow
 * @providesModule localyyz/global
 */

import Api from "./Api";
import GoogleAnalytics from "./GoogleAnalytics";
import OneSignal from "./OneSignal";

export const ApiInstance = new Api();
export const GA = new GoogleAnalytics();
export const OS = new OneSignal();

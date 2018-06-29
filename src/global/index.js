/*
 * @flow
 * @providesModule localyyz/global
 */

import Api from "./Api";
import GoogleAnalytics from "./GoogleAnalytics";

export const ApiInstance = new Api();
export const GA = new GoogleAnalytics();

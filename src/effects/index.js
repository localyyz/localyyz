/*
 * @flow
 * @providesModule localyyz/effects
 */

export { default as storage } from "./io/storage"
export { default as facebook } from "./facebook"
export { default as ApplePayExpressPayment } from "./payments/applePay"
//export { default as gps } from "./gps"

export const wait = delay => {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

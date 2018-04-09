import {
  LoginManager,
  AccessToken,
  AppInviteDialog,
  ShareDialog,
  AppEventsLogger
} from "react-native-fbsdk"

const facebook = {
  login: async () => {
    try {
      const access = ["email", "public_profile"]
      let token = null

      const result = await LoginManager.logInWithReadPermissions(access)
      if (!result.isCancelled) {
        const data = await AccessToken.getCurrentAccessToken()
        token = data.accessToken.toString()
      }

      return token
    } catch (e) {
      //nothing
      console.log(e)
    }
  },

  // https://developers.facebook.com/docs/app-invites/ios
  invite: async () => {
    const appInviteContent = {
      applinkUrl: "https://fb.me/1905643433087470"
    }
    return AppInviteDialog.canShow(appInviteContent).then(canShow => {
      if (canShow) {
        return AppInviteDialog.show(appInviteContent)
      }
    })
  },

  share: async description => {
    // Build up a shareable link.
    let shareLinkContent = {
      contentType: "link",
      contentUrl: "https://localyyz.com",
      quote: "",
      // NOTE: 2.9 deprecated, use quote instead?
      contentTitle: "New deals on Localyyz",
      contentDescription: description
    }

    return ShareDialog.canShow(shareLinkContent).then(function(canShow) {
      if (canShow) {
        return ShareDialog.show(shareLinkContent)
      }
    })
  },
  // log event wrapper cases
  logEvent: (eventName, value, opts) => {
    if (value && opts) {
      AppEventsLogger.logEvent(eventName, value, opts)
    } else if (value) {
      AppEventsLogger.logEvent(eventName, value)
    } else if (opts) {
      AppEventsLogger.logEvent(eventName, opts)
    } else {
      AppEventsLogger.logEvent(eventName)
    }
  },
  logPurchase: (purchaseAmount, currencyCode, params) => {
    AppEventsLogger.logPurchase(purchaseAmount, currencyCode, params)
  }
}

export default facebook

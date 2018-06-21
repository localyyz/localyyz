import { observable, runInAction } from "mobx";
import { Platform } from "react-native";

import { ApiInstance } from "localyyz/global";
import DeviceInfo from "react-native-device-info";
import codePush from "react-native-code-push";

// custom
import { ApplePayExpressPayment } from "localyyz/effects";

export default class DeviceStore {
  @observable applePaySupported = false;

  constructor() {
    this.api = ApiInstance;

    // check if apple pay is supported on the current device
    if (Platform.OS == "ios") {
      this.checkApplePay();
    }
  }

  // TODO: check android pay if android device

  checkApplePay = () => {
    // at app launch, check if apple pay is supported
    // ->
    // show express button when a supported express
    // method is available on the product page
    //
    const _apep = new ApplePayExpressPayment(
      // use stubs since we're just checking for
      // device support here
      "stub",
      [
        {
          label: "stub",
          amount: "1"
        }
      ]
    );

    // TODO: isSupported is not actually implemented.
    _apep
      .isSupported()
      .then(supported => {
        runInAction("[ACTION] check apple pay", () => {
          this.applePaySupported = supported;
        });
      })
      .catch(console.log);
  };

  getDeviceData = () => {
    let referer = DeviceInfo.getInstallReferrer();
    let buildNumber = DeviceInfo.getBuildNumber();
    let brand = DeviceInfo.getBrand();
    let systemName = DeviceInfo.getSystemName();
    let deviceID = DeviceInfo.getDeviceId();
    let uniqueID = DeviceInfo.getUniqueID();

    //on android the build number is a number(on ios its a string) but the backend is expecting a string
    if (Platform.OS !== "ios") {
      buildNumber = buildNumber.toString();
    }

    return {
      referer: referer != null ? referer : "",
      buildNumber: buildNumber != null ? buildNumber : "",
      brand: brand != null ? brand : "",
      systemName: systemName != null ? systemName : "",
      deviceID: deviceID != null ? deviceID : "",
      uniqueID: uniqueID != null ? uniqueID : ""
    };
  };

  sendDeviceData = () => {
    const route = "/ping/";
    codePush.getUpdateMetadata(codePush.UpdateState.LATEST).then(metadata => {
      let payload = this.getDeviceData();
      if (metadata) {
        payload.codePushVersion = metadata.label;
      }
      return this.api.post(route, payload);
    });
  };
}

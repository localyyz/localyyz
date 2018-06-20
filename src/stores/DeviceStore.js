import { observable, runInAction } from "mobx";
import { Platform } from "react-native";

import { ApiInstance } from "localyyz/global";

// custom
import { ApplePayExpressPayment } from "localyyz/effects";

export default class DeviceStore {
  @observable applePaySupported = false;

  constructor() {
    // check if apple pay is supported on the current device

    if (Platform.OS == "ios") {
      this.checkApplePay();
    }
    this.api = ApiInstance;
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

  sendDeviceData = deviceData => {
    const route = "/ping/";
    let payload = {
      installReferer: deviceData.installReferer,
      buildNumber: deviceData.buildNumber,
      brand: deviceData.brand,
      systemName: deviceData.systemName,
      deviceID: deviceData.deviceID
    };

    return this.api.post(route, payload);
  };
}

import axios from "axios";
import qs from "qs";
import DeviceInfo from "react-native-device-info";
import { Alert } from "react-native";

// custom
import { linkParser, capitalizeSentence } from "localyyz/helpers";

// constants
const RETRY_TIMEOUT = 3000;
const RETRY_LIMIT = 10;
const DEBUG = false;

export default class Api {
  constructor(apiUrl) {
    apiUrl && this.initialize(apiUrl);
  }

  initialize(apiUrl) {
    this.alertActive = false;
    this.lastAlerted = new Date();
    this.apiUrl = apiUrl;
    this._client = axios.create({
      baseURL: apiUrl,
      timeout: 15000,
      params: {
        limit: 10
      }
    });

    // retry client connection if failed
    if (!this._client) {
      this.handleErr();
      this.initialize(this.apiUrl);
    } else {
      // TODO: this is terrible. don't try it at home kids
      // This is here so backend can create a new account if the user is not
      // logged-in. Create a shadow account based on the device id
      this._client.defaults.headers.common[
        "X-DEVICE-ID"
      ] = DeviceInfo.getUniqueID();
    }
  }

  handleErr(err, tracking = {}) {
    let _error;

    // client not connected
    if (!this._client) {
      _error = { message: "Client disconnected" };
      this.initialize(this.apiUrl);
    } else {
      _error = err.response
        ? {
            status: err.response.status,
            error: { data: err.response.data },
            message:
              err.response.data
              && err.response.data.status
              && capitalizeSentence(err.response.data.status),
            details:
              err.response.data
              && err.response.data.error
              && capitalizeSentence(err.response.data.error)
          }
        : { message: err.message && capitalizeSentence(err.message) };
    }

    // debug
    DEBUG
      && console.log(
        "API: Failed because",
        _error.message || "not sure",
        tracking.message || ""
      );

    return {
      hasError: true,
      error: _error,
      ...(_error.status >= 400 && _error.status <= 499
        ? { isCritical: true }
        : {})
    };
  }

  /* register a push notification token */
  registerToken = async token => {
    try {
      return await this._client.put("users/me/device", { deviceToken: token });
    } catch (err) {
      this.handleErr(err);
    }
  };

  setAuth(token) {
    this._client.defaults.headers.common["Authorization"] = token;
  }

  // http method functions
  async get(path, params = {}, mandatory = false, attempts = []) {
    try {
      const response = await this._client.get(path, {
        params: params,
        paramsSerializer: params => {
          return qs.stringify(params, { indices: false });
        }
      });
      let parsed = linkParser(response.headers["link"]);
      response.link = parsed;
      return {
        ...response,
        ...(attempts.length > 0 ? { attempts: attempts } : null)
      };
    } catch (err) {
      let err = this.handleErr(err, { message: `(GET ${path})` });
      DEBUG
        && !!err.isCritical
        && console.log("Critical network failure: retries aborted");

      // don't attempt again if over limit or always if required to succeed
      // + only if not critical failure
      if (!err.isCritical && (attempts.length < RETRY_LIMIT || mandatory)) {
        await asyncTimeout(RETRY_TIMEOUT);

        // if over limit, but mandatory, just alert the user before continuing
        let now = new Date();
        if (
          mandatory
          && !(attempts.length % RETRY_LIMIT)
          // prevent multiple calls to alert (there can be multiple mandatory
          // get calls)
          && now - this.lastAlerted >= RETRY_TIMEOUT * RETRY_LIMIT
          && !this.alertActive
        ) {
          this.lastAlerted = now;
          this.alertActive = true;
          await asyncAlert(
            "Network offline",
            "We're having issues connecting right now. We'll keep trying to restore your connection",
            () => (this.alertActive = false)
          );
        }

        DEBUG
          && console.log(
            "API: Re-attempting GET",
            path,
            `(Attempt #${attempts.length + 1})`
          );
        return await this.get(path, params, mandatory, [...attempts, err]);
      } else {
        return { ...err, attempts: attempts };
      }
    }
  }

  async put(path, payload = null) {
    try {
      return await this._client.put(path, payload);
    } catch (err) {
      return this.handleErr(err);
    }
  }

  async post(path, payload = null, params = {}) {
    try {
      const response = await this._client.post(path, payload, {
        params: params,
        paramsSerializer: params => {
          return qs.stringify(params, { indices: false });
        }
      });
      let parsed = linkParser(response.headers["link"]);
      response.link = parsed;
      return response;
    } catch (err) {
      return this.handleErr(err);
    }
  }

  async delete(path) {
    try {
      return await this._client.delete(path);
    } catch (err) {
      return this.handleErr(err);
    }
  }
}

function asyncTimeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function asyncAlert(title, message, action) {
  return new Promise(resolve =>
    Alert.alert(title, message, [
      {
        text: "OK",
        onPress: () => {
          action && action();
          resolve();
        }
      }
    ])
  );
}

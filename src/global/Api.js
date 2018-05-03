import axios from "axios";
import qs from "qs";
import DeviceInfo from "react-native-device-info";
import { linkParser } from "localyyz/helpers";

export default class Api {
  _client;

  initialize(apiUrl) {
    this._client = axios.create({
      baseURL: apiUrl,
      timeout: 15000,
      params: {
        limit: 10
      }
    });

    // TODO: this is terrible. don't try it at home kids
    // This is here so backend can create a new account if the user is not
    // logged-in. Create a shadow account based on the device id
    this._client.defaults.headers.common[
      "X-DEVICE-ID"
    ] = DeviceInfo.getUniqueID();
  }

  handleErr(err) {
    // if error status is unauthorized, ie: 401. clear user
    const e = err.response ? err.response.data : err.message;
    return { ...e, status: err.response && err.response.status };
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
  async get(path, params = {}) {
    try {
      const response = await this._client.get(path, {
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

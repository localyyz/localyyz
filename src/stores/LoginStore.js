import { observable, computed, runInAction, action } from "mobx";
import moment from "moment";

import { facebook, storage } from "localyyz/effects";
import { ApiInstance } from "localyyz/global";

export default class LoginStore {
  @observable _loggedInSince;
  @observable _wasLoginSkipped;

  constructor(userStore) {
    this.api = ApiInstance;
    this.user = userStore;

    // bindings
    this.handleErr = this.handleErr.bind(this);
  }

  @computed
  get _wasLoginSuccessful() {
    return !!this._loggedInSince;
  }

  @action
  skipLogin = async (value = true) => {
    await storage.save("skipLogin", { value });
  };

  @action
  signup = async user => {
    try {
      const resp = await this.api.post("signup", user);

      await storage.save("session", resp.data);
      this.user.model.update(resp.data);
      const token = `BEARER ${this.user.model.token}`;

      // update the global api instance with the user's login token
      this.api.setAuth(token);

      // log facebook event
      facebook.logEvent("fb_mobile_complete_registration", null, {
        fb_registration_method: "email"
      });

      this._loginSuccess("signup");
    } catch (err) {
      this.handleErr(err);
    }
    return this._wasLoginSuccessful;
  };

  logout = async () => {
    await storage.remove("session");
    this.user.model.reset();
    this.api.setAuth("");

    // and finally, unset _loggedInSince
    runInAction("[ACTION] Logging out", () => {
      this._loggedInSince = null;
    });
  };

  shouldSkipLogin = async () => {
    const store = await storage.load("skipLogin");
    return store && store.value;
  };

  _loginSuccess = (type = "") => {
    runInAction(`[ACTION] ${type} record last attmped login`, () => {
      this._loggedInSince = moment().unix();
    });
  };

  _loginViaEmail = async (email, password) => {
    try {
      const response = await this.api.post("login", { email, password });
      if (response && response.data) {
        await storage.save("session", response.data);
        const token = `BEARER ${response.data.jwt}`;

        // update the global api instance with the user's login token
        this.api.setAuth(token);

        console.log(this.api);

        // mark login as success
        //  updating the user model + login success status has side-effects
        //  that may trigger network calls across other components
        //
        //  ie home and cart
        this.user.model.update(response.data);
        this._loginSuccess("email");
      }
    } catch (err) {
      this.handleErr(err);
    }
  };

  _loginViaFacebook = async () => {
    const fbtoken = await facebook.login();
    if (fbtoken) {
      try {
        const response = await this.api.post("login/facebook", {
          token: fbtoken
        });

        await storage.save("session", response.data);
        const token = `BEARER ${response.data.jwt}`;

        // update the global api instance with the user's login token
        this.api.setAuth(token);

        // mark login as success
        //  updating the user model + login success status has side-effects
        //  that may trigger network calls across other components
        //
        //  ie home and cart
        this.user.model.update(response.data);
        this._loginSuccess("fb");

        // log facebook event
        facebook.logEvent("fb_mobile_complete_registration", null, {
          fb_registration_method: "facebook"
        });
      } catch (err) {
        this.handleErr(err);
      }
    }
  };

  _loginViaStorage = async () => {
    const session = await storage.load("session");

    if (session) {
      // update the global api instance with the user's login token
      this.api.setAuth(`BEARER ${session.jwt}`);
      this.user.model.update(session);

      //check with server if we need to bust cache
      await this.api
        .get("/users/me/ping", { lu: session.cachedAt || 0 }, true)
        .then(async ping => {
          if (ping && ping.status === 205) {
            //cache bust the storage
            await this.api.get("/users/me").then(async me => {
              await storage.save("session", {
                ...me.data,
                jwt: session.jwt
              });
              this.user.model.update(me.data);
            });
          }
        });

      this._loginSuccess("storage");
    } else {
      // try to find if the user skipped login already
      // if no session + no skipLogin, return early
      const skipLogin = await storage.load("skipLogin");
      if (skipLogin && skipLogin.value) {
        runInAction("[ACTION] skipped login", () => {
          this._wasLoginSkipped = true;
        });
      }
    }
  };

  @action
  login = async (type, payload) => {
    const { email, password } = payload || {};

    switch (type) {
      case "facebook":
        await this._loginViaFacebook();
        break;
      case "email":
        await this._loginViaEmail(email, password);
        break;
      case "storage":
        await this._loginViaStorage();
        break;
    }

    return this._wasLoginSuccessful;
  };

  handleErr(err) {
    console.log(
      err.response
        ? `[Login Error] Status ${err.response.status}: ${err.response.data}`
        : `[Login Error] ${err.message}`
    );
  }
}

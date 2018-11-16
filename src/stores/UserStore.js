import { runInAction, action, observable, computed } from "mobx";

import { storage } from "~/src/effects";
import { ApiInstance } from "~/src/global";
import { User as UserModel } from "~/src/models";

export default class UserStore extends UserModel {
  @observable _onboarded = true;

  constructor(user) {
    super(user);
    storage.load("onboarded", (val) => {
      runInAction("[ACTION] get onboarded", () => {
        this._onboarded = !!val;
      })
    });
  }

  @computed
  get shouldOnboard() {
    return !this._onboarded;
  }

  markOnboarded = async () => {
    runInAction("[ACTION] set onboarded", () => {
      this._onboarded = true;
    })
    await storage.save("onboarded", { v: 1 });
  };

  @action
  savePreferences = async preferences => {
    const resolved = await ApiInstance.put("users/me", {
      preference: preferences
    });
    if (resolved.error) {
      return Promise.resolve({ error: resolved.error });
    }

    await storage.save("session", {
      ...resolved.data,
      jwt: this.jwt
    });
    this.update(resolved.data);
    return Promise.resolve({ success: true });
  };
}

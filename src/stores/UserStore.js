import { action } from "mobx";

import { storage } from "~/src/effects";
import { ApiInstance } from "~/src/global";
import { User as UserModel } from "~/src/models";

export default class UserStore extends UserModel {
  constructor(user) {
    super(user);
  }

  hasOnboarded = async cb => {
    storage.load("onboarded", cb);
  };

  markOnboarded = () => {
    storage.save("onboarded", { v: 1 });
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

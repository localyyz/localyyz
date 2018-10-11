import { action } from "mobx";

import { ApiInstance } from "~/src/global";
import { User as UserModel } from "localyyz/models";

export default class UserStore extends UserModel {
  constructor(user) {
    super(user);
  }

  @action
  savePreferences = async preferences => {
    const resolved = await ApiInstance.put("users/me", {
      preference: preferences
    });
    if (resolved.error) {
      return Promise.resolve({ error: resolved.error });
    }

    this.update(resolved.data);
    return Promise.resolve({ success: true });
  };
}

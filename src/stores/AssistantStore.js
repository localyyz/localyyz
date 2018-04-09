import { observable, action } from "mobx";

export default class AssistantStore {
  @observable messages = [];
  @observable lastUpdated;

  @action
  write = (message, duration, blockProgress) => {
    this.messages.push({
      message: message,
      duration: duration,
      blockProgress: blockProgress
    });
  };

  @action
  ping = () => {
    this.lastUpdated = new Date();
  };

  get = message => {
    return (
      this.messages.find(m => m.message === message) || {
        cancel: () => false
      }
    );
  };
}

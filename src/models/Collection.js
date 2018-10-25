import { observable, action } from "mobx";

export default class Collection {
  @observable collaborators;
  @observable createdAt;
  @observable description;
  @observable featured;
  @observable gender;
  @observable id;
  @observable imageHeight;
  @observable imageUrl;
  @observable imageWidth;
  @observable name;
  @observable ordering;
  @observable productCount;

  constructor(props) {
    // do something
    this.update(props);
  }

  @action
  update = props => {
    // set or use default value
    for (let k in props) {
      if (props[k]) {
        this[k] = props[k];
      }
    }
  };
}

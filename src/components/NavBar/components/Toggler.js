import React from "react";
import { View } from "react-native";

// custom
import { randInt } from "localyyz/helpers";

// third party
import { inject } from "mobx-react/native";

@inject(stores => ({
  hideNavbar: stores.navbarStore.hide,
  showNavbar: stores.navbarStore.show,
  setToggler: stores.navbarStore.setToggler
}))
export default class Toggler extends React.Component {
  constructor(props) {
    super(props);

    // set togglerId to register with toggler registry
    this.id = randInt(1000000000) + 1;
    this.props.setToggler(this.id);
  }

  componentDidMount() {
    this.props.hideNavbar(this.id);
  }

  componentWillUnmount() {
    this.props.showNavbar(this.id);
  }

  render() {
    return <View />;
  }
}

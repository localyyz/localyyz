import React from "react";
import { View } from "react-native";

// third party
import { inject } from "mobx-react/native";

@inject(stores => ({
  hideNavbar: () => stores.navbarStore.hide(),
  showNavbar: () => stores.navbarStore.show()
}))
export default class Toggler extends React.Component {
  componentDidMount() {
    this.props.hideNavbar();
  }

  componentWillUnmount() {
    this.props.showNavbar();
  }

  render() {
    return <View />;
  }
}

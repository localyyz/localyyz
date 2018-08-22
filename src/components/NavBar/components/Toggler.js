import React from "react";
import { View } from "react-native";

// custom
import { randInt } from "localyyz/helpers";

// third party
import { inject } from "mobx-react/native";
import PropTypes from "prop-types";

@inject(stores => ({
  hideNavbar: stores.navbarStore.hide,
  showNavbar: stores.navbarStore.show,
  setToggler: stores.navbarStore.setToggler,
  releaseToggler: stores.navbarStore.releaseToggler
}))
export default class Toggler extends React.Component {
  static propTypes = {
    hideNavbar: PropTypes.func.isRequired,
    showNavbar: PropTypes.func.isRequired,
    setToggler: PropTypes.func.isRequired,
    releaseToggler: PropTypes.func.isRequired,
    hasPriority: PropTypes.bool
  };

  static defaultProps = {
    hasPriority: false
  };

  constructor(props) {
    super(props);

    // set togglerId to register with toggler registry
    this.id = randInt(1000000000) + 1;

    // register itself if it wants to be exclusive toggler
    this.props.hasPriority && this.props.setToggler(this.id);
  }

  componentDidMount() {
    this.props.hideNavbar(this.id);
  }

  componentWillUnmount() {
    this.props.showNavbar(this.id);

    // leaving, so release the toggler if possible and was hasPriority
    this.props.hasPriority && this.props.releaseToggler(this.id);
  }

  render() {
    return <View />;
  }
}

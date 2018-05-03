import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colours, Sizes } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import { inject } from "mobx-react";
import { withNavigation } from "react-navigation";
import * as Animatable from "react-native-animatable";

@withNavigation
@inject(stores => ({
  showNavbar: () => stores.navbarStore.show(),
  hideNavbar: () => stores.navbarStore.hide()
}))
export default class ExplodingButton extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    children: PropTypes.node,
    shouldExplode: PropTypes.bool,
    onPress: PropTypes.func,
    color: PropTypes.string,

    // state handled by parent
    isExploded: PropTypes.bool,
    explode: PropTypes.func,

    // mobx injected
    showNavbar: PropTypes.func.isRequired,
    hideNavbar: PropTypes.func.isRequired
  };

  static defaultProps = {
    onPress: () => {},
    isExploded: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState || nextProps.isExploded != prevState.isExploded) {
      return {
        isExploded: nextProps.isExploded
      };
    } else {
      return null;
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      isExploded: props.isExploded
    };

    // refs
    this.exploderRef = React.createRef();
    this.buttonRef = React.createRef();

    // bindings
    this.explode = this.explode.bind(this);
    this._explode = this._explode.bind(this);
    this._onPostExplosion = this._onPostExplosion.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState
      && prevState.isExploded != this.state.isExploded
      && !this.state.isExploded
    ) {
      this.props.showNavbar();
      this.props.navigation.setParams({ gesturesEnabled: true });
      this.button.fadeIn();
    }
  }

  get isExploded() {
    return this.state.isExploded;
  }

  get button() {
    return this.buttonRef.current || { fadeIn: () => {}, fadeOut: () => {} };
  }

  get exploder() {
    return this.exploderRef.current || { transitionTo: () => {} };
  }

  explode() {
    (this.props.explode || this._explode)()
      .then(shouldExplode => shouldExplode && this._onPostExplosion())
      .then(() => this.props.onPress());
  }

  _explode() {
    return new Promise(resolve => {
      this.setState(
        {
          isExploded: true
        },
        () => resolve(this.state)
      );
    });
  }

  _onPostExplosion() {
    this.props.hideNavbar();
    this.props.navigation.setParams({ gesturesEnabled: false });
    this.button.fadeOut(100);
    this.exploder.transitionTo({
      width: Sizes.Height * 2.2,
      height: Sizes.Height * 2.2,
      borderRadius: Sizes.Height,
      bottom: -Sizes.Height,
      right: -Sizes.Height
    });
  }

  // if state internally managed, then expose reset method
  reset() {
    this.setState({ isExploded: false });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.isExploded ? (
          <Animatable.View
            ref={this.exploderRef}
            style={[
              styles.exploder,
              this.props.color && {
                backgroundColor: this.props.color
              }
            ]}/>
        ) : null}
        <Animatable.View ref={this.buttonRef}>
          <TouchableOpacity onPress={() => this.explode()}>
            {this.props.children}
          </TouchableOpacity>
        </Animatable.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },

  exploder: {
    position: "absolute",
    width: 1,
    height: 1,
    borderRadius: 1,
    backgroundColor: Colours.SecondGradient
  }
});

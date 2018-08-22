import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";

// custom
import { NavBar } from "localyyz/components";
import { Colours, Sizes } from "localyyz/constants";

// third party
import * as Animatable from "react-native-animatable";
import PhotoView from "react-native-photo-view";
import LinearGradient from "react-native-linear-gradient";
import EntypoIcon from "react-native-vector-icons/Entypo";

export default class PhotoDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      source: null
    };

    // bindings
    this.toggle = this.toggle.bind(this);
  }

  toggle(forceShow, source) {
    const shouldShow = forceShow != null ? forceShow : !this.state.isVisible;

    // color of statusBar
    StatusBar.setBarStyle(!shouldShow ? "dark-content" : "light-content", true);

    // disable going back via gestures, only via toggle
    this.setState(
      { isVisible: shouldShow, source: source || this.state.source },
      () => {
        this.props.navigation.setParams({ gesturesEnabled: !shouldShow });

        // callback if specified
        this.props.onDismiss && shouldShow === false && this.props.onDismiss();
      }
    );
  }

  render() {
    return (
      this.state.isVisible && (
        <Animatable.View
          animation="fadeIn"
          duration={500}
          style={styles.container}>
          <View style={styles.overlay}>
            <NavBar.Toggler />
            <PhotoView
              source={{ uri: this.state.source }}
              minimumZoomScale={0.9}
              maximumZoomScale={3}
              androidScaleType="center"
              onViewTap={() => this.toggle(false)}
              style={styles.photo}/>
            <LinearGradient
              colors={[Colours.DarkTransparent, Colours.BlackTransparent]}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={styles.options}>
              <Animatable.View animation="fadeInUp" duration={200} delay={500}>
                <EntypoIcon
                  onPress={() => this.toggle(false)}
                  name="chevron-with-circle-down"
                  color={Colours.AlternateText}
                  size={Sizes.Oversized}/>
              </Animatable.View>
            </LinearGradient>
          </View>
        </Animatable.View>
      )
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  overlay: {
    flex: 1,
    backgroundColor: Colours.DarkTransparent,
    alignItems: "center",
    justifyContent: "center"
  },

  photo: {
    width: Sizes.Width,
    height: Sizes.Height,
    backgroundColor: Colours.Transparent
  },

  options: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Sizes.OuterFrame * 4,
    alignItems: "center",
    justifyContent: "center"
  }
});

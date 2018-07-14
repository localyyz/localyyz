import React from "react";
import { View, StyleSheet, Text } from "react-native";

// third party
import { computed } from "mobx";
import { inject, observer } from "mobx-react/native";
import Video from "react-native-video";
import LinearGradient from "react-native-linear-gradient";
import PropTypes from "prop-types";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { Timer } from "localyyz/components";
import { clocksVideo, girlVideo, staticVideo } from "localyyz/assets";

@inject(stores => ({
  currentStatus: stores.dealStore.currentStatus,
  currentTimerTargetArray: stores.dealStore.currentTimerTargetArray
}))
@observer
export default class Background extends React.Component {
  static propTypes = {
    currentTimerTargetArray: PropTypes.array.isRequired,
    currentStatus: PropTypes.number.isRequired,
    onComplete: PropTypes.func
  };

  @computed
  get content() {
    return [
      { video: girlVideo, content: DealWaitingContent },
      { video: clocksVideo, content: DealActiveContent },
      { video: girlVideo, content: DealMissedContent },
      { video: staticVideo, content: DealExpiredContent }
    ][this.props.currentStatus];
  }

  render() {
    return (
      <View style={styles.container}>
        <Video
          muted
          repeat
          playWhenInactive
          resizeMode="cover"
          source={this.content.video}
          style={styles.video}/>
        <View style={styles.content}>
          <LinearGradient
            colors={[Colours.MenuBackground, Colours.BlackTransparent]}
            start={{ y: 1, x: 0 }}
            end={{ y: 0, x: 0 }}
            style={styles.gradient}/>
        </View>
        <this.content.content
          {...this.props}
          target={this.props.currentTimerTargetArray}
          onComplete={this.onComplete}/>
      </View>
    );
  }
}

class DealWaitingContent extends React.Component {
  render() {
    return (
      <View style={[styles.content, styles.centered]}>
        <Text style={[styles.title, styles.header]}>Today at noon</Text>
        <Text style={styles.title}>sale starts in</Text>
        <Text style={styles.title}>
          <Timer
            target={this.props.target}
            onComplete={this.props.onComplete}/>
        </Text>
      </View>
    );
  }
}

class DealActiveContent extends React.Component {
  render() {
    return (
      <View style={[styles.content, styles.centered]}>
        <Text style={styles.title}>{"#DOTD is live!"}</Text>
        <Text style={[styles.title, styles.header]}>
          <Timer
            target={this.props.target}
            onComplete={this.props.onComplete}/>
        </Text>
      </View>
    );
  }
}

class DealMissedContent extends React.Component {
  render() {
    return (
      <View style={[styles.content, styles.centered]}>
        <Text style={[styles.title, styles.header]}>You missed it today</Text>
        <Text style={styles.title}>next deal tomorrow at noon</Text>
        <Text style={styles.title}>
          <Timer
            target={this.props.target}
            onComplete={this.props.onComplete}/>
        </Text>
      </View>
    );
  }
}

class DealExpiredContent extends React.Component {
  render() {
    return (
      <View style={[styles.content, styles.centered]}>
        <Text style={[styles.title, styles.header]}>{".. and it's over"}</Text>
        <Text style={[styles.title, styles.compressed]}>
          next deal tomorrow at noon
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  content: {
    ...Styles.Overlay,
    justifyContent: "flex-end"
  },

  centered: {
    alignItems: "center",
    justifyContent: "center"
  },

  video: {
    height: Sizes.Height / 4,
    width: Sizes.Width
  },

  gradient: {
    height: Sizes.Height / 3,
    width: Sizes.Width
  },

  header: {
    ...Styles.Oversized,
    marginVertical: Sizes.InnerFrame
  },

  compressed: {
    marginHorizontal: Sizes.Width / 4
  },

  title: {
    ...Styles.Text,
    ...Styles.Title,
    ...Styles.Alternate,
    textAlign: "center",
    marginHorizontal: Sizes.OuterFrame
  }
});

import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// custom
import { ConstrainedAspectImage } from "localyyz/components";

// third party
import PropTypes from "prop-types";

export default class Card extends React.Component {
  static propTypes = {
    headerColor: PropTypes.string
  };

  static defaultProps = {
    headerColor: Colours.Accented
  };

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.backgroundImageUrl ? (
          <ConstrainedAspectImage
            source={{ uri: this.props.backgroundImageUrl }}
            constrainWidth={Sizes.Width}/>
        ) : (
          <View style={styles.placeHolder} />
        )}
        <View style={this.props.backgroundImageUrl && styles.wrapper}>
          <View style={styles.content}>{this.props.children}</View>
          <View
            style={[
              styles.header,
              { backgroundColor: this.props.headerColor }
            ]}>
            <Text style={styles.title} numberOfLines={1}>
              {this.props.title}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.InnerFrame / 4
  },

  placeHolder: {
    height: Sizes.OuterFrame,
    backgroundColor: Colours.Transparent
  },

  wrapper: {
    //marginTop: -Sizes.InnerFrame
  },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingVertical: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.InnerFrame,
    marginHorizontal: Sizes.InnerFrame
  },

  title: {
    ...Styles.Text,
    ...Styles.SmallText,
    ...Styles.Emphasized,
    ...Styles.Terminal,
    ...Styles.Alternate
  },

  content: {
    marginTop: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground,
    padding: Sizes.InnerFrame / 2
  }
});

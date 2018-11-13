import React from "react";
import { View, StyleSheet, Text } from "react-native";
import PropTypes from "prop-types";

// custom
import { Colours, Sizes, Styles } from "~/src/constants";
import { ProductTileWidth, ProductTileHeight } from "./ProductTile";
import Badge from "./Badge";

export default class Placeholder extends React.Component {
  static propTypes = {
    scale: PropTypes.number,
    badgeType: PropTypes.number
  };

  static defaultProps = {
    // scale the default height and width by factor
    scale: 1
  };

  render() {
    let width = this.props.scale * ProductTileWidth;
    let height = this.props.scale * ProductTileHeight;
    let badgeMarging = this.props.scale * Sizes.InnerFrame;

    return (
      <View style={styles.container}>
        <View style={styles.photoContainer}>
          <View
            style={{
              width,
              height,
              backgroundColor: Colours.Background
            }}/>
        </View>
        <View style={styles.content}>
          <View
            style={{
              maxWidth: Sizes.Width / 3,
              backgroundColor: Colours.Background
            }}>
            <Text numberOfLines={1} style={Styles.Subtitle}>
              {"    "}
            </Text>
          </View>
        </View>
        <View
          style={[styles.badge, { top: badgeMarging, right: -badgeMarging }]}>
          <Badge
            badgeIcon={this.props.badgeIcon}
            badgeType={this.props.badgeType}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground
  },

  photoContainer: {
    backgroundColor: Colours.Background,
    alignItems: "center",
    justifyContent: "center"
  },

  content: {
    paddingVertical: Sizes.InnerFrame
  },

  badge: {
    position: "absolute",
    top: 0,
    right: 0
  }
});

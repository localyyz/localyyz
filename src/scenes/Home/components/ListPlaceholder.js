import React from "react";
import { View, StyleSheet } from "react-native";
import { Sizes, Colours } from "localyyz/constants";

// third party
import Placeholder from "rn-placeholder";

export default class ListPlaceholder extends React.Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <ListTilePlaceholder />
        <ListTilePlaceholder />
        <ListTilePlaceholder />
        <ListTilePlaceholder />
      </View>
    );
  }
}

class ListTilePlaceholder extends React.Component {
  render() {
    return (
      <View style={styles.tile}>
        <View style={styles.tileContent}>
          <Placeholder.Box
            animate="fade"
            width={(Sizes.Width - Sizes.OuterFrame * 4) / 2}
            height={Sizes.Height / 4}/>
          <View style={styles.tileSpacer} />
          <Placeholder.Paragraph
            animate="shine"
            lineNumber={2}
            textSize={Sizes.Text}
            lineSpacing={Sizes.InnerFrame / 2}
            firstLineWidth="80%"
            lastLineWidth="30%"/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap"
  },

  tile: {
    width: (Sizes.Width - Sizes.InnerFrame * 3) / 2,
    margin: Sizes.InnerFrame / 2,
    alignItems: "center"
  },

  tileSpacer: {
    height: Sizes.OuterFrame / 2
  }
});

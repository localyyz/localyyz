import React from "react";
import { View, StyleSheet } from "react-native";
import { Sizes } from "localyyz/constants";

// third party
import Placeholder from "rn-placeholder";

// constants
const NUM_BRANDS = 12;

export default class BrandsPlaceholder extends React.Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {new Array(this.props.limit || NUM_BRANDS)
          .fill()
          .map((node, i) => (
            <BrandPlaceholder noTitle={this.props.noTitles} key={i} />
          ))}
      </View>
    );
  }
}

class BrandPlaceholder extends React.Component {
  render() {
    return (
      <View style={styles.tile}>
        <View style={styles.tileContent}>
          <Placeholder.Box
            animate="fade"
            width={Sizes.Width / 4}
            height={Sizes.OuterFrame * 2}/>
          {!this.props.noTitle && (
            <View style={styles.tileSpacer}>
              <Placeholder.Line
                animate="shine"
                textSize={Sizes.Text}
                width="60%"/>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: Sizes.InnerFrame / 2
  },

  tile: {
    width: (Sizes.Width - Sizes.InnerFrame) / 3,
    marginVertical: Sizes.InnerFrame * 0.9,
    alignItems: "center"
  },

  tileSpacer: {
    marginTop: Sizes.OuterFrame / 3,
    marginBottom: Sizes.InnerFrame / 3 * 1.1
  }
});

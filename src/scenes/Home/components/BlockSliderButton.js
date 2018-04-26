import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Sizes } from "localyyz/constants";

// third party
import { observer, inject } from "mobx-react";

@inject(stores => ({
  currentBlock: stores.homeStore.currentTrackedBlock
}))
@observer
export default class BlockSliderButton extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text
          style={[
            styles.label,
            this.props.currentBlock === this.props.id && styles.selectedLabel
          ]}>{`${this.props.block.title || this.props.block.type}`}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingHorizontal: Sizes.InnerFrame
  },

  label: {
    ...Styles.Text
  },

  selectedLabel: {
    ...Styles.Emphasized
  }
});

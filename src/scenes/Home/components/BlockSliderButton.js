import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Sizes } from "localyyz/constants";

// third party
import { observer, inject } from "mobx-react/native";
import PropTypes from "prop-types";

@inject((stores, props) => ({
  currentBlock: (stores.homeStore || props.homeStore).currentTrackedBlock
}))
@observer
export default class BlockSliderButton extends React.Component {
  static propTypes = {
    id: PropTypes.any,
    currentBlock: PropTypes.any,
    block: PropTypes.object
  };

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
    ...Styles.Text,
    ...Styles.SmallText
  },

  selectedLabel: {
    ...Styles.Emphasized
  }
});

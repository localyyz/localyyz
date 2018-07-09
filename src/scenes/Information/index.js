import React from "react";
import { View, StyleSheet } from "react-native";

// custom
import { BaseScene } from "localyyz/components";
import { Colours, Sizes } from "localyyz/constants";

export default class InformationScene extends React.Component {
  constructor(props) {
    super(props);
    this.settings = this.props.navigation.state.params;
  }

  render() {
    return (
      <BaseScene
        title={this.settings.title}
        backAction={this.props.navigation.goBack}>
        <View style={styles.container}>{this.settings.content}</View>
      </BaseScene>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Sizes.OuterFrame,
    paddingVertical: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  }
});

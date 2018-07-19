import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Styles, Sizes } from "localyyz/constants";

// custom
import { ConstrainedAspectImage } from "localyyz/components";
import { capitalize } from "localyyz/helpers";

// third party
import { withNavigation } from "react-navigation";
import { observer } from "mobx-react/native";

@observer
export class Brand extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.navigation.navigate("ProductList", {
      fetchPath: this.props.fetchPath,
      title: capitalize(this.props.title),
      subtitle: this.props.description
    });
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={[styles.wrapper, styles.box]}>
        <View style={[styles.wrapper, styles.container]}>
          <View style={styles.wrapper}>
            <ConstrainedAspectImage
              constrainHeight={Sizes.OuterFrame * 2}
              constrainWidth={Sizes.Width / 4}
              source={{ uri: this.props.imageUri }}/>
          </View>
          {this.props.shouldShowName ? (
            <Text numberOfLines={1} style={styles.label}>
              {this.props.title}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(Brand);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  container: {
    margin: 0.5,
    paddingVertical: Sizes.InnerFrame
  },

  label: {
    ...Styles.Text,
    ...Styles.TinyText,
    marginTop: Sizes.InnerFrame
  }
});

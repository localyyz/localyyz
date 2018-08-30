import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// third party
import LinearGradient from "react-native-linear-gradient";
import { computed } from "mobx";
import { observer } from "mobx-react/native";
import { withNavigation } from "react-navigation";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";

@observer
export class Button extends React.Component {
  @computed
  get numProducts() {
    return this.props.store.numProducts || "all";
  }

  close = () => {
    // popout of category + and filter menu
    this.props.navigation.navigate("ProductList");
  };

  // Filter Main scene embeds the Filter component
  // which is a collection of individual filterable parts
  //  all tapped into a single filter store
  render() {
    return (
      <View pointerEvents="box-none" style={styles.footer}>
        <LinearGradient
          pointerEvents="box-none"
          colors={[Colours.WhiteTransparent, Colours.Transparent]}
          start={{ y: 1, x: 0 }}
          end={{ y: 0, x: 0 }}
          style={styles.gradient}>
          <View style={styles.toggle}>
            <TouchableOpacity onPress={this.close}>
              <View style={styles.button}>
                <Text>Show {this.numProducts} Products</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

export default withNavigation(Button);

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },

  gradient: {},

  toggle: {
    alignItems: "center"
  },

  button: {
    ...Styles.RoundedButton,
    alignItems: "center",
    margin: Sizes.InnerFrame,
    paddingHorizontal: Sizes.OuterFrame * 2,
    backgroundColor: Colours.Action
  }
});

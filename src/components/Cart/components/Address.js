import React from "react";
import {
  View, StyleSheet, Text, TouchableOpacity
} from "react-native";
import {
  Colours, Sizes, Styles
} from "localyyz/constants";

// custom
import CartField from "./CartField";

// third party
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";
import EntypoIcon from "react-native-vector-icons/Entypo";

export default class Address extends React.Component {
  render() {
    return (
      <CartField
        icon="home"
        onPress={this.props.onPress}
        onIconPress={this.props.onIconPress}>
        {this.props.children || (
          <View style={styles.address}>
            <Text style={[
              Styles.Text, Styles.Emphasized, Styles.SmallText,
              styles.addressLine]}>
              {this.props.address.shortAddress}
            </Text>
            <Text style={[
              Styles.Text, Styles.Terminal, Styles.Subdued,
              styles.addressDetails]}>
              {this.props.address.extendedAddress}
            </Text>
          </View>)}
        <TouchableOpacity onPress={this.props.onActionPress}>
          <LinearGradient
            colors={[Colours.Foreground, Colours.Transparent]}
            locations={[0.8, 1]}
            start={{x: 1}}
            end={{x: 0}}
            style={styles.iconContainer}>
            <EntypoIcon
              name={this.props.buttonIcon || "edit"}
              size={Sizes.IconButton / 2}
              color={this.props.buttonColor || Colours.Text}
              style={Styles.IconOffset} />
          </LinearGradient>
        </TouchableOpacity>
      </CartField>
    );
  }
}

const styles = StyleSheet.create({
  address: {
    flex: 1,
    flexWrap: "nowrap",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: Sizes.InnerFrame
  },

  addressDetails: {
    textAlign: "left",
    marginLeft: Sizes.InnerFrame / 2,
    paddingRight: Sizes.InnerFrame / 2
  },

  iconContainer: {
    marginLeft: -Sizes.InnerFrame * 2.2
  }
});

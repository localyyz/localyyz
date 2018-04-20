import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import LinearGradient from "react-native-linear-gradient";
import EntypoIcon from "react-native-vector-icons/Entypo";

export default class Address extends React.Component {
  static propTypes = {
    onActionPress: PropTypes.func,
    buttonIcon: PropTypes.string,
    buttonColor: PropTypes.string,
    children: PropTypes.any
  };

  static defaultProps = {
    buttonIcon: "edit",
    buttonColor: Colours.Text
  };

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.container}>
          {this.props.children || (
            <View style={styles.address}>
              <Text style={styles.addressLine}>
                {this.props.address.shortAddress}
              </Text>
              <Text style={styles.addressDetails}>
                {this.props.address.extendedAddress}
              </Text>
            </View>
          )}
          <TouchableOpacity onPress={this.props.onActionPress}>
            <LinearGradient
              colors={[Colours.Foreground, Colours.Transparent]}
              locations={[0.8, 1]}
              start={{ x: 1 }}
              end={{ x: 0 }}
              style={styles.iconContainer}>
              <EntypoIcon
                name={this.props.buttonIcon}
                size={Sizes.IconButton / 2}
                color={this.props.buttonColor}
                style={Styles.IconOffset}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    paddingHorizontal: Sizes.InnerFrame / 2,
    paddingVertical: Sizes.InnerFrame,
    marginVertical: 1,
    backgroundColor: Colours.Foreground
  },

  iconContainer: {
    marginHorizontal: Sizes.InnerFrame / 2
  },

  address: {
    flex: 1,
    flexWrap: "nowrap",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: Sizes.InnerFrame / 2
  },

  addressLine: {
    ...Styles.Text,
    ...Styles.Medium
  },

  addressDetails: {
    ...Styles.Text,
    ...Styles.Subdued,
    textAlign: "left",
    marginLeft: Sizes.InnerFrame / 4,
    paddingRight: Sizes.InnerFrame / 2
  }
});

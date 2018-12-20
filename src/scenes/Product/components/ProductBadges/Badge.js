import React from "react";
import { View, Text, StyleSheet } from "react-native";

// custom
import { Colours, Sizes } from "localyyz/constants";

// third party
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export default class Badge extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.iconBackground}>
          <MaterialIcon
            name={this.props.name}
            size={this.props.size}
            color={this.props.color}/>
        </View>
        <View
          style={{
            paddingTop: 3,
            height: Sizes.InnerFrame * 2.5,
            justifyContent: "center"
          }}>
          <Text style={styles.iconText}>{this.props.label}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: Sizes.Width / 4,
    paddingVertical: Sizes.InnerFrame
  },

  iconBackground: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colours.Accented,
    opacity: 0.65,
    borderRadius: 30,
    width: 60,
    height: 60
  },

  iconText: {
    fontWeight: Sizes.Emphasized
  }
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";

// custom
import { Colours, Sizes } from "localyyz/constants";

// third party
import { withNavigation } from "react-navigation";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export class Badge extends React.Component {
  get Icon() {
    return (
      <View
        style={{
          alignItems: "center",
          width: Sizes.Width / 4
        }}>
        <View style={styles.iconBackground}>
          <MaterialIcon
            name={this.props.name}
            size={this.props.size}
            color={this.props.color}/>
        </View>
        <View
          style={{ paddingVertical: 3, height: 40, justifyContent: "center" }}>
          <Text style={styles.iconText}>{this.props.label}</Text>
        </View>
      </View>
    );
  }

  render() {
    return <View>{this.Icon}</View>;
  }
}

export default withNavigation(Badge);

const styles = StyleSheet.create({
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

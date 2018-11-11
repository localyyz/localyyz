import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Colours, Styles, Sizes } from "localyyz/constants";

// third party
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

export default class Badge extends React.Component {
  render() {
    return (
      <View
        style={[
          styles.container,
          this.props.color && {
            backgroundColor: this.props.color
          },
          this.props.size && {
            minHeight: this.props.size * 1.5
          },
          this.props.style
        ]}>
        <Text
          style={[
            styles.label,
            this.props.size && { fontSize: this.props.size }
          ]}>
          {this.props.children}
        </Text>
        {this.props.icon && (
          <View style={styles.icon}>
            <FontAwesomeIcon
              name={this.props.icon}
              color={Colours.AlternateText}
              size={this.props.size || Sizes.Text}/>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Sizes.InnerFrame * 2 / 3,
    paddingVertical: Sizes.InnerFrame / 4,
    backgroundColor: Colours.Primary,
    minHeight: Sizes.Text * 1.5
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate,
    ...Styles.Terminal
  },

  icon: {
    marginLeft: Sizes.InnerFrame / 2
  }
});

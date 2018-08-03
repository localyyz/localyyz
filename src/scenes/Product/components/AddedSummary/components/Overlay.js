import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";

// third party
import { inject } from "mobx-react/native";
import * as Animatable from "react-native-animatable";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

@inject(stores => ({
  message: stores.supportStore.message
}))
export default class Overlay extends React.Component {
  render() {
    return (
      <View pointerEvents="box-none" style={styles.container}>
        <View pointerEvents="box-none" style={styles.header}>
          <TouchableOpacity onPress={() => this.props.onDismiss()}>
            <MaterialIcon
              name="close"
              size={Sizes.Oversized}
              color={Colours.AlternateText}/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => this.props.message()}>
          <Animatable.View
            animation="fadeInUp"
            duration={200}
            delay={this.props.appearDelay}
            style={styles.footer}>
            <MaterialCommunityIcon
              name="facebook-messenger"
              color={Colours.AlternateText}
              size={Sizes.Oversized}
              style={styles.icon}/>
            <Text style={styles.title}>{"Questions? We're here to help."}</Text>
            <Text style={styles.content}>
              <Text style={Styles.Underlined}>
                {"Contact our support team"}
              </Text>
              {" at any time if you need assistance."}
            </Text>
          </Animatable.View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Overlay,
    justifyContent: "space-between"
  },

  header: {
    padding: Sizes.InnerFrame
  },

  footer: {
    padding: Sizes.OuterFrame,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colours.DarkTransparent
  },

  title: {
    ...Styles.Text,
    ...Styles.Title,
    ...Styles.Alternate,
    textAlign: "center"
  },

  content: {
    ...Styles.Text,
    ...Styles.Alternate,
    textAlign: "center",
    marginTop: Sizes.InnerFrame / 2
  },

  icon: {
    marginBottom: Sizes.InnerFrame
  }
});

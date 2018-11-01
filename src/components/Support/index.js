import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// custom
import { Sizes, Styles } from "localyyz/constants";

// third party
import { inject } from "mobx-react/native";
import * as Animatable from "react-native-animatable";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

@inject(stores => ({
  message: stores.supportStore.message
}))
export default class Support extends React.Component {
  static defaultProps = {
    title: "Do you need help?",
    description: "Message us anytime!",
    appearDelay: 0,
    iconName: "facebook-messenger"
  };

  render() {
    return (
      <View pointerEvents="box-none" style={styles.container}>
        <TouchableOpacity onPress={() => this.props.message()}>
          <Animatable.View
            animation="fadeInUp"
            duration={200}
            delay={this.props.appearDelay}
            style={styles.footer}>
            <MaterialCommunityIcon
              name={this.props.iconName}
              size={Sizes.Oversized}
              style={styles.icon}/>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.content}>
              <Text style={Styles.Underlined}>
                {"Contact our support team"}
              </Text>
              {this.props.subtitle}
            </Text>
          </Animatable.View>
        </TouchableOpacity>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center"
  },

  footer: {
    padding: Sizes.OuterFrame,
    paddingBottom: Sizes.ScreenBottom + Sizes.OuterFrame,
    alignItems: "center",
    justifyContent: "center"
  },

  title: {
    ...Styles.Text,
    ...Styles.Title,
    textAlign: "center"
  },

  content: {
    ...Styles.Text,
    textAlign: "center",
    marginTop: Sizes.InnerFrame / 2
  },

  icon: {
    marginBottom: Sizes.InnerFrame
  }
});

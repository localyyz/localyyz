import React from "react";
import { View, StyleSheet, Text } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";

// third party
import { inject, observer } from "mobx-react/native";
import * as Animatable from "react-native-animatable";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

@inject(stores => ({
  notification: stores.navbarStore.notification
}))
@observer
export default class Notifications extends React.Component {
  render() {
    return this.props.notification ? (
      <Animatable.View
        animation="fadeInUp"
        duration={this.props.notification.duration * 0.05}
        delay={this.props.notification.duration * 0.05}
        style={[
          styles.container,
          this.props.notification.backgroundColor && {
            backgroundColor: this.props.notification.backgroundColor
          }
        ]}>
        <View style={styles.message}>
          <Text
            numberOfLines={1}
            style={[
              styles.messageLabel,
              this.props.notification.textColor && {
                color: this.props.notification.textColor
              }
            ]}>
            {this.props.notification.message}
          </Text>
        </View>
        {this.props.notification.onPress ? (
          <View style={styles.cta}>
            {this.props.notification.actionLabel ? (
              <Text
                style={[
                  styles.messageLabel,
                  this.props.notification.textColor && {
                    color: this.props.notification.textColor
                  }
                ]}>
                {this.props.notification.actionLabel}
              </Text>
            ) : null}
            <MaterialIcon
              name={this.props.notification.icon || "arrow-forward"}
              size={Sizes.SmallText}
              color={this.props.notification.textColor || Colours.AlternateText}
              style={styles.icon}/>
          </View>
        ) : null}
      </Animatable.View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    backgroundColor: Colours.Accented,
    paddingVertical: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.OuterFrame
  },

  message: {
    flex: 1
  },

  messageLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.SmallText,
    ...Styles.Alternate
  },

  cta: {
    ...Styles.Horizontal,
    marginLeft: Sizes.InnerFrame
  },

  icon: {
    marginLeft: Sizes.InnerFrame / 2
  }
});

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

// third party
import PropTypes from "prop-types";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// custom
import { Styles, Sizes, Colours } from "localyyz/constants";

// local
import Header from "./Header";
import Error from "./Error";

export default class BaseField extends React.Component {
  static propTypes = {
    isHorizontal: PropTypes.bool,
    label: PropTypes.string,
    hasError: PropTypes.bool,
    error: PropTypes.string
  };

  static defaultProps = {
    hasError: false,
    isHorizontal: false
  };

  get container() {
    return this.props.onPress ? TouchableOpacity : View;
  }

  get renderContent() {
    return (
      this.props.children
      || (this.props.onPress ? (
        <View style={styles.arrow}>
          <MaterialIcon
            name="keyboard-arrow-right"
            size={Sizes.Text}
            color={Colours.SubduedText}/>
        </View>
      ) : null)
    );
  }

  render() {
    return (
      <this.container
        onPress={this.props.onPress}
        style={[
          styles.container,
          this.props.style,
          this.props.hasMargin && styles.containerMargin
        ]}>
        <View
          style={[
            styles.wrapper,
            (this.props.isHorizontal || !this.props.children)
              && styles.horizontal
          ]}>
          <View style={styles.header}>
            {!this.props.hasError ? (
              <Header {...this.props}>{this.props.label}</Header>
            ) : (
              <Error>{this.props.error}</Error>
            )}
          </View>
          <View style={styles.content}>{this.renderContent}</View>
        </View>
      </this.container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexBasis: Math.min(Sizes.Width / 2, Sizes.InnerFrame * 10)
  },

  containerMargin: {
    marginVertical: Sizes.Spacer
  },

  wrapper: {
    paddingVertical: Sizes.InnerFrame,
    paddingHorizontal: Sizes.OuterFrame,
    backgroundColor: Colours.Foreground
  },

  horizontal: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns
  },

  header: {
    marginRight: Sizes.InnerFrame
  },

  content: {
    flex: 1
  },

  arrow: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  }
});

import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Styles, Sizes } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export default class ExpandedDescription extends React.Component {
  static propTypes = {
    onExpand: PropTypes.func,
    title: PropTypes.string,
    content: PropTypes.string
  };

  static defaultProps = {
    title: "",
    content: ""
  };

  render() {
    return (
      <TouchableOpacity onPress={this.props.onExpand}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{this.props.title}</Text>
            {this.props.onExpand ? (
              <MaterialIcon name="expand-more" size={Sizes.Text} />
            ) : null}
          </View>
          <Text style={styles.content}>{this.props.content}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.InnerFrame
  },

  header: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns
  },

  title: {
    ...Styles.Emphasized,
    fontSize: Sizes.SmallText
  },

  content: {
    marginTop: Sizes.InnerFrame / 4,
    fontWeight: Sizes.Normal,
    fontSize: Sizes.SmallText
  }
});

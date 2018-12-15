import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Styles, Sizes } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export default class ExpandableSection extends React.Component {
  static propTypes = {
    onExpand: PropTypes.func,
    title: PropTypes.string,
    content: PropTypes.string,
    showPreview: PropTypes.bool
  };

  static defaultProps = {
    title: "",
    content: "",
    showPreview: false
  };

  render() {
    return (
      <TouchableOpacity onPress={this.props.onExpand}>
        <View style={styles.container}>
          <View style={styles.header}>
            {this.props.title && (
              <Text style={styles.title}>{this.props.title}</Text>
            )}
            {this.props.onExpand ? (
              <MaterialIcon name="expand-more" size={Sizes.Text} />
            ) : null}
          </View>
          {this.props.showPreview && (
            <Text style={styles.content}>{this.props.content}</Text>
          )}
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
    fontSize: Sizes.SmallText
  },

  content: {
    marginTop: Sizes.InnerFrame / 4,
    fontWeight: Sizes.Normal,
    fontSize: Sizes.SmallText
  }
});

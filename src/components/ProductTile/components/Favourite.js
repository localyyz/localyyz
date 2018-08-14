import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";

import PropTypes from "prop-types";
import EntypoIcon from "react-native-vector-icons/Entypo";

export default class Favourite extends React.PureComponent {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isActive: props.active
    };
  }

  onPress = () => {
    this.setState({ isActive: !this.state.isActive }, this.props.onPress);
  };

  render() {
    return (
      <TouchableWithoutFeedback style={styles.touchable} onPress={this.onPress}>
        <View styles={styles.container}>
          <EntypoIcon
            style={styles.icon}
            color="black"
            name={this.state.isActive ? "heart" : "heart-outlined"}
            size={30}/>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 8
  },
  touchable: {
    overflow: "hidden"
  },
  icon: {
    marginRight: 10
  }
});

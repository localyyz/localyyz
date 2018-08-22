import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";

// third party
import PropTypes from "prop-types";
import EntypoIcon from "react-native-vector-icons/Entypo";

// custom
import { Colours, Sizes } from "localyyz/constants";

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

    // bindings
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.setState({ isActive: !this.state.isActive }, this.props.onPress);
  }

  componentDidUpdate(prevProps, prevState) {
    // if the user double tapped and it was previously inActive set to Active
    if (this.props.doubleTap === true && prevState.isActive === false) {
      this.setState({isActive: true})
      // edge case -> user double taps twice on a product to like -> unlike using icon -> like again
    } else if (this.props.doubleTap === false && prevProps.doubleTap === true && prevState.isActive === false){
      this.setState({isActive: true})
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View style={styles.container}>
          <EntypoIcon
            style={styles.icon}
            color={this.state.isActive ? Colours.Text : Colours.AlternateText}
            name="heart"
            size={Sizes.InnerFrame}/>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginRight: Sizes.InnerFrame / 2,
    alignItems: "center",
    justifyContent: "center",
    height: Sizes.OuterFrame,
    width: Sizes.OuterFrame,
    borderRadius: Sizes.OuterFrame / 2,
    backgroundColor: Colours.Action
  },

  icon: {
    marginTop: 4,
    marginLeft: 1
  }
});
import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";

// third party
import PropTypes from "prop-types";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { observer } from "mobx-react/native";

// custom
import { Sizes } from "~/src/constants";

@observer
export default class Favourite extends React.Component {
  static propTypes = {
    product: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isFavourite: props.product.isFavourite
    };
  }

  onPress = () => {
    this.setState(
      { isFavourite: !this.state.isFavourite },
      this.props.toggleFavourite
    );
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <EntypoIcon
          name={this.state.isFavourite ? "heart" : "heart-outlined"}
          size={Sizes.ActionButton}
          color={"black"}/>
      </TouchableWithoutFeedback>
    );
  }
}

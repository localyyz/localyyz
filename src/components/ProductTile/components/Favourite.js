import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";

// third party
import PropTypes from "prop-types";
import EntypoIcon from "react-native-vector-icons/Entypo";
import {
  inject,
  observer,
} from "mobx-react/native";

// custom
import { Colours, Sizes } from "localyyz/constants";

@inject((props) => {props.product})
@observer
export default class Favourite extends React.Component {
  static propTypes = {
    product: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.product.toggleFavourite}>
        <View style={styles.container}>
          <EntypoIcon
            style={styles.icon}
            color={this.props.product.isFavourite ? Colours.Text : Colours.AlternateText}
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
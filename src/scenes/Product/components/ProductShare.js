import React from "react";
import { Alert, Share } from "react-native";
import PropTypes from "prop-types";

// custom
import { Sizes } from "localyyz/constants";

// third party
import Icon from "react-native-vector-icons/Feather";

export default class ProductShare extends React.Component {
  static propTypes = {
    product: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  onPress = async () => {
    await this.props.product.generateDeepLink().then(
      url => {
        Share.share(
          {
            message: this.props.product.title,
            url: url,
            title: "Localyyz"
          },
          {
            // Android only:
            dialogTitle: this.props.product.title,
            // iOS only:
            excludedActivityTypes: []
          }
        );
      },
      () => {
        Alert.alert(
          "Error",
          "Sharing is unavailable at the moment. Please try again later",
          [
            {
              text: "OK",
              onPress: () => {}
            }
          ],
          { cancelable: true }
        );
      }
    );
  };

  render() {
    return (
      <Icon.Button
        name="share"
        color="black"
        backgroundColor="transparent"
        iconStyle={{ marginRight: 5 }}
        size={Sizes.ActionButton}
        onPress={this.onPress}/>
    );
  }
}

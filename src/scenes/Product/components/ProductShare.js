import React from "react";
import { TouchableOpacity, StyleSheet, Alert, Share } from "react-native";
import PropTypes from "prop-types";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";

// third party
import { inject, observer } from "mobx-react/native";
import Icon from "react-native-vector-icons/Feather";
import { ifIphoneX } from "react-native-iphone-x-helper";

@inject(stores => ({
  product: stores.productStore.product,

  // today's deal
  isDeal: !!stores.dealStore,

  // deeplink
  generateProductDeeplink: (
    productID,
    productTitle,
    productDescription,
    isDeal
  ) =>
    stores.productStore.generateProductDeeplink(
      productID,
      productTitle,
      productDescription,
      isDeal
    )
}))
@observer
export default class ProductShare extends React.Component {
  static propTypes = {
    product: PropTypes.object,
    isDeal: PropTypes.bool,
    generateProductDeeplink: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  async shareProduct() {
    await this.props
      .generateProductDeeplink(
        this.props.product.id,
        this.props.product.title,
        this.props.product.description,
        this.props.isDeal
      )
      .then(
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
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.shareButton}
        onPress={() => {
          this.shareProduct();
        }}>
        <Icon name="share" size={15} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  shareButton: {
    position: "absolute",
    top: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    height: Sizes.InnerFrame * 2,
    paddingHorizontal: Sizes.InnerFrame,
    borderRadius: Sizes.InnerFrame * 2 / 3,
    marginHorizontal: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground,
    ...ifIphoneX(
      {
        marginVertical: Sizes.InnerFrame * 2.25
      },
      {
        marginVertical: Sizes.InnerFrame * 1.25
      }
    )
  }
});

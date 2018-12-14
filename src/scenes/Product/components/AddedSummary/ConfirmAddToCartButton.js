import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

// third party
import { inject, observer } from "mobx-react/native";
import { withNavigation } from "react-navigation";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import { toPriceString } from "localyyz/helpers";

const ADD_STATE = {
  START: "start",
  SUCCESS: "success",
  ERROR: "error"
};

@inject(stores => ({
  // regular checkout (add)
  addProduct: stores.cartStore.addProduct,
  product: stores.productStore.product,
  selectedVariant: stores.productStore.selectedVariant
}))
@observer
export class ConfirmAddToCartButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addState: ""
    };
  }

  onAdd = () => {
    this.setState({ addState: ADD_STATE.START });

    this.props
      .addProduct({
        product: this.props.product,
        variantId: this.props.selectedVariant.id
      })
      .then(resolved => {
        this.setState(
          {
            addState: resolved.error ? ADD_STATE.ERROR : ADD_STATE.SUCCESS,
            error: resolved.error
          },
          () => {
            if (!resolved.error) {
              setTimeout(() => {
                this.props.navigation.goBack();
              }, 1000);
            }
          }
        );
      });
  };

  render() {
    let content;

    switch (this.state.addState) {
      case ADD_STATE.START:
        content = (
          <View style={[styles.addButton, { justifyContent: "center" }]}>
            <ActivityIndicator size={"small"} color={"white"} />
          </View>
        );
        break;
      case ADD_STATE.SUCCESS:
        content = (
          <View style={[styles.addButton, { justifyContent: "flex-start" }]}>
            <View style={{ paddingRight: Sizes.OuterFrame }}>
              <MaterialIcon
                name="check"
                color={Colours.AlternateText}
                size={Sizes.H2}
                style={styles.addButtonIcon}/>
            </View>
            <Text style={styles.addButtonLabel}>Added to cart</Text>
          </View>
        );
        break;
      case ADD_STATE.ERROR:
        content = (
          <View style={[styles.addButton, { justifyContent: "flex-start" }]}>
            <View
              style={{
                paddingRight: Sizes.OuterFrame
              }}>
              <MaterialIcon
                name="close"
                color={Colours.AlternateText}
                size={Sizes.H2}
                style={styles.addButtonIcon}/>
            </View>
            <Text style={styles.addButtonLabel}>{this.state.error}</Text>
          </View>
        );
        break;
      default:
        content = (
          <View style={styles.addButton}>
            <Text style={styles.addButtonLabel}>Add to cart</Text>
            <View style={styles.addButtonDetails}>
              <Text style={styles.addButtonLabel}>
                {toPriceString(this.props.selectedVariant.price)}
              </Text>
              <MaterialIcon
                name="add-shopping-cart"
                color={Colours.AlternateText}
                size={Sizes.H2}
                style={styles.addButtonIcon}/>
            </View>
          </View>
        );

      //
    }

    return (
      <TouchableOpacity activeOpacity={0.9} onPress={this.onAdd}>
        <View>{content}</View>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(ConfirmAddToCartButton);

const styles = StyleSheet.create({
  addButton: {
    ...Styles.RoundedButton,
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    paddingHorizontal: Sizes.OuterFrame,
    paddingVertical: Sizes.OuterFrame / 2,
    borderRadius: Sizes.OuterFrame,
    backgroundColor: Colours.Accented
  },

  addButtonLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate
  },

  addButtonDetails: {
    ...Styles.Horizontal
  },

  addButtonIcon: {
    marginLeft: Sizes.InnerFrame / 2
  }
});
